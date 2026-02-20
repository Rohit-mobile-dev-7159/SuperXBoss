import { fireEvent } from "@testing-library/react-native";
import SalesBanner from "../../../../src/Screens/Home/Component/SalesBanner";
import { renderWithClient } from "../../../../src/Test/test-utils";
import { Animated } from "react-native";
interface SalesBannerProps {
    variant?: 'default' | 'modern' | 'elegant' | 'minimal';
    discountText?: string;
    saleText?: string;
    backgroundColor?: string;
    textColor?: string;
    onPress?: () => void;
    imageUrl?: any;
    timeRemaining?: string;
    badgeText?: string;
    height?: number;
}

const mcokData: SalesBannerProps = {
    variant: 'modern',
    discountText: '50% OFF',
    saleText: 'SUMMER SALE',
    backgroundColor: '#FF5252',
    textColor: '#fff',
    onPress: jest.fn(),
    imageUrl: null,
    timeRemaining: '10',
    badgeText: 'HOT',
    height: 140,
}

const mcokData2: SalesBannerProps = {
    variant: 'elegant',
    discountText: '50% OFF',
    saleText: 'SUMMER SALE',
    backgroundColor: '#FF5252',
    textColor: '#fff',
    onPress: jest.fn(),
    imageUrl: null,
    timeRemaining: '10',
    badgeText: 'HOT',
    height: 140,
}
const mcokData3: SalesBannerProps = {
    onPress: jest.fn(),
}
const mcokData4: SalesBannerProps = {
    variant: 'minimal',
    discountText: '50% OFF',
    saleText: 'SUMMER SALE',
    backgroundColor: '#FF5252',
    textColor: '#fff',
    onPress: jest.fn(),
    imageUrl: null,
    timeRemaining: '10',
    badgeText: 'HOT',
    height: 140,
}
describe('Sales Banner', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -----------------TEST 1-------------
    it('should render with default value', () => {
        const { getByTestId } = renderWithClient(<SalesBanner {...mcokData3} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 1.2-------------
    it('should render with default value with imageUrl', () => {
        const data = { ...mcokData3, imageUrl: 'http://logo.png', }
        const { getByTestId } = renderWithClient(<SalesBanner {...data} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 2 -------------
    it('should component redner with different variant elegant', () => {
        const { getByTestId } = renderWithClient(<SalesBanner {...mcokData2} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 2.2 -------------
    it('should component redner with different variant elegant', () => {
        const data = { ...mcokData2, imageUrl: 'http://logo.png', }
        const { getByTestId } = renderWithClient(<SalesBanner {...data} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 3 -------------
    it('should component redner with different variant minimal', () => {
        const { getByTestId } = renderWithClient(<SalesBanner {...mcokData4} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 3.2 -------------
    it('should component redner with different variant minimal', () => {
        const data = { ...mcokData4, imageUrl: 'http://logo.png', }
        const { getByTestId } = renderWithClient(<SalesBanner {...data} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 4 -------------
    it('should component render mordern', () => {
        const { getByTestId } = renderWithClient(<SalesBanner {...mcokData} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 4.2 -------------
    it('should component render with variant mordern with imageUrl', () => {
        const data = { ...mcokData, imageUrl: 'http://logo.png', }
        const { getByTestId } = renderWithClient(<SalesBanner {...data} />)
        expect(getByTestId('sale_banner')).toBeTruthy()
    });

    // -----------------TEST 5 -------------
    it('should call animation on pressIn', () => {
        const springSpy = jest.spyOn(Animated, 'spring');
        const parallelSpy = jest.spyOn(Animated, 'parallel');

        const { getByTestId } = renderWithClient(<SalesBanner imageUrl="x" />);

        const btn = getByTestId('sales_ban_btn');

        fireEvent(btn, 'pressIn');

        expect(parallelSpy).toHaveBeenCalled();
        expect(springSpy).toHaveBeenCalled();
    });

    it('should call animation on pressOut', () => {
        const springSpy = jest.spyOn(Animated, 'spring');
        const parallelSpy = jest.spyOn(Animated, 'parallel');

        const { getByTestId } = renderWithClient(<SalesBanner imageUrl="x" />);

        const btn = getByTestId('sales_ban_btn');

        fireEvent(btn, 'pressOut');

        expect(parallelSpy).toHaveBeenCalled();
        expect(springSpy).toHaveBeenCalled();
    });
});