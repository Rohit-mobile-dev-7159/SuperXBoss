import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import React, {useRef, useState} from "react";
import OTPTextInput from "react-native-otp-textinput";
import {SafeAreaView} from "react-native-safe-area-context";
import {scale, verticalScale} from "react-native-size-matters";
import {useDispatch} from "react-redux";
import {
  AllUrls,
  ImagePath,
  NavigationString,
  colors,
  showErrorAlert,
} from "../../Constant/AllImports";
import MainStyle from "../../Styles/MainStyle";
import {setToken} from "../../Redux/Slices/Token";
import {useNavigation} from "@react-navigation/native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LoginStyle from "./LoginStyle";

const Otp = (props: any) => {
  const data = props.route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [allBoolean, setAllBoolean] = useState<any>({isLoading: false});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const otpInput = useRef<OTPTextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const animation = useSharedValue(1);
  const [isSubmitted, setIsSubmitted] = useState(true);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(animation.value, [0, 1], [50, 300]);
    return {
      width,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
    };
  });

  const handleVerify = async () => {
    setAllBoolean((prev: any) => ({...prev, isLoading: true}));
    const fcm_token = await messaging().getToken();
    const otp = Number(otpInput.current?.state.otpText.join(""));
    const data1 = {
      ...data,
      otp: String(otp),
      fcm_token,
    };

    if (animation.value === 1) {
      animation.value = withTiming(0, {duration: 500});
      setIsSubmitted(false);
    }
    try {
      const response = await axios.post(`${AllUrls.OtpVerify}`, data1);
      if (response.data.type === "success") {
        if (!response.data._payload.type) {
          setAllBoolean((prev: any) => ({...prev, isLoading: false}));
          dispatch(setToken({...response.data._payload}));
          props.navigation.reset({
            index: 0,
            routes: [
              {name: NavigationString.UserInfo, data: {mobile: data1.mobile}},
            ],
          });
        } else {
          setAllBoolean((prev: any) => ({...prev, isLoading: false}));
          dispatch(setToken({...response.data._payload}));
          navigation.reset({
            index: 0,
            routes: [{name: NavigationString.Home as never}],
          });
        }
      }
    } catch (error: any) {
      showErrorAlert(error?.response.data.statusCode);
      setAllBoolean((prev: any) => ({...prev, isLoading: false}));
    } finally {
      animation.value = withTiming(1, {duration: 500});
      setIsSubmitted(true);
    }
  };

  const focusOnInput = () => {
    if (scrollViewRef.current && keyboardVisible) {
      scrollViewRef.current.scrollTo({y: 200, animated: true});
    }
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        focusOnInput();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  console.log(allBoolean);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.White}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            {/* <View style={[MainStyle.flexLeft, { gap: 10 }]}>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <ImagePath.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                            <View style={{}}>
                                <Text style={styles.headerTitle}>Verify Code</Text>
                            </View>
                        </View> */}

            <View style={[MainStyle.flexRow, {marginVertical: 30}]}>
              <ImagePath.Logo width={250} height={60} />
            </View>
            {/* Illustration and Text */}
            <View
              style={[
                MainStyle.flexCloumn,
                {alignItems: "center", marginBottom: 20},
              ]}
            >
              <Text style={styles.mainHeading}>Enter Verification Code</Text>
              <Text style={styles.subHeading}>
                Please type the verification code sent to
              </Text>
              <Text
                style={[
                  styles.subHeading,
                  {color: colors.Black, fontWeight: "500"},
                ]}
              >
                +91-{data.mobile}
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              <OTPTextInput
                ref={otpInput}
                inputCount={4}
                tintColor={colors.primary}
                offTintColor={colors.DGray}
                autoFocus
                handleTextChange={focusOnInput}
                textInputStyle={styles.otpInput}
                containerStyle={styles.otpInputContainer}
              />
            </View>

            <View style={{justifyContent: "center", alignItems: "center"}}>
              <LinearGradient
                colors={["#1B4B66", "#1B4B66"]}
                style={[LoginStyle.gradient, {marginTop: 30}, animatedStyle]}
              >
                <AnimatedTouchableOpacity
                  style={[{}, animatedStyle]}
                  onPress={() => {
                    handleVerify();
                  }}
                  activeOpacity={0.4}
                  // disabled={
                  //     allBoolean.isLoading ||
                  //     !(
                  //         otpInput.current &&
                  //         otpInput.current.state &&
                  //         Array.isArray(otpInput.current.state.otpText) &&
                  //         otpInput.current.state.otpText.join("").length === 4
                  //     )
                  // }
                >
                  {isSubmitted ? (
                    <Text
                      style={{color: "#fff", fontWeight: "bold", fontSize: 15}}
                    >
                      Continue
                    </Text>
                  ) : (
                    <ActivityIndicator size={"small"} color={colors.White} />
                  )}
                </AnimatedTouchableOpacity>
              </LinearGradient>
            </View>

            {/* Resend Code Option */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn&#39;t receive code?</Text>
              <TouchableOpacity activeOpacity={0.6}>
                <Text style={styles.resendButton}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
    padding: verticalScale(10),
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 18,
    color: colors.Black,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.Black,
    marginTop: 24,
    marginBottom: 8,
    fontFamily: "Poppins-SemiBold",
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.DGray,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  otpContainer: {
    alignItems: "center",
  },
  otpInputContainer: {
    marginHorizontal: scale(20),
  },
  otpInput: {
    width: scale(45),
    height: scale(60),
    borderWidth: 1,
    borderColor: colors.LGray,
    borderRadius: 10,
    backgroundColor: colors.White,
    color: colors.Black,
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  submitButton: {
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#FF6347",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.White,
    fontFamily: "Poppins-SemiBold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: colors.DGray,
    fontFamily: "Poppins-Regular",
  },
  resendButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
    fontFamily: "Poppins-SemiBold",
  },
});

export default Otp;
