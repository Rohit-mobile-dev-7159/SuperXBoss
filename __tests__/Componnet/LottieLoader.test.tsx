import { render } from "@testing-library/react-native";
import LottieLoader from "../../src/Component/LottieLoader";
import { renderWithClient } from "../../src/Test/test-utils";


const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
        }),
        useFocusEffect: jest.fn(),

    };
});
describe('LottieLoader Component', () => {
    it('should render LottieLoader component', () => {
        const { getByTestId } = renderWithClient(<LottieLoader url={require('../../src/lottie/Inventory.json')} />);
        expect(getByTestId('lottie-loader')).toBeTruthy();
    });

})