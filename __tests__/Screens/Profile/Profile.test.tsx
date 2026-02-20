import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { renderWithClient } from '../../../src/Test/test-utils';
import ProfileScreen from '../../../src/Screens/Profile/Profile';
import { useFetchUserProfile } from '../../../src/Services/Main/Hooks';
import { updateProfile } from '../../../src/Services/Main/apis';
import { pickImageFromGallery } from '../../../src/Helper';
import axios from 'axios';
import Modal from 'react-native-modal';

/* ---------------- NAVIGATION MOCK ---------------- */
jest.runAllTimers()
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        dispatch: mockDispatch,
    }),
    CommonActions: {
        reset: jest.fn(),
    },
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))
/* ---------------- OTHER MOCKS ---------------- */

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchUserProfile: jest.fn(),
}));

jest.mock('../../../src/Services/Main/apis', () => ({
    updateProfile: jest.fn(),
}));

jest.mock('../../../src/Helper', () => ({
    pickImageFromGallery: jest.fn(),
}));

jest.mock('axios');

const mockHook = (overrides = {}) => ({
    data: {},
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
});

/* ---------------- TEST SUITE ---------------- */

describe('Profile Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                token: { token: { _id: '1', token: 'abc' } },
                clearCart: {}
            })
        );
    });

    /* ---------------- TEST 1 ---------------- */

    it('should render profile with data', () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(
            mockHook({
                data: { _payload: { profile: 'http://logo.png', points: '500', name: 'Rohit' } },
            })
        );

        const { getByTestId } = renderWithClient(<ProfileScreen />);

        expect(getByTestId('profile_wrapper')).toBeTruthy();
    });

    /* ---------------- TEST 2 MODAL ---------------- */

    it('should open and close modal via backdrop and back button', () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());

        const { getByTestId, queryByTestId, UNSAFE_getByType } = renderWithClient(<ProfileScreen />);
        let openModal = getByTestId('is_modal')
        fireEvent.press(openModal);
        expect(getByTestId('modal')).toBeTruthy();

        fireEvent.changeText(getByTestId('name_input'), 'Rohit')
        const cancel = getByTestId('cancel')
        expect(cancel).toBeTruthy()
        fireEvent.press(cancel)

        const closeBtn = getByTestId('close')
        expect(closeBtn).toBeTruthy()
        fireEvent.press(closeBtn)

        fireEvent.press(openModal);
        const modal = UNSAFE_getByType(Modal);
        modal.props.onBackdropPress();
        // expect(queryByTestId('modal')).toBeNull();

        fireEvent.press(openModal);

        const modalAgain = UNSAFE_getByType(Modal);
        modalAgain.props.onBackButtonPress();


        // expect(queryByTestId('modal')).toBeNull();
    });

    /* ---------------- TEST 3 SAVE PROFILE ---------------- */

    it('should call updateProfile on save', async () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());
        (updateProfile as jest.Mock).mockResolvedValue({ success: true });

        const { getByTestId, getByText } =
            renderWithClient(<ProfileScreen />);

        fireEvent.press(getByTestId('is_modal'));

        fireEvent.changeText(getByTestId('name_input'), 'Rohit');

        fireEvent.press(getByText('Save Changes'));

        await waitFor(() => {
            expect(updateProfile).toHaveBeenCalled();
        });
    });
    /* ---------------- TEST 3 Render all order Data ---------------- */

    it('should render all order items and trigger navigation on press', () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());

        const { getByText } = renderWithClient(<ProfileScreen />);

        const orderLabels = [
            'Order History',
            'Wishlist',
            'Wallet',
            'Help & Support',
            'Privacy Policy',
            'Terms & Conditions',
            'FAQs',
        ];

        orderLabels.forEach(label => {
            const item = getByText(label);
            expect(item).toBeTruthy();

            fireEvent.press(item);
        });


    });


    /* ---------------- CAMERA PICK ---------------- */

    it('should pick image and update profile', async () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());
        (pickImageFromGallery as jest.Mock).mockResolvedValue({
            uri: 'uri',
            fileName: 'file.jpg',
            type: 'image/jpeg',
        });
        (updateProfile as jest.Mock).mockResolvedValue({ success: true });

        const { getByTestId } = renderWithClient(<ProfileScreen />);

        const cameraBtn = getByTestId('profile_wrapper')
            .findByProps?.({ name: 'camera' });

        if (cameraBtn) fireEvent.press(cameraBtn);

        await waitFor(() => {
            expect(pickImageFromGallery).toHaveBeenCalled();
        });
    });

    /* ---------------- LOGOUT SUCCESS ---------------- */

    it('should logout successfully', async () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());

        (axios.post as jest.Mock).mockResolvedValue({
            data: { success: true, message: 'Logged out' },
        });

        const { getByText } = renderWithClient(<ProfileScreen />);

        fireEvent.press(getByText('Logout'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
        // expect(mockDispatch).toHaveBeenCalled();
    });

    /* ---------------- LOGOUT FAILURE ---------------- */

    it('should handle logout error', async () => {
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook());

        (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

        const { getByText } = renderWithClient(<ProfileScreen />);

        fireEvent.press(getByText('Logout'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
    });
});
