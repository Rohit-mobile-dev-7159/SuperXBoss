import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import Styles from '../../Styles/Styles';
import ImagePath from '../../Constant/ImagePath';
import colors from '../../Style/Color';
import Variable from '../../Constant/Variable';
import {useNavigation} from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import {setToken} from '../../Redux/Slices/Token';
import {useCustomerUpdate} from '../../Services/User/Hooks';
import {showErrorAlert, showSuccessAlert} from '../../Constant/ShowDailog';

const businessType = [
  {label: 'B2B', value: '1'},
  {label: 'B2C', value: '2'},
  {label: 'C2C', value: '3'},
  {label: 'B2G', value: '4'},
];

interface AddressData {
  description: string;
  place_id: string;
}

interface FormValues {
  name: string;
  email: string;
  reference_code: string;
  business_type: string;
  type: string;
  business_name: string;
  gst_number: string;
  business_contact_no: string;
  state: string;
  city: string;
  pinCode: string;
  address: string;
  latitude: any;
  longitude: any;
}

const UserInfo = () => {
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    reference_code: '',
    business_type: '',
    type: '',
    business_name: '',
    gst_number: '',
    business_contact_no: '',
    state: '',
    city: '',
    pinCode: '',
    address: '',
    longitude: '',
    latitude: '',
  });

  const [addressSuggestions, setAddressSuggestions] = useState<AddressData[]>(
    [],
  );
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [currentUserType, updateUserType] = useState('customer');
  const userData = useSelector((state: any) => state.token.token);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {mutate, isPending} = useCustomerUpdate();
  const addressInputRef = useRef<TextInput>(null);

  // Custom debounce function
  const customDebounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounce the address search with custom function
  const debouncedSearch = useRef(
    customDebounce(async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            {
              params: {
                input: searchTerm,
                key: Variable.GOOGLE_API_KEY,
                components: 'country:in',
              },
            },
          );
          setAddressSuggestions(response.data.predictions || []);
        } catch (error) {
          setAddressSuggestions([]);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 500),
  ).current;

  useEffect(() => {
    return () => {
      clearTimeout(debouncedSearch as any);
    };
  }, [debouncedSearch]);

  const handleAddressChange = (text: string) => {
    setFormData(prev => ({...prev, address: text}));
    debouncedSearch(text);
  };

  const handleAddressSelect = async (item: AddressData) => {
    try {
      // Hide keyboard when suggestion is selected
      Keyboard.dismiss();

      // First update the address field immediately
      setFormData(prev => ({...prev, address: item.description}));
      setAddressSuggestions([]);
      setIsAddressFocused(false);

      // Then fetch the place details
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
      const latitude = location?.lat;
      const longitude = location?.lng;
      // Extract address components
      const addressComponents = response.data.result.address_components;
      let state = '';
      let city = '';
      let pinCode = '';

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
          pinCode = component.long_name;
        }
      });

      // Update all address fields at once
      setFormData(prev => ({
        ...prev,
        state,
        city,
        pinCode,
        latitude,
        longitude,
      }));
    } catch (error) {}
  };

  const handleChange = (field: keyof FormValues) => (text: string) => {
    setFormData(prev => ({...prev, [field]: text}));
  };

  const handleSubmitForm = () => {
    const payload = {
      ...formData,
      type: currentUserType,
      customerId: userData._id,
    };

    mutate(payload, {
      onSuccess: data => {
        if (data.success) {
          showSuccessAlert(data.message);
          dispatch(setToken({...data._payload, token: userData.token}));
          navigation.reset({
            index: 0,
            routes: [{name: NavigationString.Home as never}],
          });
        } else {
          showErrorAlert(data.message);
        }
      },
    });
  };

  return (
    <View testID="wrapper" style={{flex: 1, paddingTop: 30}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={Styles.logo}>
              <ImagePath.Logo width={150} height={50} />
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={Styles.heading}>Add your Information</Text>
            </View>

            <View>
              <Text style={styles.personalInfo}>Personal Information</Text>
              <View>
                <TextInput
                  placeholder="Name"
                  style={Styles.input}
                  placeholderTextColor="#1B4B66"
                  onChangeText={handleChange('name')}
                  value={formData.name}
                />
                <TextInput
                  placeholder="Email..."
                  style={Styles.input}
                  placeholderTextColor="#1B4B66"
                  onChangeText={handleChange('email')}
                  value={formData.email}
                  keyboardType="email-address"
                />
                <TextInput
                  placeholder="Referral code...."
                  style={Styles.input}
                  placeholderTextColor="#1B4B66"
                  onChangeText={handleChange('reference_code')}
                  value={formData.reference_code}
                  autoCapitalize="characters"
                />

                {/* Address Search with Autocomplete */}
                <View style={{marginTop: 10}}>
                  <TextInput
                    ref={addressInputRef}
                    placeholder="Address"
                    style={Styles.input}
                    placeholderTextColor="#1B4B66"
                    value={formData.address}
                    onChangeText={handleAddressChange}
                    onFocus={() => setIsAddressFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsAddressFocused(false), 200)
                    }
                  />
                  {isAddressFocused && addressSuggestions.length > 0 && (
                    <View
                      testID="address-suggestion"
                      style={styles.suggestionsContainer}
                    >
                      <FlatList
                        data={addressSuggestions}
                        keyExtractor={item => item.place_id}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            testID={item.place_id}
                            style={styles.suggestionItem}
                            onPress={() => handleAddressSelect(item)}
                          >
                            <Text style={styles.suggestionText}>
                              {item.description}
                            </Text>
                          </TouchableOpacity>
                        )}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="always"
                      />
                    </View>
                  )}
                </View>

                {/* Auto-filled address details */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextInput
                    placeholder="State"
                    style={[Styles.input, {width: '48%'}]}
                    placeholderTextColor="#1B4B66"
                    value={formData.state}
                    editable={false}
                  />
                  <TextInput
                    placeholder="City"
                    style={[Styles.input, {width: '48%'}]}
                    placeholderTextColor="#1B4B66"
                    value={formData.city}
                    editable={false}
                  />
                </View>
                <TextInput
                  placeholder="pinCode"
                  style={Styles.input}
                  placeholderTextColor="#1B4B66"
                  value={formData.pinCode}
                  editable={false}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text style={styles.personalInfo}>Choose your type</Text>
                <View style={styles.radioWrapper}>
                  <TouchableOpacity
                    testID="updateType"
                    style={
                      currentUserType === 'customer'
                        ? styles.ActiveUserButton
                        : styles.UserButton
                    }
                    onPress={() => updateUserType('customer')}
                  >
                    <RadioButton
                      value="first"
                      status={
                        currentUserType === 'customer' ? 'checked' : 'unchecked'
                      }
                      color={colors.DBlue}
                    />
                    <View style={{alignItems: 'center'}}>
                      <ImagePath.Customer
                        fill={
                          currentUserType === 'customer' ? '#1B4B66' : 'gray'
                        }
                        width={60}
                        height={60}
                      />
                      <Text style={styles.radioText}>Customer</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="typeB2b"
                    style={
                      currentUserType === 'b2b'
                        ? styles.ActiveUserButton
                        : styles.UserButton
                    }
                    onPress={() => updateUserType('b2b')}
                  >
                    <RadioButton
                      value="first"
                      status={
                        currentUserType === 'b2b' ? 'checked' : 'unchecked'
                      }
                      color={colors.DBlue}
                    />
                    <View style={{alignItems: 'center'}}>
                      <ImagePath.Business
                        fill={currentUserType === 'b2b' ? '#1B4B66' : 'gray'}
                        width={60}
                        height={60}
                      />
                      <Text style={styles.radioText}>B2B</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {currentUserType === 'b2b' && (
                  <View style={{marginTop: 20}}>
                    <Text style={styles.personalInfo}>
                      Business Information
                    </Text>
                    <View>
                      <Dropdown
                        testID="dropdown"
                        style={[
                          styles.dropdown,
                          isFocus && {borderColor: 'blue'},
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{color: colors.DBlue}}
                        data={businessType}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Business Type' : '...'}
                        searchPlaceholder="Search..."
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFormData(prev => ({
                            ...prev,
                            business_type: item.label,
                          }));
                          setIsFocus(false);
                        }}
                      />
                      <TextInput
                        placeholder="Business Name"
                        style={Styles.input}
                        placeholderTextColor="#1B4B66"
                        onChangeText={handleChange('business_name')}
                        value={formData.business_name}
                      />
                      <TextInput
                        placeholder="GST Number"
                        style={Styles.input}
                        placeholderTextColor="#1B4B66"
                        onChangeText={handleChange('gst_number')}
                        value={formData.gst_number}
                      />
                      <TextInput
                        placeholder="Business Contact Number"
                        style={Styles.input}
                        placeholderTextColor="#1B4B66"
                        onChangeText={handleChange('business_contact_no')}
                        value={formData.business_contact_no}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                )}

                {/* <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
                  <BouncyCheckbox
                    size={18}
                    fillColor="#1B4B66"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderRadius: 2 }}
                    innerIconStyle={{ borderRadius: 2 }}
                  />
                  <Text style={{ fontSize: 16, marginRight: 2, color: "darkgray" }}>I Accept</Text>
                  <TouchableHighlight>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.DBlue }}>Terms & Condition</Text>
                  </TouchableHighlight>
                </View> */}
                <TouchableOpacity
                  style={[Styles.button, {marginBottom: 49, marginTop: 20}]}
                  onPress={handleSubmitForm}
                  disabled={isPending}
                >
                  <Text style={Styles.next}>
                    {isPending ? 'SUBMITTING...' : 'SUBMIT'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  personalInfo: {
    fontSize: 16,
    color: colors.DBlue,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: colors.LGray,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    fontSize: 20,
    color: colors.DBlue,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.DBlue,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.DBlue,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.DBlue,
  },
  UserButton: {
    width: '48%',
    height: 150,
    backgroundColor: colors.LGray,
    borderRadius: 20,
    padding: 10,
  },
  ActiveUserButton: {
    width: '48%',
    height: 150,
    backgroundColor: colors.LGray,
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.DBlue,
  },
  radioText: {
    fontFamily: 'Raleway-Bold',
    fontSize: 15,
    color: colors.DBlue,
    fontWeight: '600',
    marginTop: 4,
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    elevation: 3,
    borderRadius: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    color: colors.DBlue,
  },
});

export default UserInfo;
