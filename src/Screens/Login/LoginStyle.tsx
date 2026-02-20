import {StyleSheet} from "react-native";
import {colors, FontsFamily} from "../../Constant/AllImports";
import {scale, verticalScale} from "react-native-size-matters";
let LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: verticalScale(50),
    paddingBottom: 20,
    backgroundColor: colors.White,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  mainHeading: {
    fontSize: 20,
    // fontWeight: '700',
    color: colors.Black,
    marginRight: 8,
    fontFamily: FontsFamily.poppinsMedium,
  },
  description: {
    fontSize: 12,
    color: "#6c757d",
    // marginTop: 8,
    textAlign: "center",
    fontFamily: FontsFamily.poppinsSemiBold,
  },
  formContainer: {
    backgroundColor: colors.White,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  formInnerContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
    fontFamily: "Inter_600SemiBold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  countryCode: {
    fontSize: 16,
    color: "#495057",
    marginRight: 8,
    fontFamily: "Inter_500Medium",
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: scale(14),
    color: colors.Black,
    fontFamily: "Inter_500Medium",
  },
  errorText: {
    fontSize: 12,
    color: "#ff6b6b",
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    height: 56,
    width: 200,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.White,
    fontFamily: "Inter_600SemiBold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#dee2e6",
  },
  dividerText: {
    fontSize: 14,
    color: "#adb5bd",
    marginHorizontal: 12,
    fontFamily: "Inter_500Medium",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    backgroundColor: colors.White,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
  },
  footerLink: {
    color: "#4e54c8",
    fontWeight: "600",
  },
});
export default LoginStyle;
