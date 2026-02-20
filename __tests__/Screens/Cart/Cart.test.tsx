import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Cart from '../../../src/Screens/Cart/Cart'
import { useSelector, useDispatch } from 'react-redux'
import {
    useFetchAllAddToCartProduct,
    useAddToCart,
    useUpdateWishlist,
} from '../../../src/Services/Main/Hooks'
import { Text, TouchableOpacity } from 'react-native'

// ---------------- MOCKS ----------------
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn(),
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchAllAddToCartProduct: jest.fn(),
    useAddToCart: jest.fn(),
    useUpdateWishlist: jest.fn(),
}))

jest.mock('lottie-react-native', () => 'LottieView')
jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock')
)
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon')

// ----------------- Mock Child Components -----------------
jest.mock('../../../src/Screens/Product/Component/QuantitySelector', () => () => null)
jest.mock('../../../src/Screens/Home/Component/BulkDiscount', () => () => null)

// Fixed CouponModal mock
jest.mock('../../../src/Screens/Cart/Component/CouponModal', () => {
    const React = require('react')
    const { TouchableOpacity, Text } = require('react-native')
    return (props: any) => {
        return (
            <TouchableOpacity
                testID="mockApplyCoupon"
                onPress={() => {
                    if (props.onApplyCoupon) props.onApplyCoupon({ code: 'SAVE50', amount: 50 })
                    if (props.onClose) props.onClose()
                }}
            >
                <Text>Apply Coupon</Text>
            </TouchableOpacity>
        )
    }
})

// ---------------- HELPERS ----------------
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

// ---------------- MOCK DATA ----------------
const mockCartData = {
    result: [
        {
            _id: '1',
            name: 'Product One',
            brand: { name: 'Brand A' },
            customer_price: 100,
            b2b_price: 90,
            addToCartQty: 2,
            any_discount: 10,
            bulk_discount: [],
            tax: 18,
            point: 5,
            item_stock: 10,
            wishList: true,
        },
    ],
}

// ---------------- TESTS ----------------
describe('Cart Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useDispatch as any).mockReturnValue(jest.fn())
        ;(useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        )
        ;(useAddToCart as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
        })
        ;(useUpdateWishlist as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        })
    })

    it('renders loader screen when fetching', () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: {},
            isLoading: true,
            refetch: jest.fn(),
        })

        const { getByTestId } = renderWithClient(<Cart />)
        expect(getByTestId('cart')).toBeTruthy()
        expect(getByTestId('loader')).toBeTruthy()
    })

    it('shows empty cart UI', () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
            refetch: jest.fn(),
        })

        const { getByText } = renderWithClient(<Cart />)
        expect(getByText('Start Shopping')).toBeTruthy()
    })

    it('navigates to Home when Start Shopping pressed', () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
            refetch: jest.fn(),
        })

        const { getByText } = renderWithClient(<Cart />)
        fireEvent.press(getByText('Start Shopping'))
        expect(mockNavigate).toHaveBeenCalled()
    })

    it('renders cart list when data exists', () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: mockCartData,
            isLoading: false,
            refetch: jest.fn(),
        })

        const { getByTestId } = renderWithClient(<Cart />)
        expect(getByTestId('list')).toBeTruthy()
    })

    it('applies and removes coupon correctly', async () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: mockCartData,
            isLoading: false,
            refetch: jest.fn(),
        })

        const { getByTestId, getByText } = renderWithClient(<Cart />)

        expect(getByText('Apple Coupon Code')).toBeTruthy()

        await act(async () => {
            fireEvent.press(getByTestId('couponApply'))
            fireEvent.press(getByTestId('mockApplyCoupon'))
        })

        expect(getByText('Coupon Applyed Succesfully (SAVE50)')).toBeTruthy()

        await act(async () => {
            fireEvent.press(getByTestId('removeCoupon'))
        })

        expect(getByText('Apple Coupon Code')).toBeTruthy()
    })

    it('navigates to checkout when Checkout pressed', () => {
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: mockCartData,
            isLoading: false,
            refetch: jest.fn(),
        })

        const { getByText } = renderWithClient(<Cart />)
        fireEvent.press(getByText('Checkout'))
        expect(mockNavigate).toHaveBeenCalled()
    })

    it('calls handleAddToCart and removes item on success', async () => {
        const mockMutate = jest.fn()
        const mockDispatch = jest.fn()
        const mockRefetch = jest.fn()
        ;(useDispatch as any).mockReturnValue(mockDispatch)
        ;(useAddToCart as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        })
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: mockCartData,
            isLoading: false,
            refetch: mockRefetch,
        })

        const { getByTestId } = renderWithClient(<Cart />)

        await act(async () => {
            fireEvent.press(getByTestId('removeBtn'))
        })

        expect(mockMutate).toHaveBeenCalled()

        const options = mockMutate.mock.calls[0][1]
        options.onSuccess({ success: true })

        expect(mockDispatch).toHaveBeenCalled()
        expect(mockRefetch).toHaveBeenCalled()
    })

    it('calls Update WishList correctly', async () => {
        const mockMutate = jest.fn()
        const mockRefetch = jest.fn()
        ;(useUpdateWishlist as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        })
        ;(useFetchAllAddToCartProduct as jest.Mock).mockReturnValue({
            data: mockCartData,
            isLoading: false,
            refetch: mockRefetch,
        })

        const { getByTestId } = renderWithClient(<Cart />)

        await act(async () => {
            fireEvent.press(getByTestId('wishlistBtn'))
        })

        expect(mockMutate).toHaveBeenCalled()
        const options = mockMutate.mock.calls[0][1]
        options.onSuccess({ success: true })
        expect(mockRefetch).toHaveBeenCalled()
    })
})
