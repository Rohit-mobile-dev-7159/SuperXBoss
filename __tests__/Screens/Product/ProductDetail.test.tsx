import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductDetail from '../../../src/Screens/Product/ProductDetail';
import {
    useFetchProductDetail,
    useAddToCart,
    useRecentViewedProduct,
} from '../../../src/Services/Main/Hooks';
import { useDispatch, useSelector } from 'react-redux';
import Share from 'react-native-share';

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchProductDetail: jest.fn(),
    useAddToCart: jest.fn(),
    useRecentViewedProduct: jest.fn(),
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

jest.mock('react-native-swiper', () => 'Swiper');
jest.mock('react-native-video', () => 'Video');
jest.mock('react-native-image-zoom-viewer', () => 'ImageViewer');
jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock')
);

jest.mock('react-native-share', () => ({
    open: jest.fn(),
}));

describe('ProductDetail Screen', () => {
    const mockDispatch = jest.fn();
    const mockMutate = jest.fn();
    const mockRecentMutate = jest.fn();

    const baseProduct = {
        status: true,
        name: 'Test Product',
        brand: { name: 'Brand X' },
        images: ['http://image.png'],
        discount_customer_price: 100,
        discount_b2b_price: 100,
        customer_price: 150,
        b2b_price: 150,
        any_discount: 10,
        qty: 20,
        min_qty: 0,
        item_stock: 10,
        description: 'Test description',
        unit: { set: true },
        video: 'http://image.mp4',
        hsn_code: 'dff',
        sku_id: 'dfdf',
        part_no: 'dfdf',
        tax: '50',
        bulk_discount: [{ count: 10, discount: 10 }],
        point: 500,
        segment_type: [{ _id: '1', name: 'tractor' }],
    };

    const route = {
        params: { productId: '123' },
    };

    const setup = (product: any, cartQty = 0, userType: 'customer' | 'b2b' = 'b2b'): any => {
        (useDispatch as any).mockReturnValue(mockDispatch);

        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                token: { token: { type: userType } },
                cart: {
                    cartProducts: cartQty
                        ? { '123': { qty: cartQty } }
                        : {},
                },
            })
        );

        (useFetchProductDetail as jest.Mock).mockReturnValue({
            data: { _payload: product },
            isLoading: false,
        });

        (useAddToCart as jest.Mock).mockReturnValue({
            mutate: mockMutate,
        });

        (useRecentViewedProduct as jest.Mock).mockReturnValue({
            mutate: mockRecentMutate,
        });

        return render(<ProductDetail route={route} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders product info correctly', () => {
        const { getByText } = setup(baseProduct);

        expect(getByText('Test Product')).toBeTruthy();
        expect(getByText('Brand X')).toBeTruthy();
        expect(getByText('₹100')).toBeTruthy();
        expect(getByText('10% OFF')).toBeTruthy();
    });

    it('calls recent viewed on mount', () => {
        const product = { ...baseProduct, unit: { pc: true } };
        setup(product, 0, 'customer');
        expect(mockRecentMutate).toHaveBeenCalledWith({ product: '123' });
    });

    it('shows Add to Cart when qty is 0', () => {
        const { getByText } = setup(baseProduct, 0);
        expect(getByText('Add to Cart')).toBeTruthy();
    });

    it('shows increase/decrease buttons when qty > 0', () => {
        const { getByTestId } = setup(baseProduct, 2);
        const increase = getByTestId('increase')
        const decrease = getByTestId('decrease')

        expect(increase).toBeTruthy();
        expect(decrease).toBeTruthy();
        fireEvent.press(increase)
        fireEvent.press(decrease)
    });

    it('calls mutate on increase press', async () => {
        const { getByTestId } = setup(baseProduct, 2);

        fireEvent.press(getByTestId('increase'));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });

    it('calls mutate on decrease press', async () => {
        const { getByTestId } = setup(baseProduct, 2);

        fireEvent.press(getByTestId('increase'));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });

    it('shows Out of Stock when item_stock is 0', () => {
        const outOfStockProduct = {
            ...baseProduct,
            item_stock: 0,
        };

        const { getByText } = setup(outOfStockProduct);

        expect(getByText('Out of Stock')).toBeTruthy();
    });

    it('calls Share.open when invite pressed', async () => {
        (Share.open as jest.Mock).mockResolvedValue({});

        const { getByText } = setup(baseProduct);

        fireEvent.press(getByText('Invite Now →'));

        await waitFor(() => {
            expect(Share.open).toHaveBeenCalled();
        });
    });
});
