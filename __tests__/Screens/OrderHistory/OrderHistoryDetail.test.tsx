import React from 'react';
import { BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { renderWithClient } from '../../../src/Test/test-utils';
import { useFetchAllOrder } from '../../../src/Services/Main/Hooks';
import OrderHistoryDetail from '../../../src/Screens/OrderHistory/OrderHistoryDetail';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    CommonActions: {
        reset: jest.fn(),
    },
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
        dispatch: mockDispatch,
    }),
}));

// API Hook Mock

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchAllOrder: jest.fn(),
}));

// Test Data

const baseRoute = {
    params: {
        _id: '1',
        goHome: true,
    },
};

const orderData = {
    result: [
        {
            _id: '1',
            summary: {
                totalQty: 10,
                grandTotal: 200,
                taxTotal: 20.2,
                subtotal: 22.2,
            },
            createdAt: '2026-02-18T10:30:00.000Z',
            updatedAt: '2026-02-18T10:30:00.000Z',
            orderNo: '12',
            status: 'delivered',
            payment: { method: 'case', status: 'active' },
            items: [
                {
                    _id: '1',
                    name: 'rohit',
                    description: 'ddf',
                    effectiveUnitPrice: 52,
                    qty: 5,
                },
            ],
            shippingChargesAmount: 50,
            platformCharge: 5,
        },
    ],
};

const mockHook = (overrides = {}) => ({
    data: [],
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
});



describe('Order History Detail', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );

        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false, data: orderData })
        );
    });

    // ----------------TEST 1------------------
    it('should render loader when loading', () => {
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: true })
        );

        const { getByTestId } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        expect(getByTestId('loader')).toBeTruthy();
    });

    // ----------------TEST 2------------------
    it('should render order details correctly', () => {
        const { getByTestId } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        expect(getByTestId('order_history_detail')).toBeTruthy();
        expect(getByTestId('item_1')).toBeTruthy();
    });

    // ----------------TEST 2.2------------------
    it('should render correctly for shipped status', () => {
        const data = {
            result: [{ ...orderData.result[0], status: 'shipped' }],
        };

        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false, data })
        );

        const { getByTestId } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        expect(getByTestId('order_history_detail')).toBeTruthy();
    });

    // ----------------TEST 2.3------------------
    it('should render correctly for processing status', () => {
        const data = {
            result: [{ ...orderData.result[0], status: 'processing' }],
        };

        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false, data })
        );

        const { getByTestId } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        expect(getByTestId('order_history_detail')).toBeTruthy();
    });

    // ----------------TEST 2.4------------------
    it('should render correctly for cancelled status', () => {
        const data = {
            result: [{ ...orderData.result[0], status: 'cancelled' }],
        };

        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false, data })
        );

        const { getByTestId } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        expect(getByTestId('order_history_detail')).toBeTruthy();
    });


    //  BackHandler Tests

    // ----------------TEST 3------------------
    it('should add BackHandler listener on mount', () => {
        const removeMock = jest.fn();

        jest
            .spyOn(BackHandler, 'addEventListener')
            .mockImplementation((_, callback) => {
                return { remove: removeMock } as any;
            });

        renderWithClient(<OrderHistoryDetail route={baseRoute} />);

        expect(BackHandler.addEventListener).toHaveBeenCalledWith(
            'hardwareBackPress',
            expect.any(Function)
        );
    });

    // ----------------TEST 3.2------------------
    it('should dispatch reset when goHome is true', () => {
        let backCallback: any;

        jest
            .spyOn(BackHandler, 'addEventListener')
            .mockImplementation((_, callback) => {
                backCallback = callback;
                return { remove: jest.fn() } as any;
            });

        renderWithClient(<OrderHistoryDetail route={baseRoute} />);

        backCallback();

        expect(CommonActions.reset).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalled();
    });

    // ----------------TEST 3.3------------------
    it('should call goBack when goHome is false', () => {
        let backCallback: any;

        jest
            .spyOn(BackHandler, 'addEventListener')
            .mockImplementation((_, callback) => {
                backCallback = callback;
                return { remove: jest.fn() } as any;
            });

        const route = {
            params: { _id: '1', goHome: false },
        };

        renderWithClient(<OrderHistoryDetail route={route} />);

        backCallback();

        expect(mockGoBack).toHaveBeenCalled();
    });

    // ----------------TEST 3.4------------------
    it('should return true from back handler', () => {
        let backCallback: any;

        jest
            .spyOn(BackHandler, 'addEventListener')
            .mockImplementation((_, callback) => {
                backCallback = callback;
                return { remove: jest.fn() } as any;
            });

        renderWithClient(<OrderHistoryDetail route={baseRoute} />);

        const result = backCallback();

        expect(result).toBe(true);
    });

    // ----------------TEST 3.5------------------
    it('should remove BackHandler listener on unmount', () => {
        const removeMock = jest.fn();

        jest
            .spyOn(BackHandler, 'addEventListener')
            .mockImplementation((_, callback) => {
                return { remove: removeMock } as any;
            });

        const { unmount } = renderWithClient(
            <OrderHistoryDetail route={baseRoute} />
        );

        unmount();

        expect(removeMock).toHaveBeenCalled();
    });
});
