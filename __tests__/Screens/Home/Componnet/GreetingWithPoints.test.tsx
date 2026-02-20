import { fireEvent, render } from "@testing-library/react-native";
import GreetingWithPoints from "../../../../src/Screens/Home/Component/GreetingWithPoints";
import { renderWithClient } from "../../../../src/Test/test-utils";
import { useFetchUserProfile } from "../../../../src/Services/Main/Hooks";

const mockNavigate = jest.fn();

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

jest.mock('../../../../src/Services/Main/Hooks', () => ({
    useFetchUserProfile: jest.fn(),
}));

const mockHook = (overrides = {}) => ({
    data: [],
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
});

describe('GreetingWithPoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useFetchUserProfile as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false, data: { _payload: { point: 200, name: 'Rohit' } } })
        );
    });

    it('should component render properly', () => {
        const { getByTestId } = renderWithClient(<GreetingWithPoints />);
        expect(getByTestId('greet')).toBeTruthy();
    });

    it('should navigate on Wallet Screen', () => {
        const { getByTestId } = renderWithClient(<GreetingWithPoints />);
        fireEvent.press(getByTestId('go_wallet'));
        expect(mockNavigate).toHaveBeenCalled();
    });

    it('should show user reward points', () => {
        const { getByTestId } = renderWithClient(<GreetingWithPoints />);
        expect(getByTestId('point')).toBeTruthy();
    });

    it('should show morning greeting', () => {
        jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(9);

        const { getByText } = renderWithClient(<GreetingWithPoints />);
        expect(getByText(/Good Morning/i)).toBeTruthy();
    });

    it('should show afternoon greeting', () => {
        jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(14);

        const { getByText } = renderWithClient(<GreetingWithPoints />);
        expect(getByText(/Good Afternoon/i)).toBeTruthy();
    });

    it('should show evening greeting', () => {
        jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(20);

        const { getByText } = renderWithClient(<GreetingWithPoints />);
        expect(getByText(/Good Evening/i)).toBeTruthy();
    });

});
