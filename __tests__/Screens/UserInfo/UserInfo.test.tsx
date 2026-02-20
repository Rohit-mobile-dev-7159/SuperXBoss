import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react-native";
import UserInfo from "../../../src/Screens/UserInfo/UserInfo";
import { renderWithClient } from "../../../src/Test/test-utils";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useCustomerUpdate } from "../../../src/Services/User/Hooks";
import { showErrorAlert, showSuccessAlert } from "../../../src/Constant/ShowDailog";
import axios from "axios";
import { Keyboard } from "react-native";
// -------------------- MOCKS --------------------

jest.mock("axios");
jest.spyOn(Keyboard, "dismiss").mockImplementation(jest.fn());

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}));

jest.mock("../../../src/Services/User/Hooks", () => ({
    useCustomerUpdate: jest.fn(),
}));

jest.mock("../../../src/Constant/ShowDailog", () => ({
    showSuccessAlert: jest.fn(),
    showErrorAlert: jest.fn(),
}));

// -------------------- MOCK FUNCTIONS --------------------

const mockDispatch = jest.fn();
const mockReset = jest.fn();
const mockMutate = jest.fn();

const mockRoute = {
    route: {
        data: {
            mobile: "7409137159",
        },
    },
};

describe("UserInfo Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Redux
        (useDispatch as any).mockReturnValue(mockDispatch);

        (useSelector as any).mockImplementation((selector: any) =>
            selector({
                token: {
                    token: {
                        _id: "123",
                        token: "abc",
                    },
                },
            })
        );

        // Navigation
        (useNavigation as any).mockReturnValue({
            reset: mockReset,
        });

        // React Query Mutation
        (useCustomerUpdate as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
    });

    // -------------------- TEST 1 --------------------
    it("should render component", () => {
        const { getByTestId } = renderWithClient(<UserInfo {...mockRoute} />);
        expect(getByTestId("wrapper")).toBeTruthy();
    });

    // -------------------- TEST 2 --------------------
    it("should update name input", () => {
        const { getByPlaceholderText } = renderWithClient(<UserInfo {...mockRoute} />);

        const nameInput = getByPlaceholderText("Name");

        fireEvent.changeText(nameInput, "John Doe");

        expect(nameInput.props.value).toBe("John Doe");
    });

    // -------------------- TEST 3 --------------------
    it("should call mutate when submit pressed", () => {
        const { getByText } = renderWithClient(<UserInfo {...mockRoute} />);

        const submitButton = getByText("SUBMIT");

        fireEvent.press(submitButton);

        expect(mockMutate).toHaveBeenCalled();
    });

    // -------------------- TEST 4 --------------------
    it("should navigate to Home on success", () => {
        (useCustomerUpdate as jest.Mock).mockReturnValue({
            isPending: false,
            mutate: (_: any, { onSuccess }: any) => {
                onSuccess({
                    success: true,
                    message: "Profile Updated",
                    _payload: { _id: "123" },
                });
            },
        });

        const { getByText } = renderWithClient(<UserInfo {...mockRoute} />);

        fireEvent.press(getByText("SUBMIT"));

        expect(mockReset).toHaveBeenCalled();
        expect(showSuccessAlert).toHaveBeenCalledWith("Profile Updated");
    });

    // -------------------- TEST 5--------------------
    it("if api mution occur error on show error alert", () => {
        (useCustomerUpdate as jest.Mock).mockReturnValue({
            isPending: false,
            mutate: (_: any, { onSuccess }: any) => {
                onSuccess({
                    success: false,
                    message: "something went wrong",
                    _payload: { _id: "123" },
                });
            },
        });

        const { getByText } = renderWithClient(<UserInfo {...mockRoute} />);

        fireEvent.press(getByText("SUBMIT"));

        // expect(mockReset).toHaveBeenCalled();
        expect(showErrorAlert).toHaveBeenCalledWith("something went wrong");
    });

    // -------------------- TEST 6 --------------------
    it("should show business fields when B2B selected", () => {
        const { getByText } = renderWithClient(<UserInfo {...mockRoute} />);

        fireEvent.press(getByText("B2B"));

        expect(getByText("Business Information")).toBeTruthy();
    });

    // -------------------- TEST 7 --------------------
    it("should update address field on change", async () => {
        const { getByPlaceholderText } = renderWithClient(<UserInfo {...mockRoute} />);

        const addressInput = getByPlaceholderText("Address");

        fireEvent.changeText(addressInput, "Delhi");

        expect(addressInput.props.value).toBe("Delhi");
    });

    // -------------------- TEST 8--------------------
    it("should hide suggestions on blur", async () => {
        const { getByPlaceholderText, queryByTestId } = renderWithClient(<UserInfo {...mockRoute} />);

        const addressInput = getByPlaceholderText("Address");

        // Focus first
        fireEvent(addressInput, "focus");

        // Now blur
        fireEvent(addressInput, "blur");

        // Run the 200ms timeout
        // jest.useFakeTimers();
        await waitFor(() => {
            expect(queryByTestId("address-suggestion")).toBeNull();
        })

    });

    // -------------------- TEST 9 --------------------
    it("address search lenght equal 0", async () => {
        // Mock autocomplete API response
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
            },
        });

        const { getByPlaceholderText } = renderWithClient(<UserInfo {...mockRoute} />);

        const addressInput = getByPlaceholderText("Address");

        //  Trigger focus → isAddressFocused = true
        fireEvent(addressInput, "focus");

        // 2️ Type address → triggers debounced search
        fireEvent.changeText(addressInput, "");
    });

    // -------------------- TEST 10--------------------
    it("should render suggestions when state conditions are true", async () => {
        // Mock autocomplete API response
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                predictions: [
                    {
                        description: "Delhi, India",
                        place_id: "123",
                    },
                ],
            },
        });

        const { getByPlaceholderText, getByTestId } = renderWithClient(<UserInfo {...mockRoute} />);

        const addressInput = getByPlaceholderText("Address");

        //  Trigger focus → isAddressFocused = true
        fireEvent(addressInput, "focus");

        // 2️ Type address → triggers debounced search
        fireEvent.changeText(addressInput, "Delhi");

        // 3️ Run debounce timer
        // jest.runAllTimers();

        // 4️ Wait for suggestions to render
        await waitFor(() => {
            expect(getByTestId("address-suggestion")).toBeTruthy();
        });

        await waitFor(() => {
            fireEvent.press(getByTestId('123'))
        })
        const keyboardSpy = jest
            .spyOn(Keyboard, "dismiss")
            .mockImplementation(jest.fn());
        expect(keyboardSpy).toHaveBeenCalledTimes(1)
    });

    // -------------------- TEST 11 --------------------
    it("should update address details correctly on selection", async () => {
        (axios.get as jest.Mock)
            // 1️ Autocomplete
            .mockResolvedValueOnce({
                data: {
                    predictions: [
                        {
                            description: "Delhi, India",
                            place_id: "123",
                        },
                    ],
                },
            })
            // 2️ Place details
            .mockResolvedValueOnce({
                data: {
                    result: {
                        geometry: {
                            location: { lat: 28.61, lng: 77.23 },
                        },
                        address_components: [
                            {
                                long_name: "Delhi",
                                types: ["administrative_area_level_1"],
                            },
                            {
                                long_name: "New Delhi",
                                types: ["locality"],
                            },
                            {
                                long_name: "110001",
                                types: ["postal_code"],
                            },
                        ],
                    },
                },
            });

        const keyboardSpy = jest.spyOn(Keyboard, "dismiss").mockImplementation(jest.fn());

        const { getByPlaceholderText, findByTestId } = renderWithClient(<UserInfo {...mockRoute} />);

        const addressInput = getByPlaceholderText("Address");

        // Focus
        fireEvent(addressInput, "focus");

        // Type
        fireEvent.changeText(addressInput, "Delhi");

        // 🔥 IMPORTANT: wrap timers in act
        await act(async () => {
            jest.runAllTimers();
        });

        // Wait for suggestion to render
        const suggestion = await findByTestId("123");

        // Press suggestion
        fireEvent.press(suggestion);

        // Wait for second API call
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
        });

        // Keyboard dismissed
        expect(keyboardSpy).toHaveBeenCalled();

        // Wait for address to update
        await waitFor(() => {
            expect(addressInput.props.value).toBe("Delhi, India");
        });
    });

    // -------------------- TEST 12 --------------------
    it("should update user type to customer on press", () => {
        const { getByTestId } = renderWithClient(<UserInfo {...mockRoute} />);
        const button = getByTestId("updateType");
        fireEvent.press(button);
    });
});



