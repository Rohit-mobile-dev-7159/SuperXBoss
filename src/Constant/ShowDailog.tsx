import {ALERT_TYPE, Dialog, Root, Toast} from "react-native-alert-notification";

const showSuccessAlert = (text: string) => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: "Success",
    textBody: text,
  });
};

const showErrorAlert = (text: string) => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: "Error",
    textBody: text,
  });
};

const showToast = (text: string) => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: "Success",
    textBody: text,
  });
};
export {showErrorAlert, showSuccessAlert, showToast};
