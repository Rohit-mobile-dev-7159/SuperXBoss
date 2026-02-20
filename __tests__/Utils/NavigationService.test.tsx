// MUST mock first
jest.mock('@react-navigation/native', () => {
  return {
    createNavigationContainerRef: jest.fn(() => ({
      isReady: jest.fn(),
      navigate: jest.fn(),
    })),
  }
})

// THEN import
import { navigationRef, navigate, isReady } from '../../src/Utils/NavigationService'

describe('NavigationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate when navigation is ready', () => {
    // arrange
    ;(navigationRef.isReady as jest.Mock).mockReturnValue(true)

    // act
    navigate('Home')

    // assert
    expect(navigationRef.navigate).toHaveBeenCalledWith('Home', undefined)
  })

  it('isReady should return navigation readiness', () => {
    ;(navigationRef.isReady as jest.Mock).mockReturnValue(true)

    expect(isReady()).toBe(true)
  })
})
