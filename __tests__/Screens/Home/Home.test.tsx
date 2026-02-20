import { useDispatch, useSelector } from "react-redux";
import Home from "../../../src/Screens/Home/Home";
import { renderWithClient } from "../../../src/Test/test-utils";
import { fireEvent, waitFor, act } from "@testing-library/react-native";
import { useFetchAllProduct, useFetchBanners, useFetchBrand, useFetchCategory, useFetchCoupon, useFetchRating, useFetchRecentViewedProduct, useFetchUserProfile, useFetchVehicleSegment, useUpdateWishlist } from "../../../src/Services/Main/Hooks";
import Share from 'react-native-share';
import { requestNotificationPermission, requestSinglePermission } from "../../../src/Permission";
import { useFocusEffect } from "@react-navigation/native";
const mockNavigate = jest.fn()
// Navigation Mock
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn(),
    createNavigationContainerRef: () => ({
        current: null,
        isReady: () => true,
        navigate: jest.fn(),
        dispatch: jest.fn(),
    })
}))

// Api Hook mock
jest.mock('../../../src/Services/Main/Hooks', () => ({
    useFetchCategory: jest.fn(),
    useFetchBrand: jest.fn(),
    useFetchBanners: jest.fn(),
    useFetchVehicleSegment: jest.fn(),
    useFetchAllProduct: jest.fn(),
    useFetchRecentViewedProduct: jest.fn(),
    useFetchCoupon: jest.fn(),
    useFetchRating: jest.fn(),
    useFetchUserProfile: jest.fn(),
    useUpdateWishlist: jest.fn()
}));

jest.useFakeTimers();

jest.mock("../../../src/Permission", () => ({
    requestNotificationPermission: jest.fn(() => Promise.resolve(true)),
    requestSinglePermission: jest.fn(() => Promise.resolve(true)),
}));


const mockHook = (overrides = {}) => ({
    data: [],
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
});


