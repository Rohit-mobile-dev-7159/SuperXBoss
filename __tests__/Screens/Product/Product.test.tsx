import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useFetchAllProduct, useUpdateWishlist } from '../../../src/Services/Main/Hooks';
import { useNavigation } from '@react-navigation/native';
import { NavigationString } from '../../../src/Constant/AllImports';
import { useSelector } from 'react-redux';
import Product from '../../../src/Screens/Product/Products';

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchAllProduct: jest.fn(),
    useUpdateWishlist: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));


describe('Product Screen', () => {
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

        (useFetchAllProduct as jest.Mock).mockReturnValue({
            data: { result: [{ id: 1, name: 'Product 1', bulk_discount: [{ discount: '20' }], addToCartQty: 3, customer_price: 500, images: ["http://logo.png"], discount_customer_price: 500, any_discount: 5 }] },
            refetch: mockRefetch,
            fetchNextPage: mockFetchNextPage,
            hasNextPage: true,
            isLoading: false,
        });
        // wishlist mutation
        (useUpdateWishlist as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    const mockRoute = {
        params: {
            filter: {
                category: 'electronics',
            },
        },
    };

    it('should render header and product list', () => {
        const { getByText } = render(<Product route={mockRoute} />);
        expect(getByText('Products ')).toBeTruthy();
    });

    it('should navigate to FilterPage when FILTER button is pressed', () => {
        const { getByText } = render(<Product route={mockRoute} />);

        const filterButton = getByText('FILTER');

        fireEvent.press(filterButton);

        expect(mockNavigate).toHaveBeenCalledWith(
            NavigationString.FilterPage
        );
    });

});
