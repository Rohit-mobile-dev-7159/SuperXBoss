import React from 'react'
import { render } from '@testing-library/react-native'
import BrandDay from '../../../src/Screens/Brands/BrandDay'
import { useFetchCoupon } from '../../../src/Services/Main/Hooks'
import { useSelector } from 'react-redux'
import { result } from 'lodash'

// -------------------- MOCKS --------------------

// navigation
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

// redux
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}))

// api hook
jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchCoupon: jest.fn(),
}))


// lottie loader
jest.mock('../../../src/Component/LottieLoader', () => () => null)

// coupon card
jest.mock('../../../src/Screens/Home/Component/Coupon', () => {
    const React = require('react')
    const { View, Text } = require('react-native')

    return {
        CouponCard: ({ item, testID }: any) => (
            <View testID={testID}>
                <Text>{item.name}</Text>
            </View>
        ),
    }
})

// safe area
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
}))


// -------------------- TEST DATA --------------------
const mockCoupons = {
    result: [
        { _id: '1', name: 'Coupon One' },
        { _id: '2', name: 'Coupon Two' },
    ],
}

// -------------------- TESTS --------------------
describe('BrandDay Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks(),

            (useSelector as any).mockImplementation((selectorFn: any) =>
                selectorFn({
                    cart: {
                        cartProducts: {
                            1: { qty: 2 },
                            2: { qty: 1 },
                        },
                    },
                })
            )
    })

    it('should render skeleton loader when loading', () => {
        ; (useFetchCoupon as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        })

        const { getByTestId } = render(<BrandDay />)
        expect(getByTestId('Skelton')).toBeTruthy()
    })

    it('should render data when loading is false', () => {
        ; (useFetchCoupon as jest.Mock).mockReturnValue({
            data: mockCoupons,
            isLoading: false,
        })

        const { getByTestId } = render(<BrandDay />)

        expect(getByTestId('list')).toBeTruthy()
        expect(getByTestId('coupon-1')).toBeTruthy()
        expect(getByTestId('coupon-2')).toBeTruthy()
    })

    it('should render data when loading is false', () => {
        ; (useFetchCoupon as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
        })

        const { getByTestId } = render(<BrandDay />)

        expect(getByTestId('list')).toBeTruthy()
        expect(getByTestId('lotteLoader')).toBeTruthy()
    })

    it('should render footer loader when hasNextPage is true', () => {
        ; (useFetchCoupon as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: false,
            hasNextPage: true,
        })

        const { getByTestId } = render(<BrandDay />)

        expect(getByTestId('activityLoader')).toBeTruthy()
    })

    it('should call fetchNextPage on list end reached', () => {
        const fetchNextPageMock = jest.fn()

            ; (useFetchCoupon as jest.Mock).mockReturnValue({
                data: { result: [{ _id: '1', name: 'Coupon One' }] },
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: fetchNextPageMock,
                refetch: jest.fn(),
                isRefetching: false,
            })

        const { getByTestId } = render(<BrandDay />)

        // simulate onEndReached
        getByTestId('list').props.onEndReached()

        expect(fetchNextPageMock).toHaveBeenCalledTimes(1)
    })

    it('should call refetch on refresh', () => {
        const refetchMock = jest.fn()

            ; (useFetchCoupon as jest.Mock).mockReturnValue({
                data: { result: [{ _id: '1', name: 'Coupon One' }] },
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                refetch: refetchMock,
                isRefetching: false,
            })

        const { getByTestId } = render(<BrandDay />)

        // simulate onRefresh
        getByTestId('list').props.refreshControl.props.onRefresh()

        expect(refetchMock).toHaveBeenCalledTimes(1)
    })

})
