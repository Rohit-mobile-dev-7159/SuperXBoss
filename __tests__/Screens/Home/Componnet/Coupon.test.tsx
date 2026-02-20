import React from 'react';
import Coupon from '../../../../src/Screens/Home/Component/Coupon';
import moment from 'moment';
import { renderWithClient } from '../../../../src/Test/test-utils';
import { fireEvent, render } from '@testing-library/react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

const validCoupon = {
    _id: '1',
    code: 'SAVE500',
    amount: 500,
    min_cart_amt: 100,
    start_date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    end_date: moment().add(5, 'day').format('YYYY-MM-DD'),
    status: true,
};

const expiredCoupon = {
    _id: '2',
    code: 'OLD100',
    amount: 100,
    min_cart_amt: 50,
    start_date: '2020-01-01',
    end_date: '2020-01-10',
    status: false,
};

describe('Coupon Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    // ------------------ TEST 1 ----------------
    it('renders component with valid coupons', () => {
        const { getByTestId } = render(<Coupon coupons={[validCoupon]} />);

        expect(getByTestId('coupon')).toBeTruthy();
        expect(getByTestId('list')).toBeTruthy();
    });

    // ------------------ TEST 2 ----------------
    it('shows empty state when no valid coupons', () => {
        const { getByText } = renderWithClient(
            <Coupon coupons={[expiredCoupon]} />
        );

        expect(getByText('No coupons available')).toBeTruthy();
    });

    // ------------------ TEST 3 ----------------
    it('navigates when View All is pressed', () => {
        const { getByText } = renderWithClient(
            <Coupon coupons={[validCoupon]} />
        );

        const viewAllBtn = getByText('View all');
        fireEvent.press(viewAllBtn);

        expect(mockNavigate).toHaveBeenCalled();
    });
    
    // ------------------ TEST 4 ----------------
    it('filters out expired coupons from list', () => {
        const { queryByText } = renderWithClient(
            <Coupon coupons={[validCoupon, expiredCoupon]} />
        );

        expect(queryByText('SAVE500')).toBeTruthy();
        expect(queryByText('OLD100')).toBeNull();
    });

});
