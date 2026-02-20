import React from 'react';
import { render } from '@testing-library/react-native';
import Splash from '../../../src/Screens/Splash/Splash';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

jest.useFakeTimers();

// Mock navigation
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    dispatch: mockDispatch,
  }),
  CommonActions: {
    reset: jest.fn((payload) => payload),
  },
}));

// Mock redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Splash Screen', () => {

  beforeEach(() => {
    jest.clearAllMocks();

  });

  it('should render component', () => {
    (useSelector as any).mockReturnValue({
      token: null,
    });

    const { getByTestId } = render(<Splash />);
    expect(getByTestId('Splash')).toBeTruthy();
  });

  it('should navigate to Login if no token', () => {
    (useSelector as any).mockImplementation((selector: any) =>
      selector({
        token: {
          token: {
            token: '',
            type: [],
            mobile: '',
          },
        },
      })
    );

    render(<Splash />);

    jest.runAllTimers();

    expect(CommonActions.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should navigate to UserInfo if type is empty', () => {
    (useSelector as any).mockImplementation((selector: any) =>
      selector({
        token: {
          token: {
            token: 'abc',
            type: [],
            mobile: '9999999999',
          },
        },
      })
    );


    render(<Splash />);

    jest.runAllTimers();

    expect(CommonActions.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: 'UserInfo',
          params: { mobile: '9999999999' },
        },
      ],
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should navigate to Home if token and type exist', () => {
     (useSelector as any).mockReturnValue({
      token: 'abc',
      type: ['user'],
      mobile: '9999999999',
    });

    render(<Splash />);

    jest.runAllTimers();

    expect(CommonActions.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Home' }],
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});
