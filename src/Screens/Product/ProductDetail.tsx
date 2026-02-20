import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import {Header} from '../../Component/Index';
import {colors, ImagePath, NavigationString} from '../../Constant/AllImports';
import {
  useAddToCart,
  useFetchProductDetail,
  useRecentViewedProduct,
} from '../../Services/Main/Hooks';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  SlideInLeft,
  SlideInRight,
  BounceIn,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  addToCart,
  removeFromCart,
  setQuantity,
} from '../../Redux/Slices/AddToCartProduct';
import {useNavigation} from '@react-navigation/native';
import Share from 'react-native-share';
import ImageViewer from 'react-native-image-zoom-viewer';
import LottieLoader from '../../Component/LottieLoader';
import Video from 'react-native-video';

const ProductDetail = ({route}: any) => {
  const {productId} = route.params;
  const Navigation: any = useNavigation();
  const {data, isLoading} = useFetchProductDetail({_id: productId || ''});
  const userData = useSelector((state: any) => state.token.token);
  const {mutate: recentMutate} = useRecentViewedProduct();
  const [loading, setLoading] = useState(false);
  const product = data?._payload || {};
  const formattedImages =
    product?.images?.map((image: string) => ({url: image})) || [];
  const scaleValue = useSharedValue(1);
  const cart = useSelector(
    (state: {cart: {cartProducts: Record<string, {qty: number}>}}) =>
      state.cart.cartProducts,
  );
  const {mutate} = useAddToCart();
  const dispatch = useDispatch();
  const currentQty = cart[productId]?.qty || 0;
  const isOutOfStock = product?.item_stock <= 0;
  const minQty = product?.min_qty || 1;
  const [showPreview, setShowPreview] = useState(false);
  const [localQty, setLocalQty] = useState(currentQty);
  const shouldShowAddButton = currentQty < minQty || currentQty === 0;
  // Update local quantity when cart changes
  useEffect(() => {
    setLocalQty(currentQty);
  }, [currentQty]);

  const handleCartUpdate = (newQty: number) => {
    // If quantity is below minimum, remove from cart
    if (newQty < minQty) {
      setLoading(true);
      mutate(
        {product: productId, qty: 0},
        {
          onSuccess: res => {
            if (res.success) {
              dispatch(removeFromCart({productId}));
            }
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
          },
        },
      );
      return;
    }

    // Prevent quantities more than stock
    const validatedQty = Math.min(newQty, product?.item_stock);

    setLoading(true);
    mutate(
      {product: productId, qty: validatedQty},
      {
        onSuccess: res => {
          if (res.success) {
            if (validatedQty === 0) {
              dispatch(removeFromCart({productId}));
            } else if (!cart[productId]) {
              dispatch(addToCart({productId, qty: validatedQty}));
            } else {
              dispatch(setQuantity({productId, qty: validatedQty}));
            }
          }
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      },
    );
  };

  const handleAddToCart = () => {
    scaleValue.value = withSpring(0.95, {}, () => {
      scaleValue.value = withSpring(1.05, {}, () => {
        scaleValue.value = withSpring(1);
      });
    });
    handleCartUpdate(minQty);
  };

  const handleIncrease = () => handleCartUpdate(localQty + 1);
  const handleDecrease = () => handleCartUpdate(localQty - 1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}],
    };
  });

  const handleShare = () => {
    const shareOptions = {
      title: 'Share via',
      message: 'Check out this awesome app!',
      url: 'https://reactnative.dev/docs/share', // Demo URL
      subject: 'App Recommendation', // for email
    };

    Share.open(shareOptions)
      .then(res => {
        console.log('Share successful:', res);
      })
      .catch(err => {
        console.log('Share failed:', err);
      });
  };

  const handleRecentViwed = async () => {
    if (productId) {
      recentMutate({product: productId});
    }
  };

  useEffect(() => {
    handleRecentViwed();
  }, [productId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.DBlue} />
      </SafeAreaView>
    );
  }

  if (!product.status) {
    return (
      <View style={styles.emptyContainer}>
        <LottieLoader url={require('../../lottie/Inventory.json')} />
      </View>
    );
  }

  // Determine if we should show the Add to Cart button

  return (
    <View style={styles.safeArea}>
      <Header title="Product Detail" isIcons={true} />
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Image Swiper */}
        <Animated.View
          style={styles.swiperContainer}
          entering={FadeIn.duration(500)}
        >
          <Swiper
            loop={false}
            showsPagination={true}
            dotColor="#ccc"
            activeDotColor={colors.DBlue}
            paginationStyle={{bottom: -20}}
          >
            {[
              ...(product?.images || []),
              ...(product?.video ? [product.video] : []),
            ].map((uri: string, index: number) => {
              const isMp4WithParams = (value: any): boolean => {
                if (!value) {
                  return false;
                }
                const str = String(value).trim();
                return /\.mp4(\?|#|$)/i.test(str);
              };

              const isVideo = isMp4WithParams(uri);

              return (
                <Animated.View
                  style={styles.slide}
                  key={index}
                  entering={FadeIn.delay(index * 100)}
                >
                  {isVideo ? (
                    <Video
                      source={{uri}}
                      style={{width: '100%', height: '100%'}}
                      controls={true}
                      paused={true}
                      resizeMode="contain"
                      repeat={false}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowPreview(true)}
                      style={styles.imageWrapper}
                      activeOpacity={1}
                    >
                      <Image
                        source={uri ? {uri} : ImagePath.Default}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              );
            })}
          </Swiper>
        </Animated.View>

        {/* Product Details */}
        <Animated.View
          style={styles.detailCard}
          entering={FadeInUp.duration(600).delay(200)}
        >
          <Animated.View entering={SlideInLeft.duration(500)}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.productSubTitle}>{product?.brand?.name}</Text>
          </Animated.View>

          {/* Points Segment */}
          {product?.point && (
            <Animated.View
              style={styles.pointsContainer}
              entering={BounceIn.duration(800).delay(300)}
            >
              <Text style={styles.pointsText}>Earn {product.point} points</Text>
            </Animated.View>
          )}

          <Animated.View
            style={styles.priceRow}
            entering={SlideInRight.duration(500).delay(400)}
          >
            <Text style={styles.price}>
              ₹
              {userData?.type === 'customer'
                ? product?.discount_customer_price
                : product?.discount_b2b_price}
            </Text>
            <Text style={styles.strikePrice}>
              ₹
              {userData?.type === 'customer'
                ? product?.customer_price
                : product?.b2b_price}
            </Text>
            <Text style={styles.discountText}>{product.any_discount}% OFF</Text>
          </Animated.View>

          {/* Unit Information */}
          {product?.unit && (
            <Animated.View
              style={styles.unitContainer}
              entering={FadeInUp.duration(500).delay(450)}
            >
              <Icon
                name="layers"
                size={16}
                color="#4A5568"
                style={styles.unitIcon}
              />
              <Text style={styles.unitText}>
                Unit: <Text style={styles.unitValue}>{product.unit.name}</Text>
                {product.unit.set && (
                  <Text>
                    {' '}
                    •{' '}
                    <Text style={styles.unitValue}>{product.unit.set} set</Text>
                  </Text>
                )}
                {product.unit.pc && (
                  <Text>
                    {' '}
                    •{' '}
                    <Text style={styles.unitValue}>{product.unit.pc} pcs</Text>
                  </Text>
                )}
              </Text>
            </Animated.View>
          )}

          {product?.hsn_code && (
            <Animated.View
              style={styles.unitContainer}
              entering={FadeInUp.duration(500).delay(450)}
            >
              <Icon
                name="layers"
                size={16}
                color="#4A5568"
                style={styles.unitIcon}
              />
              <Text style={styles.unitText}>
                HSN Code:{' '}
                <Text style={styles.unitValue}>{product.hsn_code}</Text>
              </Text>
            </Animated.View>
          )}
          {product?.sku_id && (
            <Animated.View
              style={styles.unitContainer}
              entering={FadeInUp.duration(500).delay(450)}
            >
              <Icon
                name="layers"
                size={16}
                color="#4A5568"
                style={styles.unitIcon}
              />
              <Text style={styles.unitText}>
                SKU Id: <Text style={styles.unitValue}>{product.sku_id}</Text>
              </Text>
            </Animated.View>
          )}
          {product?.part_no && (
            <Animated.View
              style={styles.unitContainer}
              entering={FadeInUp.duration(500).delay(450)}
            >
              <Icon
                name="layers"
                size={16}
                color="#4A5568"
                style={styles.unitIcon}
              />
              <Text style={styles.unitText}>
                Part No: <Text style={styles.unitValue}>{product.part_no}</Text>
              </Text>
            </Animated.View>
          )}
          {product?.tax && (
            <Animated.View
              style={styles.unitContainer}
              entering={FadeInUp.duration(500).delay(450)}
            >
              <Icon
                name="layers"
                size={16}
                color="#4A5568"
                style={styles.unitIcon}
              />
              <Text style={styles.unitText}>
                Tax: <Text style={styles.unitValue}>{product.tax}%</Text>
              </Text>
            </Animated.View>
          )}
          {/* Minimum Quantity */}
          <Animated.Text
            style={styles.minQtyText}
            entering={FadeInUp.duration(500).delay(500)}
          >
            Minimum Order Quantity: {minQty}
          </Animated.Text>

          {/* Bulk Discount */}
          {product?.bulk_discount?.length > 0 && (
            <Animated.View
              style={styles.bulkDiscountContainer}
              entering={FadeInUp.duration(500).delay(550)}
            >
              <Text style={styles.bulkDiscountTitle}>
                Bulk Discount Offers:
              </Text>
              {product.bulk_discount.map((offer: any, index: number) => (
                <Animated.Text
                  key={index}
                  style={styles.bulkDiscountText}
                  entering={FadeInUp.duration(500).delay(600 + index * 50)}
                >
                  Buy {offer.count} items - Get {offer.discount}% discount
                </Animated.Text>
              ))}
            </Animated.View>
          )}

          {/* Cart Quantity Controls */}
          <Animated.View
            style={styles.quantityContainer}
            entering={FadeInUp.duration(500).delay(800)}
          >
            {isOutOfStock ? (
              <TouchableOpacity
                style={[styles.addToCartButton, styles.outOfStockButton]}
                disabled={true}
              >
                <Text style={styles.addToCartButtonText}>Out of Stock</Text>
              </TouchableOpacity>
            ) : shouldShowAddButton ? (
              <Animated.View
                style={[styles.addToCartContainer, animatedButtonStyle]}
                entering={FadeInUp.duration(500).delay(100)}
              >
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View style={styles.cartQuantityControls}>
                <TouchableOpacity
                  testID="decrease"
                  onPress={handleDecrease}
                  style={[styles.cartQuantityButton]}
                  // disabled={loading || currentQty <= minQty}
                >
                  <Text style={styles.cartQuantityButtonText}>-</Text>
                </TouchableOpacity>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.DBlue}
                    style={styles.cartQuantityValue}
                  />
                ) : (
                  <Text style={styles.cartQuantityValue}>{currentQty}</Text>
                )}
                <TouchableOpacity
                  testID="increase"
                  onPress={handleIncrease}
                  style={[
                    styles.cartQuantityButton,
                    (loading || currentQty >= product?.item_stock) &&
                      styles.disabledButton,
                  ]}
                  disabled={loading || currentQty >= product?.item_stock}
                >
                  <Text style={styles.cartQuantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {/* Segment Types */}
        {product?.segment_type?.length > 0 && (
          <Animated.View
            style={styles.sectionContainer}
            entering={FadeInUp.duration(500).delay(1000)}
          >
            <Text style={styles.sectionTitle}>Product Segments</Text>
            <View style={styles.segmentContainer}>
              {product.segment_type.map((segment: any, index: number) => (
                <Animated.View
                  key={segment._id}
                  style={styles.segmentPill}
                  entering={ZoomIn.duration(500).delay(1100 + index * 100)}
                >
                  <Text style={styles.segmentText}>{segment.name}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Product Description */}
        <Animated.View
          style={styles.sectionContainer}
          entering={FadeInUp.duration(500).delay(1400)}
        >
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.descriptionText}>{product?.description}</Text>
        </Animated.View>

        {/* Invite Friends */}
        <Animated.View
          style={styles.sectionContainer}
          entering={FadeInUp.duration(500).delay(1500)}
        >
          <Text style={styles.sectionTitle}>Invite Friends & Earn</Text>
          <View style={styles.inviteRow}>
            <Text style={styles.inviteText}>
              Get upto 100 reward points for every friend you refer
            </Text>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
              }}
              style={styles.inviteImage}
            />
          </View>
          <TouchableOpacity style={styles.inviteBtn} onPress={handleShare}>
            <Text style={styles.inviteBtnText}>Invite Now →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      {/* Button */}
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: colors.White,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            Navigation.navigate(NavigationString.Cart);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Icon name="shopping-cart" size={20} color="#fff" />
            <Text style={styles.buttonText}> Go To Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
      {formattedImages.length > 0 && (
        <Modal
          visible={showPreview}
          onRequestClose={() => {
            setShowPreview(false);
          }}
        >
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5'}}>
            <ImageViewer imageUrls={formattedImages || []} />
          </View>
        </Modal>
      )}
    </View>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  emptyContainer: {
    height: Dimensions.get('screen').height - 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.DBlue,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFD166', // Yellow color
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainer: {
    height: 300,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.White,
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailCard: {
    marginTop: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  productSubTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  strikePrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 14,
    color: 'red',
  },
  pointsContainer: {
    backgroundColor: '#FFF5E6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  pointsText: {
    color: '#FF9500',
    fontWeight: '600',
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  unitIcon: {
    marginRight: 8,
  },
  unitText: {
    fontSize: 14,
    color: '#718096',
  },
  unitValue: {
    color: '#2D3748',
    fontWeight: '500',
  },
  minQtyText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  bulkDiscountContainer: {
    marginBottom: 12,
    backgroundColor: '#F0F8FF',
    padding: 10,
    borderRadius: 6,
  },
  bulkDiscountTitle: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#0066CC',
  },
  bulkDiscountText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 3,
  },
  couponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eef7ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  couponText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  couponBox: {
    backgroundColor: '#cde5fd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  couponCode: {
    color: colors.DBlue,
    fontWeight: 'bold',
  },
  quantityContainer: {},
  cartQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.DBlue,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  cartQuantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.DBlue,
  },
  cartQuantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartQuantityValue: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    color: colors.Black,
  },
  addToCartContainer: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  addToCartButton: {
    backgroundColor: colors.DBlue,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: colors.DBlue,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outOfStockButton: {
    backgroundColor: colors.LGray,
  },
  segmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  segmentPill: {
    backgroundColor: '#E1F5FE',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  segmentText: {
    color: '#0288D1',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inviteText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  inviteImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  inviteBtn: {
    alignSelf: 'flex-start',
  },
  inviteBtnText: {
    color: colors.DBlue,
    fontWeight: '600',
  },
});

export default ProductDetail;
