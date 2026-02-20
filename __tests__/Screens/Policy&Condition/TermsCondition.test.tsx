import { render, renderAsync, screen } from '@testing-library/react-native';
import TermsCondition from '../../../src/Screens/Policy&Condition/TermsCondition';
import { usePrivacyPolicy } from '../../../src/Services/Main/Hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const mockurl = {
    _payload: {
        termsCondition: {
            url: 'https://oss.callstack.com/react-native-testing-library/docs/api/render'
        }
    }
}

const mockurl2 = {
    _payload: {
        termsCondition: {
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

describe('Term_Condition', () => {
    it('api call', () => {
        (usePrivacyPolicy as jest.Mock).mockReturnValue({
            data: mockurl,
            isLoading: false
        })
        const { getByTestId } = renderWithClient(<TermsCondition />)
        expect(getByTestId("wrapper")).toBeTruthy()
    });

    it('if url comes empty', () => {
        (usePrivacyPolicy as jest.Mock).mockReturnValue({
            data: mockurl2,
            isLoading: false
        })
        const { getByTestId } = renderWithClient(<TermsCondition />)
        expect(getByTestId("N/F")).toBeTruthy()
    });
});