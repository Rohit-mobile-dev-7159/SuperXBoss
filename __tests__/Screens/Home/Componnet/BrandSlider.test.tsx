import { fireEvent } from "@testing-library/react-native";
import BrandSlider from "../../../../src/Screens/Home/Component/BrandSlider";
import { renderWithClient } from "../../../../src/Test/test-utils";

const mockData = {
    data: [{ _id: '1', name: "Audi", logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png' }],
    title: "Rohit",
    type: 'Vehicle'
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

describe('Brand Slider Component', () => {
    // -------------------TEST 1 -----------------
    it('should render component', () => {
        const { getByTestId } = renderWithClient(<BrandSlider {...mockData} />)
        expect(getByTestId('Vehicle')).toBeTruthy()
    });

    // -------------------TEST 2 -----------------
    it('should onPress to navigate', () => {
        const { getByTestId } = renderWithClient(<BrandSlider {...mockData} />)
        expect(getByTestId('Vehicle')).toBeTruthy()
        expect(getByTestId('item_1')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(mockNavigate).toHaveBeenCalled
    });

    // -------------------TEST 3 -----------------
    it('should onPress to navigate', () => {
        const data = { ...mockData, type: 'spare' }
        const { getByTestId } = renderWithClient(<BrandSlider {...data} />)
        expect(getByTestId('spare')).toBeTruthy()
        expect(getByTestId('item_1')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // -------------------TEST 3 -----------------
    it('should footer with action', () => {
        const data = { ...mockData, type: 'spare' }
        const { getByTestId } = renderWithClient(<BrandSlider {...data} />)
        expect(getByTestId('spare')).toBeTruthy()
        expect(getByTestId('footer')).toBeTruthy()
        fireEvent.press(getByTestId('footer'))
        expect(mockNavigate).toHaveBeenCalled()
    });
});