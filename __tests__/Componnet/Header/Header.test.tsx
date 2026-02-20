import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Header } from '../../../src/Component/Index';
import NavigationString from '../../../src/Constant/NavigationString';
// ---------- MOCKS ----------

// mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// mock redux selector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// mock icons (VERY IMPORTANT in RN tests)
jest.mock('../../../src/Constant/ImagePath', () => ({
  Icon: {
    HumBurger: () => null,
    Search: () => null,
    HeartFill: () => null,
    Cart: () => null,
    Notification: () => null,
  },
  BackArrow: () => null,
}));

describe('Header Component', () => {
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
      navigate: mockNavigate,
    });

    (useSelector as any).mockReturnValue({
      1: [{id: 1, quantity: 1}],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render header title', () => {
    const { getByText } = render(<Header title="Home" />);

    expect(getByText('Home')).toBeTruthy();
  });

  it('should call goBack when back arrow is pressed', () => {
    const { getByTestId } = render(<Header title="Details" />);

    fireEvent.press(getByTestId('GoBack'));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should navigate to Cart screen on cart icon press', () => {
    const { getByTestId } = render(
      <Header title="Home" isIcons />
    );

    fireEvent.press(getByTestId('Cart'));
    expect(mockNavigate).toHaveBeenCalledWith(
      NavigationString.Cart
    );
  });

   

  it('should navigate to on search screen', () => {
    const { getByTestId } = render(
      <Header title="Home" isIcons />
    );

    fireEvent.press(getByTestId('Search'));
    expect(mockNavigate).toHaveBeenCalledWith(
      NavigationString.ProductSearchScreen
    );
  });
});
