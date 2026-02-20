import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import MainStack from '../../src/Navigation/MainStack';

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: ({ name }: any) => <>{name}</>,
      useNavigation: jest.fn(),
    })),
  };
});

describe('MainStack', () => {
  it('renders all screens', () => {
    render(
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>,
    );
  });
});
