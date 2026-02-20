import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Login from '../../../src/Screens/Login/Login';
import { renderWithClient } from '../../../src/Test/test-utils';

// -------------------- MOCKS --------------------

jest.mock('axios');
jest.useFakeTimers();

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn(),
    createNavigationContainerRef: () => ({
        current: null,
        isReady: () => true,
        navigate: jest.fn(),
        dispatch: jest.fn(),
    }),
}));

// Optional: mock alerts if needed
jest.mock('../../../src/Constant/AllImports', () => ({
    ...jest.requireActual('../../../src/Constant/AllImports'),
    showSuccessAlert: jest.fn(),
    showErrorAlert: jest.fn(),
}));

// -------------------- TEST SUITE --------------------

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
    });

    // -------------------- TEST 1 --------------------
    it('should render component', () => {
        const { getByTestId } = renderWithClient(<Login />);
        expect(getByTestId('login')).toBeTruthy();
    });

    // -------------------- TEST 2 --------------------
    it('should set mobile input value', () => {
        const { getByTestId } = renderWithClient(<Login />);

        const input = getByTestId('mobile_input');

        fireEvent.changeText(input, '7409137159');

        expect(input.props.value).toBe('7409137159');
    });

    // -------------------- TEST 3 --------------------
    it('error occur when user fill wrong mobile number', async () => {
        const { getByTestId } = renderWithClient(<Login />);

        const input = getByTestId('mobile_input');
        const submitBtn = getByTestId('submit');

        fireEvent.changeText(input, '740913715');
        fireEvent.press(submitBtn);
    });

    // -------------------- TEST 4 --------------------
    it('should submit form and navigate on success', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: {
                type: 'success',
                message: 'OTP sent successfully',
            },
        });

        const { getByTestId } = renderWithClient(<Login />);

        const input = getByTestId('mobile_input');
        const submitBtn = getByTestId('submit');

        fireEvent.changeText(input, '7409137159');
        fireEvent.press(submitBtn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });

        expect(axios.post).toHaveBeenCalledWith(
            expect.any(String),
            { mobile: '7409137159' }
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            expect.any(String),
            { mobile: '7409137159' }
        );
    });

    // -------------------- TEST 5 --------------------
    it('should show error when API fails', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Invalid mobile number',
                },
            },
        });

        const { getByTestId } = renderWithClient(<Login />);

        const input = getByTestId('mobile_input');
        const submitBtn = getByTestId('submit');

        fireEvent.changeText(input, '7409137159');
        fireEvent.press(submitBtn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
