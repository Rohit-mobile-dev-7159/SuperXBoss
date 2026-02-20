import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
  Layout,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Header} from "../../Component/Index";
import colors from "../../Style/Color";
import {CommonActions, useNavigation} from "@react-navigation/native";
import NavigationString from "../../Constant/NavigationString";
import {useFetchAllOrder} from "../../Services/Main/Hooks";

const OrderHistoryDetail = ({route}: any) => {
  const {_id, goHome = false} = route.params;
  const [order, setOrder]: any = useState({});
  const {data, isLoading}: any = useFetchAllOrder({orderId: _id});

  const navigation = useNavigation();
  useEffect(() => {
    if (data?.result?.length) {
      setOrder(data.result[0]);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return ["#4CAF50", "#8BC34A"];
      case "shipped":
        return ["#2196F3", "#03A9F4"];
      case "processing":
        return ["#FF9800", "#FFC107"];
      case "cancelled":
        return ["#F44336", "#E91E63"];
      default:
        return ["#9E9E9E", "#607D8B"];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderItem = ({item, index}: any) => (
    <Animated.View
      testID={`item_${item._id}`}
      style={styles.itemCard}
      entering={SlideInRight.delay(100 + index * 50)}
      layout={Layout.springify()}
    >
      <View style={styles.itemImagePlaceholder}>
        <Text style={styles.itemImageText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>
          ₹{item.effectiveUnitPrice.toFixed(2)} × {item.qty}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        ₹{(item.effectiveUnitPrice * item.qty).toFixed(2)}
      </Text>
    </Animated.View>
  );

  const [statusColorStart, statusColorEnd] = getStatusColor(
    order?.status || "",
  );

  useEffect(() => {
    const backAction = () => {
      if (goHome) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: NavigationString.Home}],
          }),
        );
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} testID="loader">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}} testID="order_history_detail">
      <Header title={"Order Details"} isIcons={true} arrow={true} />
      {!order?._id ? null : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View style={styles.header} entering={FadeIn.duration(300)}>
            <Text style={styles.orderNumber}>#{order.orderNo}</Text>
            <Text style={styles.orderDate}>
              Placed on {formatDate(order.createdAt)}
            </Text>
          </Animated.View>

          {/* Status Card */}
          <Animated.View
            style={styles.statusCard}
            entering={FadeIn.duration(400)}
          >
            <LinearGradient
              colors={[statusColorStart, statusColorEnd]}
              style={styles.statusGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusIcon}>
                  {order?.status?.toLowerCase() === "delivered" && (
                    <Icon name="check-circle" size={24} color="white" />
                  )}
                  {order?.status?.toLowerCase() === "shipped" && (
                    <Icon name="local-shipping" size={24} color="white" />
                  )}
                  {order?.status?.toLowerCase() === "processing" && (
                    <Ionicons name="time-outline" size={24} color="white" />
                  )}
                  {order?.status?.toLowerCase() === "cancelled" && (
                    <Icon name="cancel" size={24} color="white" />
                  )}
                </View>
                <View>
                  <Text style={styles.statusTitle}>
                    ORDER {order?.status?.toUpperCase()}
                  </Text>
                  {order?.status?.toLowerCase() === "delivered" &&
                    order.updatedAt && (
                      <Text style={styles.deliveryDate}>
                        Delivered on {formatDate(order.updatedAt)}
                      </Text>
                    )}
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Payment Method Card */}
          <Animated.View
            style={styles.card}
            entering={FadeInUp.delay(150).springify()}
          >
            <View style={styles.cardHeader}>
              <Feather name="credit-card" size={18} color="#6C63FF" />
              <Text style={styles.cardTitle}>Payment Method</Text>
            </View>
            <View style={styles.paymentContent}>
              <View style={styles.paymentIcon}>
                <FontAwesome name="credit-card" size={18} color="#1A1F71" />
              </View>
              <Text style={styles.paymentText}>
                {order.payment.method
                  ? `${order.payment.method.toUpperCase()} •••• ${
                      order.payment.last4 || "****"
                    }`
                  : "Not specified"}
              </Text>
            </View>
          </Animated.View>

          {/* Order Items Card */}
          <Animated.View
            style={styles.card}
            entering={FadeInUp.delay(200).springify()}
          >
            <View style={styles.cardHeader}>
              <Feather name="package" size={18} color="#6C63FF" />
              <Text style={styles.cardTitle}>
                Order Items ({order.items.length})
              </Text>
            </View>
            <FlatList
              data={order.items}
              renderItem={renderItem}
              keyExtractor={item => item.product}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />
          </Animated.View>

          {/* Order Summary Card */}
          <Animated.View
            style={styles.summaryCard}
            entering={FadeInUp.delay(250).springify()}
          >
            <View style={styles.cardHeader}>
              <Feather name="file-text" size={18} color="#6C63FF" />
              <Text style={styles.cardTitle}>Order Summary</Text>
            </View>

            {/* Charges */}
            <View style={styles.summaryGroup}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>
                  ₹{order.summary.taxTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ₹{order.summary.subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Charge</Text>
                <Text style={styles.summaryValue}>
                  ₹{order.shippingChargesAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Charge</Text>
                <Text style={styles.summaryValue}>
                  ₹{order.platformCharge.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Deductions */}
            <View style={styles.summaryGroup}>
              {order.walletAmountUse > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Wallet Amount</Text>
                  <Text style={[styles.summaryValue, {color: colors.Red}]}>
                    -₹{order.walletAmountUse.toFixed(2)}
                  </Text>
                </View>
              )}
              {order.totalDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={[styles.summaryValue, {color: "#4CAF50"}]}>
                    -₹{order.totalDiscount.toFixed(2)}
                  </Text>
                </View>
              )}
              {order.coupon_applied?.code && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Coupon ({order.coupon_applied.code})
                  </Text>
                  <Text style={[styles.summaryValue, {color: "#4CAF50"}]}>
                    -₹{order.coupon_applied.amount?.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₹{order.summary.grandTotal.toFixed(2)}
              </Text>
            </View>
          </Animated.View>

          {/* Additional Info */}
          <Animated.View
            style={styles.card}
            entering={FadeInUp.delay(300).springify()}
          >
            <View style={styles.cardHeader}>
              <Feather name="info" size={18} color="#6C63FF" />
              <Text style={styles.cardTitle}>Additional Information</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points Earned</Text>
              <Text style={styles.summaryValue}>+{order.earnPoints}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Status</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      order.payment.status === "paid" ? "#4CAF50" : "#FF9800",
                  },
                ]}
              >
                {order.payment.status.toUpperCase() || "pending"}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.White},
  loadingContainer: {flex: 1, justifyContent: "center", alignItems: "center"},
  scrollContent: {paddingHorizontal: 15, paddingBottom: 40},
  header: {marginBottom: 10, marginTop: 10},
  orderNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderDate: {fontSize: 15, color: "#666"},
  statusCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statusGradient: {padding: 20},
  statusContent: {flexDirection: "row", alignItems: "center"},
  statusIcon: {marginRight: 16},
  statusTitle: {fontSize: 18, fontWeight: "700", color: "white"},
  deliveryDate: {fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4},
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryGroup: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
  },
  cardHeader: {flexDirection: "row", alignItems: "center", marginBottom: 16},
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentIcon: {
    width: 40,
    height: 24,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentText: {fontSize: 15, color: "#333"},
  itemCard: {flexDirection: "row", alignItems: "center", paddingVertical: 12},
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImageText: {color: "white", fontSize: 20, fontWeight: "bold"},
  itemDetails: {flex: 1, marginLeft: 16, marginRight: 8},
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemDescription: {fontSize: 13, color: "#666", marginBottom: 6},
  itemPrice: {fontSize: 13, color: "#666"},
  itemTotal: {fontSize: 15, fontWeight: "700", color: "#1A1A1A"},
  itemSeparator: {height: 1, backgroundColor: "#F0F0F0", marginVertical: 8},
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {fontSize: 15, color: "#666"},
  summaryValue: {fontSize: 15, color: "#333"},
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {fontSize: 16, fontWeight: "700", color: "#1A1A1A"},
  totalValue: {fontSize: 16, fontWeight: "700", color: "#1A1A1A"},
});

export default OrderHistoryDetail;
