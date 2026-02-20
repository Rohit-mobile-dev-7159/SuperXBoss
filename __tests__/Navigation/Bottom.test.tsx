import React from 'react'
import { render } from '@testing-library/react-native'
import BottomTab from '../../src/Navigation/Bottom'

// ---------- MOCK SCREENS ----------
jest.mock('../../src/Screens', () => ({
  Home: () => null,
  Categories: () => null,
  BrandDay: () => null,
  Profile: () => null,
}))

// ---------- MOCK ICONS ----------
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon')

// ---------- MOCK BOTTOM TABS ----------
const mockScreen = jest.fn()

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: (props: any) => {
        mockScreen(props)
        return null
      },
    }),
  }
})

// ---------- TEST ----------
describe('BottomTab', () => {
  beforeEach(() => {
    mockScreen.mockClear()
  })

  it('should register all bottom tab screens', () => {
    render(<BottomTab />)

    const screenNames = mockScreen.mock.calls.map(
      call => call[0].name
    )

    expect(screenNames).toEqual(
      expect.arrayContaining([
        'Home',
        'Categories',
        'BrandDay', 
        'Profile',
      ])
    )
  })
})
