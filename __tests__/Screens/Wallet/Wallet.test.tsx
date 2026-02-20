import React from 'react'
import { act, fireEvent, render } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Wallet from '../../../src/Screens/Wallet/Wallet'
import { useFetchUserProfile, useRechargeWallet, useRechargeWalletVerify } from '../../../src/Services/Main/Hooks'

// ------------- Mocks ----------------
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn(),
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(() => jest.fn()),
}))

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchUserProfile: jest.fn(),
    useRechargeWallet: jest.fn(),
    useRechargeWalletVerify: jest.fn(),
}))

jest.mock('react-native-razorpay', () => ({
    open: jest.fn().mockResolvedValue({ payment_id: '123' }),
}))

// ------------- Helpers ----------------
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

// ------------- Mock Data ----------------
const mockUserProfile = {
    _payload: {
        name: 'Rohit Kumar',
        email: 'test@example.com',
        mobile: '9999999999',
        wallet_amount: 1250.5,
    },
}

const mockMutate = jest.fn()

// ------------- Tests ----------------
describe('Wallet Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useFetchUserProfile as jest.Mock).mockReturnValue({
                data: mockUserProfile,
                refetch: jest.fn(),
            })
            ; (useRechargeWallet as jest.Mock).mockReturnValue({
                mutate: mockMutate,
            })
            ; (useRechargeWalletVerify as jest.Mock).mockReturnValue({
                mutate: mockMutate,
            })
    })

    it('renders wrapper', () => {
        const { getByTestId } = renderWithClient(<Wallet />)
        expect(getByTestId('wrapper')).toBeTruthy()
    })

    it('toggles recharge panel when Recharge button pressed', () => {
        const { getByText, queryByText } = renderWithClient(<Wallet />)

        // Initially, panel not visible
        expect(queryByText('Select Recharge Amount')).toBeNull()

        // Open panel
        act(() => {
            fireEvent.press(getByText('Recharge'))
        })
        expect(queryByText('Select Recharge Amount')).toBeTruthy()

        act(() => {
            fireEvent.press(getByText('Recharge'))
        })
        expect(queryByText('Select Recharge Amount')).toBeNull()
    })

    it('selects an amount correctly', () => {
        const { getByText } = renderWithClient(<Wallet />)

        act(() => {
            fireEvent.press(getByText('Recharge'))
        })

        act(() => {
            fireEvent.press(getByText('₹200'))
        })

        expect(getByText('₹200')).toBeTruthy()
    })

    it('navigates to Offers screen', () => {
        const { getByText } = renderWithClient(<Wallet />)
        act(() => {
            fireEvent.press(getByText('Offers'))
        })
        expect(mockNavigate).toHaveBeenCalledWith('Offers')
    })

    it('navigates to WalletHistory screen', () => {
        const { getByText } = renderWithClient(<Wallet />)
        act(() => {
            fireEvent.press(getByText('History'))
        })
        expect(mockNavigate).toHaveBeenCalledWith('WalletHistory')
    })
})
