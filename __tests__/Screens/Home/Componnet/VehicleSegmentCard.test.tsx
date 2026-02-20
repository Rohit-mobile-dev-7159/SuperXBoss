import { useSelector } from "react-redux";
import { renderWithClient } from "../../../../src/Test/test-utils";
import VehicleSegmentCard from "../../../../src/Screens/Home/Component/VehicleSegmentCard";
import { fireEvent } from "@testing-library/react-native";
const mockData = {
    data: [
        {
            _id: '1',
            icon: '',
            name: 'Tractor'
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

describe('Vehicle Segment Cart', () => {
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
        const { getByTestId } = renderWithClient(<VehicleSegmentCard {...mockData} />)
        expect(getByTestId('vehicle_segment')).toBeTruthy()
    });

    // -------------------TEST 2 ----------
    it('should Button Press', () => {
        const { getByTestId } = renderWithClient(<VehicleSegmentCard {...mockData} />)
        expect(getByTestId('vehicle_segment')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(mockNavigate).toHaveBeenCalledTimes(0)
    });
});