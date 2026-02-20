import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { showErrorAlert, showSuccessAlert, showToast } from '../../src/Constant/ShowDailog'

// 🔥 mock Toast only
jest.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    SUCCESS: 'SUCCESS',
    DANGER: 'DANGER',
  },
  Toast: {
    show: jest.fn(),
  },
}))

describe('Alert Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show success alert', () => {
    showSuccessAlert('Success message')

    expect(Toast.show).toHaveBeenCalledWith({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Success message',
    })
  })

  it('should show error alert', () => {
    showErrorAlert('Error message')

    expect(Toast.show).toHaveBeenCalledWith({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: 'Error message',
    })
  })

  it('should show generic success toast', () => {
    showToast('Toast message')

    expect(Toast.show).toHaveBeenCalledWith({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Toast message',
    })
  })
})
