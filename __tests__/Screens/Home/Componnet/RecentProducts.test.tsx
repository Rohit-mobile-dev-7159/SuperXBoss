import { useSelector } from "react-redux";
import RecentProducts from "../../../../src/Screens/Home/Component/RecentProducts";
import { renderWithClient } from "../../../../src/Test/test-utils";
import { fireEvent } from "@testing-library/react-native";
const mockData = {
    data: [
        {
            _id: 1,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 2,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 3,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 4,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 5,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 6,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 7,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 8,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 9,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
        },
        {
            _id: 10,
            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
            bulk_discount: [{ discount: '20' }]
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
            item_stock: 10
        },
    ]
}

//  Mocks
const mockNavigate = jest.fn()
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

describe('Recent Product list', () => {
    beforeEach(() => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
    })
    // -------------------TEST 1 ----------
    it('should component render', () => {
        const { getByTestId } = renderWithClient(<RecentProducts {...mockData} />)
        expect(getByTestId('recent_product')).toBeTruthy()
    });

    // -------------------TEST 2 ----------
    it('should press of product detail button', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        const { getByTestId } = renderWithClient(<RecentProducts {...mockData2} />)
        fireEvent.press(getByTestId('detail_1'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // -------------------TEST 3 ----------
    it('should press of product detail with B2B', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const { getByTestId } = renderWithClient(<RecentProducts {...mockData2} />)
        fireEvent.press(getByTestId('detail_1'))
        expect(mockNavigate).toHaveBeenCalled()
    });

});