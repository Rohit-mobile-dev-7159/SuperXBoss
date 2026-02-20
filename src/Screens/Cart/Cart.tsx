import React, {useCallback, useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import LottieView from "lottie-react-native";
import Animated, {FadeInDown, FadeIn, FadeInUp} from "react-native-reanimated";
import {colors, NavigationString, ImagePath} from "../../Constant/AllImports";
import {Header} from "../../Component/Index";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Image} from "react-native";
import MainStyle from "../../Styles/MainStyle";
import {
  useAddToCart,
  useFetchAllAddToCartProduct,
  useUpdateWishlist,
} from "../../Services/Main/Hooks";
import {useDispatch, useSelector} from "react-redux";
const {width, height} = Dimensions.get("window");
import {removeFromCart} from "../../Redux/Slices/AddToCartProduct";
import CouponModal from "./Component/CouponModal";
import Icon from "react-native-vector-icons/Ionicons";
import BulkDiscount from "../Home/Component/BulkDiscount";
import QuantitySelector from "../Product/Component/QuantitySelector";

interface BulkDiscount {
  count: number;
  discount: number;
  _id: string;
}

interface CartItem {
  customer_price: number;
  b2b_price: number;
  any_discount: number;
  bulk_discount: BulkDiscount[];
  tax: number;
  addToCartQty: number;
  point: number;
}

