jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: ({ name }: any) => <>{name}</>,
    })),
  };
});
