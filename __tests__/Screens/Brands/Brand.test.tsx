import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { useFetchBrand } from '../../../src/Services/Main/Hooks'
import Brands from '../../../src/Screens/Brands/Brands'
import { useSelector } from 'react-redux'
import NavigationString from '../../../src/Constant/NavigationString'


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
    useFetchBrand: jest.fn(),
}))

// lottie loader
jest.mock('../../../src/Component/LottieLoader', () => () => null)

// safe area
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
}))

const mockBrand = {
    result: [
        { _id: '1', name: 'One', logo: 'https://example.com/logo1.png' },
        { _id: '2', name: 'Two', logo: '' },
    ],
}

// -------------------- TESTS --------------------
describe('Brands Screen', () => {
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
        ; (useFetchBrand as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        })
        const route = {
            params: {
                type: 'Vehicle',
            },
        }
        const { getByTestId } = render(<Brands route={route} />)
        expect(getByTestId('Skelton')).toBeTruthy()
    })

    it('should navigate on brand press', () => {
        ; (useFetchBrand as jest.Mock).mockReturnValue({
            data: mockBrand || [],
            isLoading: false,
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            refetch: jest.fn(),
            isRefetching: false,
        })

        const route = {
            params: {
                type: 'Spare',
            },
        }

        const { getByText } = render(<Brands route={route} />)

        fireEvent.press(getByText('One'))

        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith(NavigationString.FilterPoroduct, { brandId: '1' })
    })

    it('should render lottie loader when no data', () => {
        ; (useFetchBrand as jest.Mock).mockReturnValue({
            data: {},
            isLoading: false,
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            refetch: jest.fn(),
            isRefetching: false,
        })

        const route = {
            params: {
                type: 'Vehicle',
            },
        }

        const { getByTestId } = render(<Brands route={route} />)

        expect(getByTestId('lottieLoader')).toBeTruthy()
    })

    it('should render footer loader when hasNextPage is true', () => {
        ; (useFetchBrand as jest.Mock).mockReturnValue({
            data: mockBrand,
            isLoading: false,
            hasNextPage: true,
        })

        const { getByTestId } = render(<Brands route={{ params: { type: 'Vehicle' } }} />)

        expect(getByTestId('activityLoader')).toBeTruthy()
    })

    it('should call fetchNextPage on list end reached', () => {
        const fetchNextPageMock = jest.fn()

            ; (useFetchBrand as jest.Mock).mockReturnValue({
                data: mockBrand,
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: fetchNextPageMock,
                refetch: jest.fn(),
                isRefetching: false,
            })

        const { getByTestId } = render(<Brands route={{ params: { type: 'Vehicle' } }} />)

        // simulate onEndReached
        getByTestId('list').props.onEndReached()

        expect(fetchNextPageMock).toHaveBeenCalledTimes(1)
    })

    it('should call refetch on refresh', () => {
        const refetchMock = jest.fn()

            ; (useFetchBrand as jest.Mock).mockReturnValue({
                data: mockBrand,
                isLoading: false,
                hasNextPage: true,
                isFetchingNextPage: false,
                refetch: refetchMock,
                isRefetching: false,
            })

        const { getByTestId } = render(<Brands route={{ params: { type: 'Vehicle' } }} />)

        // simulate onRefresh
        getByTestId('list').props.refreshControl.props.onRefresh()

        expect(refetchMock).toHaveBeenCalledTimes(1)
    })
})
