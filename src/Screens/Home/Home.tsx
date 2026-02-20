import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {colors, ImagePath, NavigationString} from "../../Constant/AllImports";
import Swiper from "react-native-swiper";
import BrandSlider from "./Component/BrandSlider";
import CategorySlider from "./Component/CategorySlider";
import Icon from "react-native-vector-icons/Feather";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import SearchButton from "./Component/SearchButton";
import MainStyle from "../../Styles/MainStyle";
import TrendingProductsSlider from "./Component/TrendingProductsSlider";
import NewArrivalsCard from "./Component/NewArrivalsCard";
import VehicleSegmentCard from "./Component/VehicleSegmentCard";
import StatsCard from "./Component/StatsCard";
import RecentProducts from "./Component/RecentProducts";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {
  useFetchAllProduct,
  useFetchBanners,
  useFetchBrand,
  useFetchCategory,
  useFetchCoupon,
  useFetchRating,
  useFetchRecentViewedProduct,
  useFetchVehicleSegment,
} from "../../Services/Main/Hooks";
import LinearGradient from "react-native-linear-gradient";
import GreetingWithPoints from "./Component/GreetingWithPoints";
import {Badge} from "react-native-paper";
import {useSelector} from "react-redux";
const {height} = Dimensions.get("window");
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Share from "react-native-share";
import {
  requestNotificationPermission,
  requestSinglePermission,
} from "../../Permission";
import Coupon from "./Component/Coupon";
import ContactSection from "./Component/ContactSection";
const Home = () => {
  const Navigation: any = useNavigation();
  const scrollRef = useRef<ScrollView | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const cart = useSelector((state: any) => state.cart.cartProducts);
  // Calculate total items in cart (sum of all quantities)
  const cartCount = Object.keys(cart)?.length;
  const insets = useSafeAreaInsets();
  // API Calls
  const {
    data: categories,
    isLoading: loadingCategories,
    refetch: refetchCategories,
  }: any = useFetchCategory({active: true, page: 1, page_size: 10});
  const {data: vehicleBrand, refetch: refetchVehicleBrand}: any = useFetchBrand(
    {active: true, type: "Vehicle", page: 1, page_size: 10},
  );
  const {data: spareBrand, refetch: refetchSpareBrand}: any = useFetchBrand({
    active: true,
    type: "Spare Parts",
    page: 1,
    page_size: 10,
  });
  const {
    data: banners,
    isLoading: loadingBanners,
    refetch: refetchBanners,
  }: any = useFetchBanners({active: true});
  const {data: segments}: any = useFetchVehicleSegment({status: true});
  const {data: trendingProduct, refetch: refetchTrending}: any =
    useFetchAllProduct({trend_part: true, page: 1, page_size: 15});
  const {data: PopProduct}: any = useFetchAllProduct({
    pop_item: true,
    page: 1,
    page_size: 15,
  });
  const {data: newArrivle, refetch: refetchArrival}: any = useFetchAllProduct({
    new_arrival: true,
    page: 1,
    page_size: 15,
  });
  const {data: recentProduct, refetch: refetchRecentProduct}: any =
    useFetchRecentViewedProduct({page: 1, page_size: 10});
  const {data: couponData, refetch}: any = useFetchCoupon({page_size: 10});
  const {data: rating}: any = useFetchRating();

  const isLoading = loadingCategories || loadingBanners;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      focusRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const focusRefresh = async () => {
    await Promise.all([
      refetchCategories(),
      refetchVehicleBrand(),
      refetchSpareBrand(),
      refetchBanners(),
      refetchTrending(),
      refetchArrival(),
      refetchRecentProduct(),
      refetch(),
    ]);
  };

  const handleShare = () => {
    const shareOptions = {
      title: "Share via",
      message: "Check out this awesome app!",
      url: "https://reactnative.dev/docs/share", // Demo URL
      subject: "App Recommendation", // for email
    };

    Share.open(shareOptions)
      .then(res => {
        console.log("Share successful:", res);
      })
      .catch(() => {
        // console.log('Share failed:', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      focusRefresh();
    }, []),
  );

  const permissionsToRequest = [
    "CAMERA",
    "READ_MEDIA_IMAGES",
    "ACCESS_FINE_LOCATION",
  ] as const;

  // Request permissions (after slight delay)
  useEffect(() => {
    const requestPermissionsSequentially = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      let allGranted = true;
      const notificationGranted = await requestNotificationPermission();

      for (const perm of permissionsToRequest) {
        const granted = await requestSinglePermission(perm);
        if (!granted) {
          allGranted = false;
        }
      }

      if (!notificationGranted) {
        allGranted = false;
      }

      if (allGranted) {
        console.log("✅ All permissions granted.");
      } else {
        console.log("❌ Some permissions were denied or blocked.");
      }
    };
    requestPermissionsSequentially();
  }, []);

  return (
    <View testID="Home" style={{flex: 1, backgroundColor: colors.White}}>
      {/* Search Section */}
      <LinearGradient
        colors={["rgba(27, 75, 102, 0.8)", "rgba(76, 115, 138, 0.2)"]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{paddingHorizontal: 10, paddingTop: insets.top}}
      >
        <View style={[MainStyle.flexBetween, {backgroundColor: "transparent"}]}>
          <SearchButton
            onPress={() => {
              Navigation.navigate(
                NavigationString.ProductSearchScreen as never,
              );
            }}
          />
          <View
            style={[
              MainStyle.flexBetween,
              {width: "40%", justifyContent: "space-around"},
            ]}
          >
            <TouchableOpacity
              testID="filter"
              onPress={() => {
                Navigation.navigate(NavigationString.FilterPage);
              }}
            >
              <Icon3 name="filter" color={colors.Black} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="help"
              onPress={() => {
                Navigation.navigate(NavigationString.HelpSupport);
              }}
            >
              <Icon3 name="headset" color={colors.Black} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="wishlist"
              onPress={() => {
                Navigation.navigate(NavigationString.WishListProduct);
              }}
            >
              <Icon2 name="heart-outline" size={25} color={colors.Black} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="cart"
              onPress={() =>
                Navigation.navigate(NavigationString.Cart as never)
              }
            >
              <Icon name="shopping-cart" size={25} color={colors.Black} />
              {cartCount > 0 && (
                <Badge style={styles.badge} size={20}>
                  {cartCount}
                </Badge>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {isLoading ? (
        // <Skelton />
        <View testID="skelton" />
      ) : (
        <View testID="hero" style={{flex: 1}}>
          {/* <FilterButton /> */}
          <ScrollView
            testID="refresh_control"
            ref={scrollRef}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.DBlue]}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Contact Button */}

              {/* Banner Top */}
              {banners?._payload?.top?.length > 0 && (
                <View
                  style={[
                    styles.bannerContainer,
                    {
                      height:
                        banners?._payload?.top?.length > 1
                          ? height * 0.25
                          : height * 0.25,
                    },
                  ]}
                >
                  <Swiper
                    testID="swiper_1"
                    autoplay
                    loop
                    removeClippedSubviews={false}
                    autoplayTimeout={3}
                    showsPagination
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    paginationStyle={{bottom: -20, zIndex: 100}}
                  >
                    {banners._payload.top.map((slide: any) => (
                      <TouchableOpacity
                        testID={`item_${slide.product._id}`}
                        activeOpacity={0.8}
                        key={slide.key}
                        style={styles.slide}
                        onPress={() =>
                          Navigation.navigate(NavigationString.ProductDetail, {
                            productId: slide.product._id,
                          })
                        }
                      >
                        <Image
                          source={
                            slide.image ? {uri: slide.image} : ImagePath.Default
                          }
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                </View>
              )}

              <GreetingWithPoints />

              {/* Vehicle Brands */}
              {vehicleBrand?.result?.length && (
                <BrandSlider
                  data={vehicleBrand?.result}
                  title="Shop By Vehicle Brands"
                  type="Vehicle"
                />
              )}

              {/* Categories */}
              {categories?.result?.length > 0 && (
                <CategorySlider data={categories?.result} />
              )}

              {/* Coupon */}
              {couponData?.result.length > 0 && (
                <Coupon coupons={couponData?.result} />
              )}

              {/* Spare Brands */}
              {spareBrand?.result?.length > 0 && (
                <BrandSlider
                  data={spareBrand.result}
                  title="Shop By Spare Brands"
                  type="Spare Parts"
                />
              )}

              {/* Banner Mid */}
              {banners?._payload?.mid?.length > 0 && (
                <View
                  style={[
                    styles.bannerContainer,
                    {
                      height:
                        banners?._payload?.mid?.length > 1
                          ? height * 0.25
                          : height * 0.25,
                    },
                  ]}
                >
                  <Swiper
                    testID="swiper_2"
                    autoplay
                    loop
                    removeClippedSubviews={false}
                    autoplayTimeout={3}
                    showsPagination
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    paginationStyle={{bottom: -20, zIndex: 100}}
                  >
                    {banners._payload.mid.map((slide: any) => (
                      <TouchableOpacity
                        testID={`item_${slide.product._id}`}
                        activeOpacity={0.8}
                        key={slide.key}
                        style={styles.slide}
                        onPress={() =>
                          Navigation.navigate(NavigationString.ProductDetail, {
                            productId: slide.product._id,
                          })
                        }
                      >
                        <Image
                          source={
                            slide.image ? {uri: slide.image} : ImagePath.Default
                          }
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                </View>
              )}

              {/* Trending Products */}
              {trendingProduct?.result?.length > 0 && (
                <TrendingProductsSlider data={trendingProduct?.result} />
              )}

              {/* New Arrivals */}
              {newArrivle?.result?.length > 0 && (
                <NewArrivalsCard data={newArrivle?.result} />
              )}

              {/* PopItem Products */}
              {trendingProduct?.result?.length > 0 && (
                <TrendingProductsSlider
                  data={PopProduct?.result}
                  label={"Popular Product"}
                />
              )}

              {/* Banner Bottom */}
              {banners?._payload?.bottom?.length > 0 && (
                <View
                  style={[
                    styles.bannerContainer,
                    {
                      height:
                        banners?._payload?.top?.length > 1
                          ? height * 0.25
                          : height * 0.25,
                    },
                  ]}
                >
                  <Swiper
                    testID="swiper_3"
                    autoplay
                    loop
                    removeClippedSubviews={false}
                    autoplayTimeout={3}
                    showsPagination
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    paginationStyle={{bottom: -20, zIndex: 100}}
                  >
                    {banners._payload.bottom.map((slide: any) => (
                      <TouchableOpacity
                        testID={`item_${slide.product._id}`}
                        activeOpacity={0.8}
                        key={slide.key}
                        style={styles.slide}
                        onPress={() =>
                          Navigation.navigate(NavigationString.ProductDetail, {
                            productId: slide.product._id,
                          })
                        }
                      >
                        <Image
                          source={
                            slide.image ? {uri: slide.image} : ImagePath.Default
                          }
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                </View>
              )}

              {/* Recent Products */}
              {recentProduct?._payload?.length && (
                <RecentProducts data={recentProduct?._payload} />
              )}

              {/* Vehicle Segment */}
              {segments?.result?.length > 0 && (
                <VehicleSegmentCard data={segments?.result} />
              )}

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Invite Friends & Earn</Text>
                <View style={styles.inviteRow}>
                  <Text style={styles.inviteText}>
                    Get upto 100 reward points for every friend you refer
                  </Text>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
                    }}
                    style={styles.inviteImage}
                  />
                </View>
                <TouchableOpacity
                  testID="share_button"
                  style={styles.inviteBtn}
                  onPress={handleShare}
                >
                  <Text style={styles.inviteBtnText}>Invite Now →</Text>
                </TouchableOpacity>
              </View>

              {/* Stats */}
              <StatsCard data={rating?._payload} />

              {/* Contact Support */}
              <ContactSection />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  sectionContainer: {
    margin: 10,
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: colors.DGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inviteText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },
  inviteImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  inviteBtn: {
    alignSelf: "flex-start",
  },
  inviteBtnText: {
    color: colors.DBlue,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: colors.LGray,
  },
  bannerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  slide: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  dot: {
    backgroundColor: "#ccc",
    width: 10,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.DBlue,
    width: 15,
    height: 7,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: colors.DBlue, // Use your theme color
    color: "white",
  },
});
