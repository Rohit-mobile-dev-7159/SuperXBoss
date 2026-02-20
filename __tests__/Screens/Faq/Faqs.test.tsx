import { render } from '@testing-library/react-native';
import { useFetchFAQs } from '../../../src/Services/Main/Hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Faqs from '../../../src/Screens/Faqs/Faqs';
import { useSelector } from 'react-redux';

jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchFAQs: jest.fn(),
}))

// navigation
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

// redux
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}))

const createClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })
}


const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={createClient()}>
            {ui}
        </QueryClientProvider>
    )
}


const mockFaqData = {
    result: [
        {
            question: "What is React Native?",
            answer: "React Native is a framework for building apps.",
            isActive: true
        },
    ],
};

describe('Faqs', () => {
    beforeEach(() => {
        jest.clearAllMocks(),
            (useSelector as any).mockImplementation((selectorFn: any) =>
                selectorFn({
                    cart: {
                        cartProducts: {
                            1: { qty: 2 },
                            2: { qty: 1 },
                        },
                    },
                })
            )
    })
    
    it('when list is empty', () => {
        (useFetchFAQs as jest.Mock).mockReturnValue({
            data: { result: null },
            isLoading: false,
        });

        const { getByText } = renderWithClient(<Faqs />);

        expect(getByText('No FAQs available')).toBeTruthy();
    });

    it('api call', () => {
        (useFetchFAQs as jest.Mock).mockReturnValue({
            data: mockFaqData,
            isLoading: false
        })
        const { getByTestId, getByText, getAllByText } = renderWithClient(<Faqs />)
        expect(getByTestId("wrapper")).toBeTruthy()
        expect(getByText("What is React Native?")).toBeTruthy()
    });

    it('when isLoading ture', () => {
        (useFetchFAQs as jest.Mock).mockReturnValue({
            data: { result: [] },
            isLoading: true
        })
        const { getByText } = renderWithClient(<Faqs />)
        expect(getByText("No FAQs available")).toBeTruthy()

    });
});