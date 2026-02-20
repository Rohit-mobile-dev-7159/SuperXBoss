import { fireEvent } from "@testing-library/react-native";
import { renderWithClient } from "../../../../src/Test/test-utils";
import CategorySlider from "../../../../src/Screens/Home/Component/CategorySlider";

const mockData = {
    data: [{ _id: '1', name: "Audi", picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png' }],
}

// Mocks

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

describe('Category Slider Component', () => {
    // -------------------TEST 1 -----------------
    it('should render component', () => {
        const { getByTestId } = renderWithClient(<CategorySlider {...mockData} />)
        expect(getByTestId('category')).toBeTruthy()
    });

    // -------------------TEST 2 -----------------
    it('should onPress to navigate', () => {
        const { getByTestId } = renderWithClient(<CategorySlider {...mockData} />)
        expect(getByTestId('category')).toBeTruthy()
        expect(getByTestId('item_1')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(mockNavigate).toHaveBeenCalled
    });



    // -------------------TEST 3 -----------------
    it('should render footer with action', () => {
        const { getByTestId } = renderWithClient(<CategorySlider {...mockData} />)
        expect(getByTestId('category')).toBeTruthy()
        expect(getByTestId('footer')).toBeTruthy()
        fireEvent.press(getByTestId('footer'))
        expect(mockNavigate).toHaveBeenCalledTimes(0)
    });
});