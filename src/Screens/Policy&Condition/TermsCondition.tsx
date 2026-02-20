import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {WebView} from "react-native-webview";
import {usePrivacyPolicy} from "../../Services/Main/Hooks";
import MainStyle from "../../Styles/MainStyle";

const TermsCondition = () => {
  const {data} = usePrivacyPolicy();
  return (
    <View style={styles.container} testID="wrapper">
      {!data?._payload?.termsCondition?.url ? (
        <View testID="N/F" style={[MainStyle.flexCloumn, {flex: 1}]}>
          <Text>No Privacy Policy Found</Text>
        </View>
      ) : (
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              data?._payload?.termsCondition?.url,
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

export default TermsCondition;
