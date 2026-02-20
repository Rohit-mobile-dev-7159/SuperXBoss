import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Styles from '../../Styles/Styles';
import {
  showSuccessAlert,
  NavigationString,
  AllUrls,
  showErrorAlert,
} from '../../Constant/AllImports';
import colors from '../../Style/Color';
import Schemas from '../../Schemas';
import {SafeAreaView} from 'react-native-safe-area-context';
import {loginApiPayload} from '../../Services/User/types';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MainStyle from '../../Styles/MainStyle';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Lottie from 'lottie-react-native';
const Login = () => {
  const Navigation: any = useNavigation();
  const [loading, setLoading] = useState(false);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const animation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(animation.value, [0, 1], [50, 300]);
    return {
      width,
    };
  });

  const handleLogin = async (value: loginApiPayload) => {
    if (animation.value === 1) {
      animation.value = withTiming(0, {duration: 500});
    } else {
      animation.value = withTiming(1, {duration: 500});
    }

    try {
      setLoading(true);
      const response = await axios.post(AllUrls.Login, value);
      if (response.data.type === 'success') {
        animation.value = withTiming(1, {duration: 500});
        showSuccessAlert(response.data.message);
        Navigation.navigate(NavigationString.Otp, value);
      }
    } catch (error: any) {
      animation.value = withTiming(1, {duration: 500});
      showErrorAlert(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}} testID="login">
      <View style={{flex: 1}}>
        <Lottie
          source={require('../../lottie/Login.json')}
          autoPlay
          loop
          style={{width: '100%', height: '35%'}}
        />
        <Formik
          initialValues={{mobile: ''}}
          validateOnMount={true}
          onSubmit={values => {
            handleLogin(values);
          }}
          validationSchema={Schemas.LoginSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingTop: 50,
                }}
              >
                {/* <View style={Styles.logo}>
                                    <ImagePath.Logo width={250} />
                                </View> */}
                {/* <Text style={Styles.heading}>Login</Text> */}
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Text style={styles.code}>+91</Text>
                  <Text
                    style={{
                      width: 2,
                      height: 46,
                      backgroundColor: '#949494',
                      position: 'absolute',
                      zIndex: 1,
                      left: '20%',
                      top: 7,
                    }}
                  />
                  <TextInput
                    testID="mobile_input"
                    placeholder="Enter mobile number"
                    style={styles.mobile}
                    placeholderTextColor="#1B4B66"
                    onChangeText={handleChange('mobile')}
                    onBlur={handleBlur('mobile')}
                    keyboardType={'number-pad'}
                    value={values.mobile}
                    maxLength={10}
                  />
                  {errors.mobile && touched.mobile ? (
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 10,
                        textAlign: 'right',
                        position: 'absolute',
                        top: 70,
                        right: 10,
                      }}
                    >
                      {errors.mobile}
                    </Text>
                  ) : null}
                  <View
                    style={[
                      MainStyle.flexRow,
                      {width: '100%', marginBottom: 50},
                    ]}
                  >
                    <AnimatedTouchableOpacity
                      testID={'submit'}
                      style={
                        isValid
                          ? [styles.button, animatedStyle]
                          : [
                              styles.button,
                              {backgroundColor: 'lightgray'},
                              animatedStyle,
                            ]
                      }
                      onPress={() => handleSubmit()}
                    >
                      {!loading ? (
                        <Text style={Styles.next}>NEXT</Text>
                      ) : (
                        <ActivityIndicator
                          size={'small'}
                          color={colors.White}
                        />
                      )}
                    </AnimatedTouchableOpacity>
                  </View>
                </View>
                <View style={styles.middle}>
                  <Text style={styles.line} />
                  <Text
                    style={{fontSize: 14, fontWeight: 400, color: colors.DBlue}}
                  >
                    OR
                  </Text>
                  <Text style={styles.line} />
                </View>
                <View style={styles.guestLOgin}>
                  <Text style={styles.guestLOginText}>YOU CAN ALSO</Text>
                  <TouchableOpacity>
                    <Text style={[styles.guestLOginText, {fontWeight: 800}]}>
                      LOGIN AS GUEST
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.DBlue,
    // width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 50,

    // marginBottom: 87
  },
  code: {
    position: 'absolute',
    fontSize: 15,
    top: 20,
    left: '10%',
    zIndex: 1,
    color: '#1B4B66',
  },
  mobile: {
    width: '100%',
    height: 60,
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    fontSize: 15,
    color: '#1B4B66',
    paddingLeft: 100,
    marginBottom: 30,
  },
  line: {
    width: 115,
    height: 1,
    backgroundColor: colors.DBlue,
  },
  middle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestLOgin: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  guestLOginText: {
    fontSize: 16,
    color: colors.DBlue,
  },
});
