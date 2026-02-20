import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductSearchScreen from '../../../../src/Screens/Home/Component/ProductSearchScreen';
import { renderWithClient } from '../../../../src/Test/test-utils';
import { fetchAllProduct } from '../../../../src/Services/Main/apis';
import NavigationString from '../../../../src/Constant/NavigationString';
import { BackHandler } from 'react-native';

jest.useFakeTimers();

// ------------------ MOCKS ------------------

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();
const mockRemove = jest.fn();
let backHandlerCallback: any;
jest.spyOn(BackHandler, 'addEventListener').mockImplementation(
    (_eventName, callback) => {
        backHandlerCallback = callback;
        return { remove: mockRemove };
    }
);

jest.mock('../../../../src/Services/Main/apis', () => ({
    fetchAllProduct: jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: jest.fn(),
}));

// ------------------ TEST DATA ------------------

const mockProduct = {
    _id: '1',
    name: 'break',
    brand: { name: 'tata' },
};

describe('ProductSearchScreen', () => {
    const mockNavigation = {
        navigate: mockNavigate,
        goBack: mockGoBack,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useSelector as any).mockImplementation((selector: any) =>
            selector({
                search: {
                    recentSearches: [],
                },
            })
        );
    });

    // -------------------------------------------
    it('should render and handle go back', () => {
        const { getByTestId } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        fireEvent.press(getByTestId('go_back'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    // -------------------------------------------
    it('should handle search input and clear', () => {
        const { getByTestId } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        const input = getByTestId('search_input');

        fireEvent.changeText(input, 'break');
        expect(input.props.value).toBe('break');

        fireEvent.press(getByTestId('empty_search'));
        expect(input.props.value).toBe('');
    });

    // -------------------------------------------
    it('should fetch and render product list', async () => {
        (fetchAllProduct as any).mockResolvedValue({
            _payload: [mockProduct],
        });

        const { getByTestId, findByText } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        fireEvent.changeText(getByTestId('search_input'), 'break');

        jest.runAllTimers(); // run debounce

        await waitFor(() => {
            expect(fetchAllProduct).toHaveBeenCalled();
        });

        expect(await findByText('break')).toBeTruthy();
        expect(await findByText('tata')).toBeTruthy();
    });

    // -------------------------------------------
    it('should navigate when product is pressed', async () => {
        (fetchAllProduct as jest.Mock).mockResolvedValue({
            _payload: [mockProduct],
        });

        const { getByTestId, findByText } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        fireEvent.changeText(getByTestId('search_input'), 'break');
        jest.runAllTimers();

        const productItem = await findByText('break');

        fireEvent.press(productItem);

        expect(mockNavigate).toHaveBeenCalledWith(
            NavigationString.ProductDetail,
            { productId: '1' }
        );
    });

    // -------------------------------------------
    it('should show "No products found" when empty result', async () => {
        (fetchAllProduct as jest.Mock).mockResolvedValue({
            _payload: [],
        });

        const { getByTestId, findByText } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        fireEvent.changeText(getByTestId('search_input'), 'clutch');
        jest.runAllTimers();

        expect(await findByText('No products found')).toBeTruthy();
    });

    // -------------------------------------------
    it('should render recent searches when available', () => {
        (useSelector as any).mockImplementation((selector: any) =>
            selector({
                search: {
                    recentSearches: [
                        { _id: '10', name: 'engine' },
                    ],
                },
            })
        );

        const { getByText, getByTestId } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        expect(getByText('Recent Searches')).toBeTruthy();
        expect(getByText('engine')).toBeTruthy();
        fireEvent.press(getByTestId('recent_10'))
        expect(getByText('Clear all')).toBeTruthy();
    });

    // -------------------------------------------
    it('should clear recent searches', () => {
        (useSelector as any).mockImplementation((selector: any) =>
            selector({
                search: {
                    recentSearches: [
                        { _id: '10', name: 'engine' },
                    ],
                },
            })
        );

        const { getByText } = renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        fireEvent.press(getByText('Clear all'));

        expect(mockDispatch).toHaveBeenCalled();
    });

    // -------------------------------------------
    it('should call navigation.goBack when hardware back is pressed', () => {
        const mockNavigation = {
            navigate: jest.fn(),
            goBack: jest.fn(),
        };

        renderWithClient(
            <ProductSearchScreen navigation={mockNavigation as any} />
        );

        // Simulate hardware back press
        const result = backHandlerCallback();

        expect(mockNavigation.goBack).toHaveBeenCalled();
        expect(result).toBe(true);
    });

});