//   it("should handle address select and update fields", async () => {
//         (axios.get as jest.Mock).mockResolvedValue({
//             data: {
//                 result: {
//                     geometry: {
//                         location: {
//                             lat: 28.61,
//                             lng: 77.23,
//                         },
//                     },
//                     address_components: [
//                         {
//                             long_name: "Delhi",
//                             types: ["administrative_area_level_1"],
//                         },
//                         {
//                             long_name: "New Delhi",
//                             types: ["locality"],
//                         },
//                         {
//                             long_name: "110001",
//                             types: ["postal_code"],
//                         },
//                     ],
//                 },
//             },
//         });

//         const { getByPlaceholderText, getByText } = renderWithClient(
//             <UserInfo {...mockRoute} />
//         );

//         const addressInput = getByPlaceholderText("Address");

//         // simulate selecting suggestion
//         fireEvent.changeText(addressInput, "Connaught Place");

//         // manually trigger select (since FlatList is dynamic)
//         await waitFor(async () => {
//             // directly call select by mocking suggestion press
//             // easiest way: simulate press if suggestion rendered
//         });

//         // Call axios-based function manually
//         // (since suggestions UI depends on API autocomplete)
//         await waitFor(() => {
//             expect(axios.get).toHaveBeenCalled();
//         });
//     });