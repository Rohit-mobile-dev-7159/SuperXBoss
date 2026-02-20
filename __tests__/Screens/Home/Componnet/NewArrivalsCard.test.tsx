import { useSelector } from "react-redux";
import NewArrivalsCard from "../../../../src/Screens/Home/Component/NewArrivalsCard";
import { renderWithClient } from "../../../../src/Test/test-utils";
import { fireEvent } from "@testing-library/react-native";
const mockData = {
    data: [{
        _id: '1',
        images: ['http://image.png'],
        any_discount: '5'
    }]
}

const mockData2 = {
    data: [{
        _id: '1',
        images: [],
        any_discount: '5'
    }]
}
//  Mocks

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

describe('Name of the group', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    // -------------TEST 1 ---------------
    it('should new arrival product render', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        const { getByTestId } = renderWithClient(<NewArrivalsCard {...mockData} />)
        expect(getByTestId('arrival')).toBeTruthy()
    });

    // -------------TEST 2 ---------------
    it('should show list footer', () => {
        const { getByTestId } = renderWithClient(<NewArrivalsCard {...mockData} />)
        fireEvent.press(getByTestId('footer'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // -------------TEST 3 ---------------
    it('should render list item', () => {
        const { getByTestId } = renderWithClient(<NewArrivalsCard {...mockData} />)
        fireEvent.press(getByTestId('arrival_detail'))
        expect(getByTestId('item_1')).toBeTruthy()
        expect(mockNavigate).toHaveBeenCalled()
    });

    // -------------TEST 4 ---------------
    it('should show default image when item images length 0', () => {
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'b2b' } },
            })
        );
        const { getByTestId } = renderWithClient(<NewArrivalsCard {...mockData2} />)
    });
});