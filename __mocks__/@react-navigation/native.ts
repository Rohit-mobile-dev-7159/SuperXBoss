export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
})

export const createNavigationContainerRef = jest.fn(() => ({
  isReady: jest.fn(() => true),
  navigate: jest.fn(),
}))

export const NavigationContainer = ({ children }: any) => children
    