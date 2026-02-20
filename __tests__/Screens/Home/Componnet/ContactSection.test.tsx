import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import ContactSection from '../../../../src/Screens/Home/Component/ContactSection';
import { renderWithClient } from '../../../../src/Test/test-utils';

describe('ContactSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //  Mock Linking
    beforeAll(() => {
        jest.spyOn(Linking, 'openURL').mockImplementation(jest.fn());
    });

    it('should render contact component', () => {
        const { getByTestId } = renderWithClient(<ContactSection />);
        expect(getByTestId('contact')).toBeTruthy();
    });

    it('should open phone dialer when call button pressed', () => {
        const { getByTestId } = renderWithClient(<ContactSection />);

        fireEvent.press(getByTestId('call_button'));

        expect(Linking.openURL).toHaveBeenCalledWith('tel:+1234567890');
    });

    it('should open facebook link', () => {
        const { getByTestId } = renderWithClient(<ContactSection />);

        fireEvent.press(getByTestId('facebook_button'));

        expect(Linking.openURL).toHaveBeenCalledWith(
            'https://www.facebook.com/profile.php?id=61580076416783'
        );
    });

    it('should open thread link', () => {
        const { getByTestId } = renderWithClient(<ContactSection />);

        fireEvent.press(getByTestId('thread_button'));

        expect(Linking.openURL).toHaveBeenCalledWith(
            'https://x.com/SuperxBoss?t=WHEukkZp-GKOnUOAtCFvaw&s=08'
        );
    });

    it('should open instagram link', () => {
        const { getByTestId } = renderWithClient(<ContactSection />);

        fireEvent.press(getByTestId('instagram_button'));

        expect(Linking.openURL).toHaveBeenCalledWith(
            'https://www.instagram.com/superxboss24?igsh=MXF4eDk2OWU4cnpxbA=='
        );
    });

});
