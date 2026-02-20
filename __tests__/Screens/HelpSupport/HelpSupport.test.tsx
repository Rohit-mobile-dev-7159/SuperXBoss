import { fireEvent } from "@testing-library/react-native";
import HelpSupport from "../../../src/Screens/HelpSupport/HelpSupport";
import { renderWithClient } from "../../../src/Test/test-utils";
import { Alert, Linking } from "react-native";

const mockOpenURL = jest.fn();

jest.spyOn(Linking, "openURL").mockImplementation(mockOpenURL);

let alertButtons: any[] = [];

jest.spyOn(Alert, "alert").mockImplementation(
  (_title, _message, buttons) => {
    alertButtons = buttons || [];
  }
);

describe("Help & Support component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    alertButtons = [];
  });

  // --------------TEST 1 -----------------
  it("should render component", () => {
    const { getByTestId } = renderWithClient(<HelpSupport />);
    expect(getByTestId("wrapper")).toBeTruthy();
  });

  // --------------TEST 2 -----------------
  it("should show alert when call support is pressed", () => {
    const { getByTestId } = renderWithClient(<HelpSupport />);

    fireEvent.press(getByTestId("call_support"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Call Support",
      "Would you like to call our support team?",
      expect.any(Array)
    );

    expect(alertButtons.length).toBe(2);
  });

  // --------------TEST 3 -----------------
  it("should open dialer when Call is pressed", () => {
    const { getByTestId } = renderWithClient(<HelpSupport />);

    fireEvent.press(getByTestId("call_support"));

    const callButton = alertButtons.find(
      (btn) => btn.text === "Call"
    );

    callButton.onPress();

    expect(mockOpenURL).toHaveBeenCalledWith("tel:9897004181");
  });

  // --------------TEST 4 -----------------
  it("should not call openURL when Cancel is pressed", () => {
    const { getByTestId } = renderWithClient(<HelpSupport />);

    fireEvent.press(getByTestId("call_support"));

    const cancelButton = alertButtons.find(
      (btn) => btn.text === "Cancel"
    );

    cancelButton.onPress?.();

    expect(mockOpenURL).not.toHaveBeenCalled();
  });
});
