import axios from 'axios';
import { apiCall } from '../../src/Axios/Axios';
import { store } from '../../src/Redux/Store';
import NavigationString from '../../src/Constant/NavigationString';
import { setToken } from '../../src/Redux/Slices/Token';
import { navigate } from '../../src/Utils/NavigationService';

// MOCK AXIOS DEFAULT EXPORT
jest.mock('axios', () => jest.fn());

jest.mock('../../src/Redux/Store', () => ({
    store: {
        getState: jest.fn(),
        dispatch: jest.fn(),
    },
}));

jest.mock('../../src/Utils/NavigationService', () => ({
    navigate: jest.fn(),
}));

jest.mock('../../src/Redux/Slices/Token', () => ({
    setToken: jest.fn(),
}));

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('apiCall utility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return data on success', async () => {
        store.getState = jest.fn().mockReturnValue({
            token: { token: 'fake-token' },
        });

        mockedAxios.mockResolvedValueOnce({
            data: { success: true, data: { id: 1 } },
        });

        const response = await apiCall('get', '/customer/info');

        expect(response).toEqual({
            success: true,
            data: { id: 1 },
        });
    });

    it('should logout and navigate on 401 error', async () => {
        store.getState = jest.fn().mockReturnValue({
            token: { token: 'expired-token' },
        });

        mockedAxios.mockRejectedValueOnce({
            response: {
                status: 401,
                data: { error: 'Unauthorized' },
            },
        });

        const response = await apiCall('get', '/customer/info');

        expect(store.dispatch).toHaveBeenCalled();
        expect(setToken).toHaveBeenCalledWith({});
        expect(navigate).toHaveBeenCalledWith(NavigationString.Login);

        expect(response).toEqual({
            success: false,
            message: 'JWT Error - Token expired or malformed',
        });
    });

    it('should handle server error', async () => {
        store.getState = jest.fn().mockReturnValue({
            token: { token: 'valid-token' },
        });

        mockedAxios.mockRejectedValueOnce({
            response: {
                status: 500,
                data: { message: 'Internal Server Error' },
            },
        });

        const response = await apiCall('post', '/create', { name: 'Test' });

        expect(response).toEqual({
            success: false,
            message: 'Internal Server Error',
        });
    });
});
