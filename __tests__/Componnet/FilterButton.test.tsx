import { fireEvent, render } from '@testing-library/react-native'
import FilterButton from '../../src/Component/FilterButton'
import NavigationString from '../../src/Constant/NavigationString'

// ✅ create mock reference holder
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

describe('FilterButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render correctly', () => {
    const { getByTestId } = render(<FilterButton />)
    expect(getByTestId('filter-button')).toBeTruthy()
  })

  it('should navigate to FilterPage on press', () => {
    const { getByTestId } = render(<FilterButton />)

    fireEvent.press(getByTestId('filter-button'))

    expect(mockNavigate).toHaveBeenCalledWith(
      NavigationString.FilterPage
    )
  })
})
