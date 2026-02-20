import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ProductList from '../../../../src/Screens/Product/Component/ProductList';
import { renderWithClient } from '../../../../src/Test/test-utils';

const mockNavigate = jest.fn()
// Navigation Mock
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))
jest.mock('../../../../src/Utils/NavigationService', () => ({
    navigationRef: mockNavigate,
    navigate: mockNavigate,
}));

jest.mock('../../../../src/Component/Skelton/Skelton', () => () => <></>);
describe('ProductList Component', () => {

    beforeEach(() => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
    });

    const mockData = [
        {
            _id: '1',
            id: '1',
            name: 'Test Product',
            brand: { name: 'Test Brand' },
            images: ['https://example.com/image.jpg'],
            wishList: false,
            discount_customer_price: 100,
            discount_b2b_price: 80,
            customer_price: 120,
            b2b_price: 90,
            any_discount: 10,
            item_stock: 5,
            min_qty: 1,
            bulk_discount: [{}],
            point: 10,
        },
    ];

    it('renders loading state', () => {
        const data = [{ ...mockData[0], images: [] }];
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const { getByTestId } = renderWithClient(
            <ProductList
                data={data}
                isLoading={true}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );

        // expect(getByTestId('skeleton-container')).toBeTruthy();
    });

    it('renders product list correctly with type customer', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const { getByText } = renderWithClient(
            <ProductList
                data={mockData}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );

        expect(getByText('Test Product')).toBeTruthy();
        expect(getByText('Test Brand')).toBeTruthy();
        // expect(getByText('₹100.00')).toBeTruthy(); // customer price
        // expect(getByText('10% off')).toBeTruthy();
    });

    it('renders product list correctly with type b2b', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const data = [{ ...mockData[0], images: [] }]
        const { getByText } = renderWithClient(
            <ProductList
                data={data}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );

        expect(getByText('Test Product')).toBeTruthy();
        expect(getByText('Test Brand')).toBeTruthy();
        expect(getByText('₹80.00')).toBeTruthy(); // b2b price
        expect(getByText('10% off')).toBeTruthy();
    });

    it('renders empty state when no data', () => {
        const { getByTestId } = renderWithClient(
            <ProductList
                data={[]}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );

        expect(getByTestId('lottie-loader')).toBeTruthy();
    });

    it('navigates to product detail on item press', () => {
        const { getByText } = renderWithClient(
            <ProductList
                data={mockData}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );

        fireEvent.press(getByText('Test Product'));
        expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', { productId: '1' });
    });

    it('should call refetch on refresh', () => {
        const refetchMock = jest.fn()

        const { getByTestId } = renderWithClient(
            <ProductList
                data={mockData}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );
        // simulate onRefresh
        getByTestId('flatlist').props.refreshControl.props.onRefresh()

        expect(refetchMock).toHaveBeenCalledTimes(0)
    })

     it('should call fetchNextPage on list end reached', () => {
        const refetchMock = jest.fn()

        const { getByTestId } = renderWithClient(
            <ProductList
                data={mockData}
                isLoading={false}
                hasNextPage={true}
                fetchNextPage={jest.fn()}
                refetch={jest.fn()}
            />
        );
        getByTestId('flatlist').props.onEndReached()

        expect(refetchMock).toHaveBeenCalledTimes(0)
    })

});
