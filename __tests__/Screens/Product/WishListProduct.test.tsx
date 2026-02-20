import React from 'react';
import { render } from '@testing-library/react-native';
import { useFetchWishlistProduct, useUpdateWishlist } from '../../../src/Services/Main/Hooks';
import { useFocusEffect } from '@react-navigation/native';
import WishListProduct from '../../../src/Screens/Product/WishListProduct';
import { useSelector } from 'react-redux';

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchWishlistProduct: jest.fn(),
    useUpdateWishlist: jest.fn(),
}));
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


describe('WishListProduct Screen', () => {
    const mockRefetch = jest.fn();
    const mockFetchNextPage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        (useFetchWishlistProduct as jest.Mock).mockReturnValue({
            data: { _payload: [{ id: 1, name: 'Product 1', bulk_discount: [{ discount: '20' }], addToCartQty: 3, customer_price: 500, images: ["http://logo.png"], discount_customer_price: 500, any_discount: 5 }] },
            isLoading: false,
            hasNextPage: true,
            fetchNextPage: mockFetchNextPage,
            refetch: mockRefetch,
        });
        (useUpdateWishlist as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render header and product list with data', () => {
        const { getByText } = render(<WishListProduct />);

        // Header renders
        expect(getByText('Wishlist')).toBeTruthy();

        // Hook called
        expect(useFetchWishlistProduct).toHaveBeenCalled();
    });

    it('should call refetch on focus', () => {
        render(<WishListProduct />);

        // Grab the callback passed to useFocusEffect
        const focusCallback = (useFocusEffect as jest.Mock).mock.calls[0][0];

        // Simulate focus
        focusCallback();

        expect(mockRefetch).toHaveBeenCalled();
    });


});
