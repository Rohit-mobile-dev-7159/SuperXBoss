import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {WebView} from "react-native-webview";
import {usePrivacyPolicy} from "../../Services/Main/Hooks";
import MainStyle from "../../Styles/MainStyle";

const PrivacyPolicy = () => {
  const {data} = usePrivacyPolicy();
  return (
    <View testID="wrapper" style={styles.container}>
      {!data?._payload?.privacyPolicy?.url ? (
        <View testID="N/F" style={[MainStyle.flexCloumn, {flex: 1}]}>
          <Text>No Privacy Policy Found</Text>
        </View>
      ) : (
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              data?._payload?.privacyPolicy?.url,
            )}`,
          }}
          style={styles.webview}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
  },
  webview: {
    flex: 1,
  },
});

export default PrivacyPolicy;