describe('Home Screen render', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSelector as any).mockImplementation((cb: any) =>
            cb({
                cart: { cartProducts: { 1: { qty: 2 } } },
                token: { token: { type: 'customer' } },
            })
        );
        (useFetchCategory as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false })
        );

        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false })
        );

        // Other hooks (not affecting isLoading)
        (useFetchBrand as jest.Mock).mockReturnValue(mockHook());
        (useFetchVehicleSegment as jest.Mock).mockReturnValue(mockHook());
        (useFetchAllProduct as jest.Mock).mockReturnValue(mockHook());
        (useFetchRecentViewedProduct as jest.Mock).mockReturnValue(mockHook());
        (useFetchCoupon as jest.Mock).mockReturnValue(mockHook({ data: { result: [] } }));
        (useFetchRating as jest.Mock).mockReturnValue(mockHook());
        (useFetchUserProfile as jest.Mock).mockReturnValue(mockHook({ data: {} }));
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    // ----------------------- TEST 1-------------
    it("should component render", () => {
        const { getByTestId } = renderWithClient(<Home />)
        expect(getByTestId('Home')).toBeTruthy()
        fireEvent.press(getByTestId('search'))
        fireEvent.press(getByTestId('filter'))
        fireEvent.press(getByTestId('help'))
        fireEvent.press(getByTestId('wishlist'))
        fireEvent.press(getByTestId('cart'))
        expect(mockNavigate).toHaveBeenCalled()
    })

    // ----------------------- TEST 2 -------------
    it("should render hero section when loading is false", () => {
        (useFetchCategory as jest.Mock).mockReturnValue(
            mockHook({ isLoading: true })
        );

        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({ isLoading: true })
        );


        const { getByTestId } = renderWithClient(<Home />);

        expect(getByTestId("skelton")).toBeTruthy();
    });

    // ----------------------- TEST 3 -------------
    it("should render hero section when loading is false", () => {
        (useFetchCategory as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false })
        );

        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({ isLoading: false })
        );


        const { getByTestId } = renderWithClient(<Home />);

        expect(getByTestId("hero")).toBeTruthy();
    });

    // ----------------------- TEST 4 -------------
    it("should render top banner and navigate on press for both items", () => {

        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    _payload: {
                        top: [
                            { product: { _id: 1, image: 'url1' } },
                            { product: { _id: 2, image: 'url2' } }
                        ]
                    }
                },
                isLoading: false
            })
        );

        const { getByTestId, getAllByTestId } = renderWithClient(<Home />);

        expect(getByTestId('swiper_1')).toBeTruthy();

        const items = getAllByTestId(/item_/);
        fireEvent.press(items[0]);
        fireEvent.press(items[1]);

        expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    // ----------------------- TEST 4.2 -------------
    it("should render top banner and with single data", () => {

        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    _payload: {
                        top: [
                            { product: { _id: 1, image: 'url1' } },
                        ]
                    }
                },
                isLoading: false
            })
        );

        const { getByTestId, getAllByTestId } = renderWithClient(<Home />);

        expect(getByTestId('swiper_1')).toBeTruthy();

        const items = getAllByTestId(/item_/);
        fireEvent.press(items[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
    })

    // ----------------------- TEST 5 -------------
    it("should render vehicle Barand", () => {
        (useFetchBrand as jest.Mock).mockReturnValue(
            mockHook({ data: { result: [{ _id: '3434' }] }, isLoading: false })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('Vehicle')).toBeTruthy()
    });

    // ----------------------- TEST 6 -------------
    it("should render Category", () => {
        (useFetchCategory as jest.Mock).mockReturnValue(
            mockHook({ data: { result: [{ _id: '434' }] }, isLoading: false })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('category')).toBeTruthy()
    });

    // ----------------------- TEST 8 -------------
    it("should render coupon", () => {
        (useFetchCoupon as jest.Mock).mockReturnValue(
            mockHook({ data: { result: [{ _id: '3434' }] }, isLoading: false })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('coupon')).toBeTruthy()
    });

    // ----------------------- TEST 8 -------------
    it("should render mid banner", () => {
        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({ data: { _payload: { mid: [{ product: { _id: 1, image: 'ffd' } }] } }, isLoading: false })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('swiper_2')).toBeTruthy()
        fireEvent.press(getByTestId('item_1'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // ----------------------- TEST 8.2 -------------
    it("should render mid banner", () => {
        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({ data: { _payload: { mid: [{ product: { _id: 1, image: 'ffd' } }, { product: { _id: 2, image: 'ffd' } }] } }, isLoading: false })
        );
        const { getByTestId, getAllByTestId } = renderWithClient(<Home />);
        expect(getByTestId('swiper_2')).toBeTruthy()
        const items = getAllByTestId(/item_/);
        fireEvent.press(items[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    // ----------------------- TEST 9 -------------
    it("should render Trending product", () => {
        (useFetchAllProduct as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    result: [
                        {
                            _id: 1,
                            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
                            bulk_discount: [{ discount: '20' }]
                        }
                    ]
                },
                isLoading: false
            })
        );
        (useUpdateWishlist as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        const { getByTestId } = renderWithClient(<Home />);
    });

    // ----------------------- TEST 10 -------------
    it("should render bottom banner", () => {
        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    _payload: {
                        bottom: [{ product: { _id: 8, image: 'ffd' } }],
                        top: [
                            { product: { _id: 1, image: 'url1' } },
                            { product: { _id: 2, image: 'url1' } },
                        ]
                    }
                }, isLoading: false
            })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('swiper_3')).toBeTruthy()
        fireEvent.press(getByTestId('item_8'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // ----------------------- TEST 10.2 -------------
    it("should render bottom banner", () => {
        (useFetchBanners as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    _payload: {
                        bottom: [{ product: { _id: 8, image: 'ffd' } }],
                        top: [
                            { product: { _id: 1, image: 'url1' } },
                        ]
                    }
                }, isLoading: false
            })
        );
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('swiper_3')).toBeTruthy()
        fireEvent.press(getByTestId('item_8'))
        expect(mockNavigate).toHaveBeenCalled()
    });

    // ----------------------- TEST 11 -------------
    it("should render Recent product", () => {
        (useFetchRecentViewedProduct as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    _payload: [
                        {
                            _id: 1,
                            images: ["https://pixabay.com/images/download/x-9821327_1920.jpg"],
                            bulk_discount: [{ discount: '20' }]
                        }
                    ]
                },
                isLoading: false
            })
        );
        // (useUpdateWishlist as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        const { getByTestId } = renderWithClient(<Home />);
    });

    // ----------------------- TEST 12 -------------
    it("should render Segment", () => {
        (useFetchVehicleSegment as jest.Mock).mockReturnValue(
            mockHook({
                data: {
                    result: [
                        {
                            _id: 1,
                            icon: "https://pixabay.com/images/download/x-9821327_1920.jpg",
                            name: 'tractor'
                        }
                    ]
                },
                isLoading: false
            })
        );
        // (useUpdateWishlist as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        const { getByTestId } = renderWithClient(<Home />);
        expect(getByTestId('vehicle_segment')).toBeTruthy()
    });

    // ----------------------- TEST 12 -------------
    it("should call all refetch functions on refresh", async () => {
        const mockRefetch = jest.fn().mockResolvedValue({});

        (useFetchCategory as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchBrand as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchBanners as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchAllProduct as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchRecentViewedProduct as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchCoupon as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch, data: { result: [{ _id: '3434' }] }, isLoading: false }));
        const { getByTestId } = renderWithClient(<Home />)
        const scrollView = getByTestId("refresh_control");

        //  Trigger RefreshControl manually
        await act(async () => {
            await scrollView.props.refreshControl.props.onRefresh();
        });

        //  Expect refetch to be called
        expect(mockRefetch).toHaveBeenCalled();
    });

    // ----------------------- TEST 12.2 -------------
    it("should call all refetch functions on UseFocusEffect", async () => {
        const mockRefetch = jest.fn().mockResolvedValue({});

        (useFetchCategory as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchBrand as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchBanners as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchAllProduct as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchRecentViewedProduct as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch }));
        (useFetchCoupon as jest.Mock).mockReturnValue(mockHook({ refetch: mockRefetch, data: { result: [{ _id: '3434' }] }, isLoading: false }));

        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            callback();
        });
        renderWithClient(<Home />)
        expect(mockRefetch).toHaveBeenCalled();
    });

    // ----------------------- TEST 13 -------------
    it("should call Share.open when share button pressed", async () => {
        const { getByTestId } = renderWithClient(<Home />);

        await act(async () => {
            fireEvent.press(getByTestId("share_button"));
        });

        expect(Share.open).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Share via',
                message: 'Check out this awesome app!',
            })
        );
    });

    // ----------------------- TEST 14 -------------
    it("should request permissions after delay", async () => {
        renderWithClient(<Home />);

        await act(async () => {
            jest.advanceTimersByTime(3000);
        });

        expect(requestNotificationPermission).toHaveBeenCalled();
        expect(requestSinglePermission).toHaveBeenCalled();
    });

    // ----------------------- TEST 15 -------------
    it("should handle when user denies permissions", async () => {

        // 🔹 Mock denied permissions
        (requestNotificationPermission as jest.Mock).mockResolvedValue(false);
        (requestSinglePermission as jest.Mock).mockResolvedValue(false);

        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        renderWithClient(<Home />);

        // 🔹 Fast-forward timer (3 seconds)
        await act(async () => {
            jest.advanceTimersByTime(3000);
        });

        // 🔹 Flush pending promises
        await act(async () => { });

        expect(requestNotificationPermission).toHaveBeenCalledTimes(1);

        // called for each permission in array
        expect(requestSinglePermission).toHaveBeenCalledTimes(3);

        expect(consoleSpy).toHaveBeenCalledWith(
            "❌ Some permissions were denied or blocked."
        );

        consoleSpy.mockRestore();
    });

});