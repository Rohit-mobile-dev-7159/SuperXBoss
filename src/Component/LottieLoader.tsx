import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import colors from "../Style/Color";
import MainStyle from "../Styles/MainStyle";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../Constant/NavigationString";

const {width, height} = Dimensions.get("window");

const LottieLoader = ({url}: {url: any}) => {
  const Navigation: any = useNavigation();
  return (
    <View style={styles.container} testID="lottie-loader">
      <LottieView source={url} autoPlay loop style={styles.animation} />
      <View
        style={[
          MainStyle.flexCloumn,
          {gap: 30, position: "absolute", bottom: 200},
        ]}
      >
        <Text style={styles.headline}>No Items Found</Text>
        <TouchableOpacity
          onPress={() => {
            Navigation.navigate(NavigationString.Home);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Search More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LottieLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  headline: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },
  animationContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  animation: {
    width: width * 0.85,
    height: 300,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: colors.DBlue,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
