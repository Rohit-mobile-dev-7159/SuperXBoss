import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import WalletHistory from "../../../src/Screens/Wallet/WalletHistory";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFetchWalletHistory } from "../../../src/Services/Main/Hooks";
import { useSelector } from "react-redux";
import { result } from "lodash";

// Mocks
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn((cb) => cb()),
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

jest.mock("../../../src/Services/Main/Hooks", () => ({
    useFetchWalletHistory: jest.fn(),
}));

const createClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

const renderWithClient = (ui: React.ReactElement) =>
    render(
        <QueryClientProvider client={createClient()}>
            {ui}
        </QueryClientProvider>
    )

const mockData = {
    result: [
        {
            _id: '1',
            source: 'debit'
        },
        {
            _id: '2',
            source: 'free',
        },
        {
            _id: '3',
            source: 'credit',
            order_id: 'df',
            offer_id: 'dfd'
        }
    ]
}

describe('Wallet History', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
            })
        )
    })
    it('show Loader when isLoading true', () => {
        (useFetchWalletHistory as jest.Mock).mockReturnValue({
            data: [],
            isLoading: true
        })
        const { getByTestId } = renderWithClient(<WalletHistory />)
        expect(getByTestId('loader')).toBeTruthy()
    })
    it('should actual componet render', () => {
        (useFetchWalletHistory as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false
        })
        const { getByTestId } = renderWithClient(<WalletHistory />)
        expect(getByTestId('wrapper')).toBeTruthy()
        expect(getByTestId('list')).toBeTruthy()
    })

    it('show Footer Loader', () => {
        (useFetchWalletHistory as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetchingNextPage: true
        })
        const { getByTestId } = renderWithClient(<WalletHistory />)
        expect(getByTestId('wrapper')).toBeTruthy()
        expect(getByTestId('list')).toBeTruthy()
        expect(getByTestId('footerLoader')).toBeTruthy()
    })

    it('show empty list lable', () => {
        (useFetchWalletHistory as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
        })
        const { getByTestId, getByText } = renderWithClient(<WalletHistory />)
        expect(getByTestId('wrapper')).toBeTruthy()
        expect(getByText('No added money yet')).toBeTruthy()
    })

    it('show empty list lable', () => {
        (useFetchWalletHistory as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
        })
        const { getByTestId, getByText } = renderWithClient(<WalletHistory />)
        expect(getByTestId('wrapper')).toBeTruthy()
        expect(getByText('No added money yet')).toBeTruthy()
    })

    it('calls fetchNextPage when list end reached', () => {
        const mockFetchNextPage = jest.fn().mockResolvedValue({})
        const mockRefetch = jest.fn()

            ; (useFetchWalletHistory as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
                refetch: mockRefetch,
            })

        const { getByTestId } = renderWithClient(<WalletHistory />)

        fireEvent(getByTestId('list'), 'onEndReached')

        expect(mockFetchNextPage).toHaveBeenCalled()
    })


    it('calls refetch on pull to refresh', async () => {
        const mockRefetch = jest.fn().mockResolvedValue({})
        const mockFetchNextPage = jest.fn()

            ; (useFetchWalletHistory as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
                refetch: mockRefetch,
            })

        const { getByTestId } = renderWithClient(<WalletHistory />)

        await act(async () => {
            getByTestId('list').props.refreshControl.props.onRefresh()
        })

        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalledTimes(1)
        })
    })



});