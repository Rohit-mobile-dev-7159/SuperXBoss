import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import axios from 'axios';
import Variable from '../../../Constant/Variable';
import {useCreateAddress} from '../../../Services/Main/Hooks';
import {showErrorAlert, showSuccessAlert} from '../../../Constant/ShowDailog';
import colors from '../../../Style/Color';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AddressSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required('Required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid')
    .required('Required'),
  address: Yup.string().min(5).required('Required'),
});

const AddressModal = ({visible, onClose}: any) => {
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [isDefault, setIsDefault] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [latLong, setLatLong] = useState<number[]>([]);
  const {mutate, isPending} = useCreateAddress();
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setLoadingAddress(true);
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input: query,
            key: Variable.GOOGLE_API_KEY,
            components: 'country:in',
          },
        },
      );

      if (response.data.predictions) {
        setAddressSuggestions(response.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const debouncedFetchAddress = debounce(fetchAddressSuggestions, 500);

  const handleAddressSelect = async (item: any, setFieldValue: any) => {
    Keyboard.dismiss();
    setFieldValue('address', item.description);
    setAddressSuggestions([]);
    setIsAddressFocused(false);

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: item.place_id,
            key: Variable.GOOGLE_API_KEY,
            // fields: 'address_component',
            fields: 'address_component,geometry',
          },
        },
      );
      const location = response.data.result.geometry?.location;
      setLatLong([location?.lng, location?.lat]);
      const addressComponents = response.data.result.address_components;
      let state = '';
      let city = '';
      let pincode = '';

      addressComponents.forEach((component: any) => {
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (
          component.types.includes('locality') ||
          component.types.includes('postal_town')
        ) {
          city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });

      // Auto-fill the fields
      setFieldValue('city', city);
      setFieldValue('state', state);
      if (pincode) {
        setFieldValue('pinCode', pincode);
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <Animated.View
        style={styles.container}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Formik
          initialValues={{
            name: '',
            mobile: '',
            pinCode: '',
            address: '',
            city: '',
            state: '',
          }}
          validationSchema={AddressSchema}
          onSubmit={values => {
            const payload = {
              ...values,
              label: addressType,
              isDefault,
              coordinates: latLong,
            };

            mutate(payload, {
              onSuccess: data => {
                if (data.success) {
                  onClose();
                  showSuccessAlert(data.message);
                }
              },
              onError: error => {
                console.error('Failed:', error.message);
                Alert.alert(error.message);
              },
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.header}>Contact Information</Text>

              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputRow}>
                  <AnimatedTextInput
                    style={[
                      styles.input,
                      errors.name && touched.name && styles.inputError,
                      {flex: 1},
                    ]}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder="Enter full name"
                    placeholderTextColor="#999"
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.errorTextRight}>{errors.name}</Text>
                  )}
                </View>
              </View>

              {/* Contact Number */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contact Number</Text>
                <View style={styles.inputRow}>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCode}>
                      <Text style={styles.countryCodeText}>+91</Text>
                    </View>
                    <AnimatedTextInput
                      style={[
                        styles.input,
                        styles.phoneInput,
                        errors.mobile && touched.mobile && styles.inputError,
                      ]}
                      onChangeText={handleChange('mobile')}
                      onBlur={handleBlur('mobile')}
                      value={values.mobile}
                      placeholder="Enter contact number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                  {errors.mobile && touched.mobile && (
                    <Text style={styles.errorTextRight}>{errors.mobile}</Text>
                  )}
                </View>
              </View>

              <Text style={[styles.header, {marginTop: 20}]}>
                Delivery Address
              </Text>

              {/* Street Address with Autocomplete */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Street Address</Text>
                <View style={styles.inputRow}>
                  <AnimatedTextInput
                    style={[
                      styles.input,
                      {height: 60},
                      errors.address && touched.address && styles.inputError,
                      {flex: 1},
                    ]}
                    onChangeText={text => {
                      handleChange('address')(text);
                      debouncedFetchAddress(text);
                    }}
                    onBlur={handleBlur('address')}
                    onFocus={() => setIsAddressFocused(true)}
                    value={values.address}
                    placeholder="Start typing your address..."
                    placeholderTextColor="#999"
                    multiline
                  />
                  {loadingAddress && (
                    <ActivityIndicator size="small" color="#0984e3" />
                  )}
                  {errors.address && touched.address && (
                    <Text style={styles.errorTextRight}>{errors.address}</Text>
                  )}
                </View>
                {isAddressFocused && addressSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={addressSuggestions}
                      keyExtractor={item => item.place_id}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.suggestionItem}
                          onPress={() =>
                            handleAddressSelect(item, setFieldValue)
                          }
                        >
                          <Text style={styles.suggestionText}>
                            {item.description}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps="always"
                    />
                  </View>
                )}
              </View>

              {/* Pin Code (Read-only) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pin Code</Text>
                <View style={styles.inputRow}>
                  <AnimatedTextInput
                    style={[
                      styles.input,
                      styles.readOnlyInput,
                      errors.pinCode && touched.pinCode && styles.inputError,
                      {flex: 1},
                    ]}
                    value={values.pinCode}
                    placeholder="Will auto-fill from address"
                    placeholderTextColor="#999"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              {/* City (Read-only) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputRow}>
                  <AnimatedTextInput
                    style={[
                      styles.input,
                      styles.readOnlyInput,
                      errors.city && touched.city && styles.inputError,
                      {flex: 1},
                    ]}
                    value={values.city}
                    placeholder="Will auto-fill from address"
                    placeholderTextColor="#999"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              {/* State (Read-only) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>State</Text>
                <View style={styles.inputRow}>
                  <AnimatedTextInput
                    style={[
                      styles.input,
                      styles.readOnlyInput,
                      errors.state && touched.state && styles.inputError,
                      {flex: 1},
                    ]}
                    value={values.state}
                    placeholder="Will auto-fill from address"
                    placeholderTextColor="#999"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              {/* Address Type */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address Type</Text>
                <View style={styles.addressTypeContainer}>
                  {['Home', 'Office', 'Other'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addressTypeButton,
                        addressType === type && styles.addressTypeSelected,
                      ]}
                      onPress={() => setAddressType(type)}
                    >
                      <Text
                        style={
                          addressType === type
                            ? styles.addressTypeTextSelected
                            : styles.addressTypeText
                        }
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Default Checkbox */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setIsDefault(!isDefault)}
                >
                  {isDefault ? (
                    <Text style={styles.checkboxChecked}>✓</Text>
                  ) : (
                    <Text style={styles.checkboxUnchecked}>□</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>
                  Use as default delivery address.
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={() => handleSubmit()}
                >
                  {isPending ? (
                    <ActivityIndicator size={'small'} color={colors.White} />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#7f8c8d',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#2d3436',
  },
  readOnlyInput: {
    backgroundColor: '#f5f6fa',
    color: '#7f8c8d',
  },
  inputError: {
    borderColor: '#e17055',
  },
  errorTextRight: {
    position: 'absolute',
    color: '#e17055',
    fontSize: 11,
    maxWidth: 100,
    right: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  countryCode: {
    padding: 10,
    backgroundColor: '#f1f2f6',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
  },
  addressTypeSelected: {
    backgroundColor: '#0984e3',
    borderColor: '#0984e3',
  },
  addressTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  addressTypeTextSelected: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    fontSize: 13,
    color: '#0984e3',
  },
  checkboxUnchecked: {
    fontSize: 13,
    color: 'transparent',
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#0984e3',
  },
  cancelButton: {
    backgroundColor: '#e17055',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    maxHeight: 200,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2d3436',
  },
});

export default AddressModal;
