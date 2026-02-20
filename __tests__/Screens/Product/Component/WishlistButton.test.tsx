import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import WishlistButton from '../../../../src/Screens/Product/Component/WishlistButton';
import { useUpdateWishlist } from '../../../../src/Services/Main/Hooks';



// --- Mock useUpdateWishlist hook ---
const mutateMock = jest.fn();
jest.mock('../../../../src/Services/Main/Hooks', () => ({
    useUpdateWishlist: jest.fn()
}));
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

jest.useFakeTimers();


describe('WishlistButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ; (useUpdateWishlist as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        })
    });

    it('renders with inactive heart icon when status is false', () => {
        const { getByTestId } = render(
            <WishlistButton productId="1" status={false} />
        );

        const icon = getByTestId('icon-1');
        expect(icon).toBeTruthy()
    });

    it('renders with active heart icon when status is true', () => {
        const { getByTestId } = render(
            <WishlistButton productId="1" status={true} />
        );

        const icon = getByTestId('icon-1');
        expect(icon.props.name).toBe('heart');
        expect(icon.props.color).toBe('red');
    });

    it('shows ActivityIndicator while loading', async () => {

        const { getByTestId, queryByTestId } = render(
            <WishlistButton productId="1" status={false} />
        );

        fireEvent.press(getByTestId('wishlist-1'));
        expect(getByTestId('loader')).toBeTruthy()
    });


    // it('toggles wishlist status on successful mutate', async () => {
    //     const response = { success: true, _payload: { isAdded: true } };

    //     mutateMock.mockImplementationOnce((_, { onSuccess }) => {
    //         setTimeout(() => onSuccess(response), 0); // async
    //     });

    //     const { getByTestId } = render(
    //         <WishlistButton productId="1" status={false} />
    //     );

    //     // Press the button to trigger mutate
    //     fireEvent.press(getByTestId('wishlist-1'));

    //     // Fast-forward timers so the setTimeout runs
    //     await act(async () => {
    //         jest.runAllTimers();
    //     });

    //     // Now icon should appear
    //     const icon = getByTestId('icon-1');
    //     expect(icon.props.name).toBe('heart');
    //     expect(icon.props.color).toBe('red');
    // });

    // it('rolls back status on mutate error', async () => {
    //     mutateMock.mockImplementationOnce((_, { onError }) => onError());

    //     const { getByTestId } = render(
    //         <WishlistButton productId="1" status={true} />
    //     );

    //     fireEvent.press(getByTestId('wishlist-1'));

    //     await waitFor(() => {
    //         const icon = getByTestId('icon-1');
    //         // Should remain true because initial status was true
    //         expect(icon.props.name).toBe('heart');
    //         expect(icon.props.color).toBe('red');
    //     });
    // });

    // it('calls refetch if isPageRefresh is true', async () => {
    //     const refetchMock = jest.fn();
    //     const response = { success: true, _payload: { isAdded: true } };

    //     // mutateMock.mockImplementationOnce((_, { onSuccess }) => onSuccess(response));

    //     const { getByTestId } = render(
    //         <WishlistButton
    //             productId="1"
    //             status={false}
    //             isPageRefresh={true}
    //             refetch={refetchMock}
    //         />
    //     );

    //     fireEvent.press(getByTestId('wishlist-1'));

    //     // await waitFor(() => {
    //     // expect(refetchMock).toHaveBeenCalled();
    //     // });
    // });
});
