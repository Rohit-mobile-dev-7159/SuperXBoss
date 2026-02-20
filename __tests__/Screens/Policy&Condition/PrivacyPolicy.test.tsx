import { render } from '@testing-library/react-native';
import { usePrivacyPolicy } from '../../../src/Services/Main/Hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivacyPolicy from '../../../src/Screens/Policy&Condition/PrivacyPolicy';
const mockurl = {
    _payload: {
        privacyPolicy: {
            url: 'https://oss.callstack.com/react-native-testing-library/docs/api/render'
        }
    }
}

const mockurl2 = {
    _payload: {
        privacyPolicy: {
            url: ''
        }
    }
}

jest.mock('../../../src/Services/Main/Hooks', () => ({
    usePrivacyPolicy: jest.fn(),
}))

const createClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

const renderWithClient = (ui: React.ReactElement) =>
    render(
        <QueryClientProvider client={createClient()}>
            {ui}
        </QueryClientProvider>
    )

describe('Privacy Policy', () => {
    it('api call', () => {
        (usePrivacyPolicy as jest.Mock).mockReturnValue({
            data: mockurl,
            isLoading: false
        })
        const { getByTestId } = renderWithClient(<PrivacyPolicy />)
        expect(getByTestId("wrapper")).toBeTruthy()
    });

    it('if url comes empty', () => {
        (usePrivacyPolicy as jest.Mock).mockReturnValue({
            data: mockurl2,
            isLoading: false
        })
        const { getByTestId } = renderWithClient(<PrivacyPolicy />)
        expect(getByTestId("N/F")).toBeTruthy()
    });
});