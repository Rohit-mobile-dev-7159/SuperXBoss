import React from 'react';
import { useSelector } from 'react-redux';
import { renderWithClient } from '../../../../src/Test/test-utils';
import TrendingProductsSlider from '../../../../src/Screens/Home/Component/TrendingProductsSlider';
import { fireEvent } from '@testing-library/react-native';

// ---------- MOCK DATA ----------
const mockData = {
    data: [
        {
            _id: 1,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 2,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 3,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 4,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 5,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 6,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 7,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 8,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 9,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 10,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            _id: 11,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
        {
            id: 'view-all'
        }
    ]
}

const mockData2 = {
    data: [
        {
            _id: 1,
            images: [],
            bulk_discount: [{ discount: '20' }],
            any_discount: '5',
            item_stock: 10,
        },
    ],
    label: 'Trending Product',
};

// Mock
const mockNavigation = jest.fn()

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigation,
    }),
}))
jest.mock('../../../../src/Utils/NavigationService', () => ({
    navigationRef: mockNavigation,
    navigate: mockNavigation,
}));


describe('Trending Product slider', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ------------------- TEST 1 ----------
    it('should component render', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        const { getByTestId } = renderWithClient(<TrendingProductsSlider {...mockData2} />);
        expect(getByTestId('trending_product')).toBeTruthy();
        fireEvent.press(getByTestId('item_1'))
    });

    // ------------------- TEST 2 ----------
    it('should render more than 10 items', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const { getByTestId, } = renderWithClient(<TrendingProductsSlider {...mockData} />);
        expect(getByTestId('trending_product')).toBeTruthy();

    });
});