const Cart = () => {
  const Navigation: any = useNavigation();
  const Dispatch = useDispatch();
  const userData = useSelector((state: any) => state.token.token);
  const cart = useSelector((state: any) => state.cart.cartProducts);
  const {
    data,
    isLoading: fetchLoading,
    refetch,
    isPending,
  }: any = useFetchAllAddToCartProduct({});
  const [payload, setPayload] = useState({products: [], coupon: ""});
  const {mutate, isPending: isPending1} = useAddToCart();
  const {mutate: wishListMutate} = useUpdateWishlist();
  const [loadingItems, setLoadingItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const [cartAmmount, setCartAmmount] = useState({
    subtotal: 0,
    discount: 0,
    gst: 0,
    grandTotal: 0,
    point: 0,
  });
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [tempId, setTempId] = useState(null);
  const [reload, setReload] = useState(false);
  const renderItem = ({item, index}: any) => {
    let applicableDiscount = item.any_discount || 0;

    const sortedBulkDiscounts = [...(item.bulk_discount || [])].sort(
      (a, b) => b.count - a.count,
    );

    for (const bulkDiscount of sortedBulkDiscounts) {
      if (item.addToCartQty >= bulkDiscount.count) {
        if (bulkDiscount.discount > applicableDiscount) {
          applicableDiscount = bulkDiscount.discount;
        }
        break;
      }
    }

    const isLoading = loadingItems[item._id] || false;
    if (item._id === "add-more-item") {
      return (
        <TouchableOpacity
          testID="addMore"
          style={styles.addMoreCard}
          onPress={() => Navigation.navigate(NavigationString.Home as never)}
        >
          <View style={styles.addMoreContent}>
            <View style={styles.addMoreIcon}>
              <Text style={styles.addMorePlus}>+</Text>
            </View>
            <Text style={styles.addMoreText}>Add More Items</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.card}>
        <View style={styles.row}>
          <TouchableOpacity
            testID="productDetail"
            onPress={() =>
              Navigation.navigate(NavigationString.ProductDetail, {
                productId: item._id,
              })
            }
            style={styles.imageContainer}
          >
            <Image
              source={item?.images ? {uri: item.images[0]} : ImagePath.Default}
              style={styles.image}
            />
          </TouchableOpacity>

          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item?.name}
            </Text>
            <Text style={styles.desc}>{item?.brand?.name}</Text>

            <View style={styles.qtyRow}>
              <Text style={styles.qtyLabel}>Qty:</Text>
              <QuantitySelector
                quantity={item?.addToCartQty || 0}
                productId={item?._id || ""}
                itemStock={item?.item_stock}
                refetch={refetch}
                style={{
                  qtyControls: styles.qtyActionContainer,
                }}
              />
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹
                {userData?.type === "customer"
                  ? Math.round(
                      item?.customer_price -
                        (item?.customer_price * applicableDiscount) / 100,
                    )
                  : Math.round(
                      item?.b2b_price -
                        (item?.b2b_price * applicableDiscount) / 100,
                    )}
              </Text>

              {applicableDiscount > 0 && (
                <>
                  <Text style={styles.oldPrice}>
                    ₹
                    {userData?.type === "customer"
                      ? item?.customer_price
                      : item?.b2b_price}
                  </Text>
                  <Text style={styles.discount}>{applicableDiscount}% off</Text>
                </>
              )}
            </View>
            <Text
              style={{fontSize: 12, color: colors.Black, fontWeight: "500"}}
            >
              Item Stock : {item.item_stock}
            </Text>
            <BulkDiscount data={item?.bulk_discount[0]} point={item?.point} />
          </View>
        </View>

        <View style={styles.cardBottom}>
          <TouchableOpacity
            testID="wishlistBtn"
            style={styles.wishlistBtn}
            onPress={() => updateWishlist(item?._id)}
            disabled={isLoading}
          >
            {item?.wishList ? (
              <Text style={styles.bottomBtn}>Remove from Wishlist</Text>
            ) : (
              <Text style={styles.bottomBtn}>Add to Wishlist</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            testID="removeBtn"
            style={styles.removeBtn}
            onPress={() => {
              handleAddToCart(item?._id), setTempId(item?._id);
            }}
            disabled={isLoading}
          >
            {isPending1 && tempId === item?._id ? (
              <ActivityIndicator
                testID="activityLoader"
                color={colors.DBlue}
                size={"small"}
              />
            ) : (
              <Text style={[styles.bottomBtn, styles.removeText]}>Remove</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const handleAddToCart = (productId: any) => {
    mutate(
      {product: productId, qty: 0},
      {
        onSuccess: res => {
          if (res.success) {
            Dispatch(removeFromCart({productId}));
            refetch();
            // setReload(!reload)
          }
        },
      },
    );
  };

  const updateWishlist = (productId: any) => {
    wishListMutate(
      {product: productId},
      {
        onSuccess: res => {
          if (res.success) {
            refetch();
          }
        },
      },
    );
  };

  const calculateCartTotals = (items: CartItem[], userType: string) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;
    let totalPoint = 0;

    items.forEach((item: any) => {
      totalPoint = totalPoint + item.point * item.addToCartQty;
      const originalPrice =
        userType === "customer" ? item.customer_price : item.b2b_price;
      const quantity = item.addToCartQty || 0;

      // Calculate subtotal using original prices (without any discounts)
      subtotal += originalPrice * quantity;

      // Calculate applicable discount
      let applicableDiscount = item.any_discount || 0;

      const sortedBulkDiscounts = [...(item.bulk_discount || [])].sort(
        (a, b) => b.count - a.count,
      );

      for (const bulkDiscount of sortedBulkDiscounts) {
        if (quantity >= bulkDiscount.count) {
          if (bulkDiscount.discount > applicableDiscount) {
            applicableDiscount = bulkDiscount.discount;
          }
          break;
        }
      }

      // Calculate discount amount
      if (applicableDiscount > 0) {
        const originalItemTotal = originalPrice * quantity;
        const discountedItemTotal =
          originalPrice * (1 - applicableDiscount / 100) * quantity;
        totalDiscount += originalItemTotal - discountedItemTotal;
      }

      // Update payload
      setPayload((prev: any) => {
        const existingIndex = prev.products.findIndex(
          (p: any) => p.product_id === item?._id,
        );

        let updatedProducts;
        if (existingIndex >= 0) {
          updatedProducts = [...prev.products];
          updatedProducts[existingIndex] = {
            ...updatedProducts[existingIndex],
            qty: item?.addToCartQty,
          };
        } else {
          updatedProducts = [
            ...prev.products,
            {product_id: item?._id, qty: item?.addToCartQty},
          ];
        }

        return {
          ...prev,
          products: updatedProducts,
          coupon: appliedCoupon,
        };
      });

      // Calculate GST on discounted price
      const discountedPrice = originalPrice * (1 - applicableDiscount / 100);
      const itemTaxAmount =
        (discountedPrice * quantity * (item.tax || 0)) / 100;
      totalGst += itemTaxAmount;
    });

    const grandTotal = subtotal - totalDiscount + totalGst;

    setCartAmmount({
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(totalDiscount.toFixed(2)),
      gst: parseFloat(totalGst.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      point: totalPoint,
    });
  };

  useEffect(() => {
    if (data?.result && userData.type) {
      calculateCartTotals(data?.result, userData.type);
    }
  }, [data?.result, appliedCoupon, reload]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  return (
    <View testID="cart" style={styles.container}>
      <Header title={"My Cart"} />
      {fetchLoading ? (
        <View testID="loader" style={{flex: 1, backgroundColor: colors.White}}>
          <ActivityIndicator size="large" color={colors.DBlue} />
        </View>
      ) : !data?.result?.length ? (
        <View
          testID="emptyCart"
          style={{
            paddingHorizontal: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View entering={FadeIn.duration(800)}>
            <LottieView
              source={require("../../lottie/ShoppingCart.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </Animated.View>

          <Animated.Text
            style={styles.title}
            entering={FadeInDown.delay(300).duration(600)}
          >
            Uh Oh...!
          </Animated.Text>

          <Animated.Text
            style={styles.subtitle}
            entering={FadeInDown.delay(600).duration(600)}
          >
            You haven't added any any items. Start shopping to make your bag
            bloom
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(900).duration(600)}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Navigation.navigate(NavigationString.Home as never);
              }}
            >
              <Text style={styles.buttonText}>Start Shopping</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <View
          testID="dataWrapper"
          style={{flex: 1, backgroundColor: colors.White}}
        >
          <View style={{height: height / 2.4, backgroundColor: colors.LGray}}>
            <FlatList
              testID="list"
              data={
                data?.result
                  ? [...data.result, {title: "add More", _id: "add-more-item"}]
                  : []
              }
              renderItem={renderItem}
              keyExtractor={item => item?._id || item.title}
              contentContainerStyle={{paddingBottom: 0}}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View
            style={{
              backgroundColor: colors.LGray,
              paddingTop: 5,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              testID="couponApply"
              style={[
                {
                  marginHorizontal: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: colors.White,
                  elevation: 2,
                  zIndex: 10,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  borderRadius: 5,
                },
              ]}
              onPress={() => setIsCouponModalVisible(true)}
            >
              <View style={{flexDirection: "row", gap: 10}}>
                <Icon name="pricetag-outline" size={20} color={colors.DBlue} />
                {appliedCoupon?.code ? (
                  <Text
                    style={{color: "green", fontSize: 14, fontWeight: "600"}}
                  >
                    Coupon Applyed Succesfully ({appliedCoupon.code})
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: colors.Black,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Apple Coupon Code
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.Black,
                    fontWeight: "500",
                    marginLeft: 30,
                  }}
                >
                  View all coupons
                </Text>
                {appliedCoupon && (
                  <TouchableOpacity
                    testID="removeCoupon"
                    onPress={() => {
                      setAppliedCoupon(null);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.Red,
                        fontWeight: "500",
                        marginLeft: 30,
                      }}
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            <View style={{position: "absolute", bottom: -10}}>
              <ImagePath.DotLine />
            </View>
          </View>
          <View style={styles.orderContainer}>
            <View style={{padding: 12}}>
              <Text style={styles.sectionTitle}>Order Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Sub Total</Text>
                <Text style={styles.value}>₹{cartAmmount.subtotal}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Earn Point</Text>
                <Text style={[styles.value, {color: "green"}]}>
                  +{cartAmmount.point}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Discount</Text>
                <Text style={[styles.value, {color: "red"}]}>
                  -₹{cartAmmount.discount}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>GST</Text>
                <Text style={styles.value}>₹{cartAmmount.gst}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, {fontWeight: "bold"}]}>Total</Text>
                <Text style={[styles.value, {fontWeight: "bold"}]}>
                  ₹{cartAmmount.grandTotal}
                </Text>
              </View>
              <Text style={{fontSize: 12, color: "red"}}>
                Note : Your final amount will be shown at checkout, once all
                calculations are complete.
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={MainStyle.flexCloumn}>
                <Text style={[styles.label, {fontWeight: "bold"}]}>
                  Total Amount
                </Text>
                <Text style={styles.totalAmount}>
                  ₹
                  {(
                    cartAmmount.grandTotal - (appliedCoupon?.amount || 0)
                  ).toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.placeBtn}
                onPress={() => {
                  Navigation.navigate(NavigationString.PaymentScreen as never, {
                    payload: {...payload},
                    total: parseFloat(
                      (
                        cartAmmount?.grandTotal -
                        ((appliedCoupon?.amount && appliedCoupon?.amount) || 0)
                      )?.toFixed(2),
                    ),
                  });
                }}
              >
                <Text style={{color: "#fff", fontWeight: "bold"}}>
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <CouponModal
        testID="couponModal"
        visible={isCouponModalVisible}
        onClose={() => setIsCouponModalVisible(false)}
        onApplyCoupon={data => {
          setAppliedCoupon(data);
        }}
        appliedCoupon={appliedCoupon}
        cartTotal={cartAmmount.grandTotal}
      />
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginVertical: 8,
    height: "auto",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: "35%",
    aspectRatio: 1,
    padding: 4,
    backgroundColor: colors.White,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    resizeMode: "contain",
  },
  detailsContainer: {
    width: "65%",
    paddingLeft: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  desc: {
    color: "#666",
    fontSize: 13,
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  qtyLabel: {
    fontSize: 14,
    color: "#555",
  },
  qtyActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    width: 120,
    justifyContent: "space-between",
    height: 37,
    backgroundColor: colors.White,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.DBlue,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    marginLeft: 8,
    fontSize: 14,
  },
  discount: {
    color: "#E53935",
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 8,
  },
  wishlistBtn: {
    flex: 1,
    paddingVertical: 8,
  },
  removeBtn: {
    flex: 1,
    paddingVertical: 8,
  },
  bottomBtn: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.DBlue,
    textAlign: "center",
  },
  removeText: {
    color: "#E53935",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#eee",
  },
  addMoreCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.DBlue,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addMoreContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addMoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.DBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addMorePlus: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  addMoreText: {
    color: colors.DBlue,
    fontSize: 16,
    fontWeight: "600",
  },
  orderContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 15,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: "#333",
  },
  value: {
    color: "#000",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.2,
    borderColor: colors.LGray,
    elevation: 1,
    padding: 10,
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 18,
  },
  placeBtn: {
    backgroundColor: colors.DBlue,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  animation: {
    width: width * 0.75,
    height: width * 0.75,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: colors.DBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
