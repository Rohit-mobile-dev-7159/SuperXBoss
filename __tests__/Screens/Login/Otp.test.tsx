import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import Otp from '../../../src/Screens/Login/Otp';
import { renderWithClient } from '../../../src/Test/test-utils';

// -------------------- MOCKS --------------------



jest.mock('@react-native-firebase/messaging', () => {
    return () => ({
        getToken: jest.fn().mockResolvedValue('mock_fcm_token'),
    });
});

jest.mock('axios');

const mockDispatch = jest.fn();
const mockReset = jest.fn();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        reset: mockReset,
    }),
}));

// ✅ CRITICAL FIX: Proper OTP mock that ensures ref exists immediately
jest.mock('react-native-otp-textinput', () => {
    const React = require('react');

    return React.forwardRef((props: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            state: {
                otpText: ['1', '2', '3', '4'],
            },
        }), []);

        return <></>;
    });
});

describe('Otp Screen', () => {
    const route = {
        params: {
            mobile: '7409137159',
        },
    };

    const navigation = {
        reset: mockReset,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---------------- TEST 1 ----------------
    it('should render correctly', () => {
        const { getByText } = renderWithClient(
            <Otp route={route} navigation={navigation} />
        );

        expect(getByText('Enter Verification Code')).toBeTruthy();
        expect(getByText('+91-7409137159')).toBeTruthy();
    });

    // ---------------- TEST 2 ----------------
    it('should verify OTP successfully and reset navigation', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: {
                type: 'success',
                _payload: {},
            },
        });

        const { getByText } = renderWithClient(
            <Otp route={route} navigation={navigation} />
        );

        const button = getByText('Continue');

        //  Wait one tick to allow ref attachment
        await waitFor(() => {
            expect(button).toBeTruthy();
        });

        fireEvent.press(button);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should verify OTP successfully and reset navigation', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: {
                type: 'success',
                _payload: { type: 'customer' },
            },
        });

        const { getByText } = renderWithClient(
            <Otp route={route} navigation={navigation} />
        );

        const button = getByText('Continue');

        //  Wait one tick to allow ref attachment
        await waitFor(() => {
            expect(button).toBeTruthy();
        });

        fireEvent.press(button);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    // ---------------- TEST 3 ----------------
    it('should handle API failure', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({
            response: {
                data: {
                    statusCode: 400,
                },
            },
        });

        const { getByText } = renderWithClient(
            <Otp route={route} navigation={navigation} />
        );

        const button = getByText('Continue');

        await waitFor(() => {
            expect(button).toBeTruthy();
        });

        fireEvent.press(button);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(mockReset).not.toHaveBeenCalled();
    });
});
