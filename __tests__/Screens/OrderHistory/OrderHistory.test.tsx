import { useSelector } from "react-redux";
import { useFetchAllOrder } from "../../../src/Services/Main/Hooks";
import { renderWithClient } from "../../../src/Test/test-utils";
import OrderHistory from "../../../src/Screens/OrderHistory/OrderHistory";
import { fireEvent } from "@testing-library/react-native";

const mockNavigate = jest.fn()
// Navigation Mock
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
    })
}))

// Api Hook mock
jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchAllOrder: jest.fn(),
}));

const mockHook = (overrides = {}) => ({
    data: [],
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
});

const data = {
    result: [
        {
            _id: '1',
            summary: { totalQty: 10, grandTotal: 200 },
            createdAt: "2026-02-18T10:30:00.000Z",
            orderNo: '12',
            status: 'delivered'
        },
        {
            _id: '2',
            summary: { totalQty: 10, grandTotal: 200 },
            createdAt: "2026-02-18T10:30:00.000Z",
            orderNo: '123',
            status: 'Shipped'
        },
        {
            _id: '3',
            summary: { totalQty: 10, grandTotal: 200 },
            createdAt: "2026-02-18T10:30:00.000Z",
            orderNo: '124',
            status: 'processing'
        },
        {
            _id: '4',
            summary: { totalQty: 10, grandTotal: 200 },
            createdAt: "2026-02-18T10:30:00.000Z",
            orderNo: '125',
            status: 'cancelled'
        },
        {
            _id: '5',
            summary: { totalQty: 10, grandTotal: 200 },
            createdAt: "2026-02-18T10:30:00.000Z",
            orderNo: '125',
            status: ''
        }
    ]
}

describe('Order History', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false })
        );
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    // -------------- TEST 1--------------
    it('should render correctly with skelton', () => {
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({ isLoading: true })
        );
        const { getByTestId } = renderWithClient(<OrderHistory />)
        expect(getByTestId('order_history')).toBeTruthy()
        expect(getByTestId('skelton')).toBeTruthy()
    });

    // -------------- TEST 2--------------
    it('should render actual data', () => {
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({
                isLoading: false,
                data: {
                    ...data
                },
                fetchNextPage: jest.fn(),
                hasNextPage: false,
                isFetchingNextPage: true,
            })
        );
        const { getByTestId } = renderWithClient(<OrderHistory />)
        expect(getByTestId('order_history')).toBeTruthy()
        expect(getByTestId('list')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(getByTestId('footer')).toBeTruthy
    });

    // -------------- TEST 2.2--------------
    it('should render actual data and load more data on EndReach', () => {
        const mockFetchNextPage = jest.fn();
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({
                isLoading: false,
                data: {
                    ...data
                },
                fetchNextPage: mockFetchNextPage,
                hasNextPage: true,
                isFetchingNextPage: false,
            })
        );
        const { getByTestId } = renderWithClient(<OrderHistory />)
        expect(getByTestId('order_history')).toBeTruthy()
        const flatList = getByTestId('list');
        expect(flatList).toBeTruthy()
        fireEvent(flatList, 'onEndReached');
        // expect(mockFetchNextPage).toHaveBeenCalledTimes(0);
    });

    // ---------------- TEST 3 ----------------
    it('should filter orders when status tab is pressed', () => {
        (useFetchAllOrder as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    ...data
                },
            })
        );

        const { getByText, queryByText } = renderWithClient(<OrderHistory />);

        fireEvent.press(getByText('Shipped'));

        expect(getByText('#123')).toBeTruthy();

        expect(queryByText('#12')).toBeNull();
    });
});