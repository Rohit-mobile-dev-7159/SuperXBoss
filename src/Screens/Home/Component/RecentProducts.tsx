import React, {memo, useRef} from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import ImagePath from "../../../Constant/ImagePath";
import {useSelector} from "react-redux";
import colors from "../../../Style/Color";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../../../Constant/NavigationString";
import WishlistButton from "../../Product/Component/WishlistButton";
import BulkDiscount from "./BulkDiscount";
import QuantitySelector from "../../Product/Component/QuantitySelector";
import MainStyle from "../../../Styles/MainStyle";

const {width} = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SPACING = 16;
const ITEM_HEIGHT = 310;

const RecentProduct = ({data}: any) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const userData = useSelector((state: any) => state.token.token);
  const Navigation: any = useNavigation();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const shouldShowViewAll = data.length > 10;
  const displayData = shouldShowViewAll ? [...data, {id: "view-all"}] : data;

  const renderItem = ({item, index}: any) => {
    if (item.id === "view-all") {
      return (
        <TouchableOpacity
          style={[styles.itemContainer, styles.viewAllContainer]}
          activeOpacity={0.8}
        >
          <View style={styles.viewAllContent}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllSubtext}>{data.length}+ Products</Text>
            <View style={styles.arrowIcon}>
              <Text style={styles.arrowIconText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    const product = item;
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + SPACING),
      index * (ITEM_WIDTH + SPACING),
      (index + 1) * (ITEM_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    return (
      <AnimatedTouchable
        testID={`detail_${item._id}`}
        style={[
          styles.itemContainer,
          {
            transform: [{scale}],
            opacity,
          },
        ]}
        onPress={() => {
          Navigation.navigate(NavigationString.ProductDetail, {
            productId: item._id,
          });
        }}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              product.images.length
                ? {uri: product?.images[0]}
                : ImagePath.Default
            }
            style={styles.image}
            resizeMode="contain"
          />

          {/* Points Display */}
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{product.point} Points</Text>
          </View>

          {/* Wishlist Button */}
          <View style={styles.wishlistButton}>
            <WishlistButton productId={item._id} status={item.wishList} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.category}>{product?.brand?.name}</Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹
              {userData.type === "customer"
                ? product.discount_customer_price
                : product.discount_b2b_price}
            </Text>
            {product.any_discount && (
              <>
                <Text style={styles.originalPrice}>
                  ₹
                  {userData.type === "customer"
                    ? product.customer_price
                    : product.b2b_price}
                </Text>
                <Text style={styles.discountText}>
                  {product.any_discount}% off
                </Text>
              </>
            )}
          </View>
          <View style={[MainStyle.flexBetween]}>
            <Text
              style={{fontSize: 12, color: colors.Black, fontWeight: "500"}}
            >
              Item Stock : {product.item_stock}
            </Text>
            <Text
              style={{fontSize: 12, color: colors.Black, fontWeight: "500"}}
            >
              MinQty : {product.min_qty}
            </Text>
          </View>
          <BulkDiscount data={product?.bulk_discount[0]} gst={product.tax} />

          {item.item_stock > 0 ? (
            <QuantitySelector
              quantity={item?.addToCartQty || 0}
              productId={item._id}
              itemStock={item.item_stock}
              minQty={Number(product.min_qty)}
            />
          ) : (
            <View
              style={{
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e5adadff",
                borderRadius: 10,
                marginTop: 5,
              }}
            >
              <Text
                style={{fontSize: 15, color: colors.White, fontWeight: "600"}}
              >
                Stock not available
              </Text>
            </View>
          )}
        </View>
      </AnimatedTouchable>
    );
  };

  return (
    <View style={styles.container} testID="recent_product">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Recent Products</Text>
        <View style={styles.divider} />
      </View>

      {displayData.length > 0 && (
        <Animated.FlatList
          data={displayData}
          keyExtractor={(item: any) => item._id || item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default memo(RecentProduct);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  headerContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: "#4a6da7",
    borderRadius: 2,
  },
  flatListContent: {
    paddingHorizontal: SPACING,
    paddingBottom: 8,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT * 1.15,
    marginRight: SPACING,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 5,
    overflow: "hidden",
  },
  viewAllContainer: {
    backgroundColor: "#4a6da7",
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllContent: {
    alignItems: "center",
    padding: 20,
  },
  viewAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
  },
  viewAllSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 16,
  },
  arrowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIconText: {
    color: "#fff",
    fontSize: 20,
  },
  imageContainer: {
    width: "100%",
    height: ITEM_WIDTH * 0.6,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.White, // clean background for edge spread
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pointsContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  pointsText: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 13,
  },
  wishlistButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(201, 199, 199, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    padding: 16,
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  category: {
    color: "#888",
    fontSize: 12,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.DBlue,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountText: {
    color: "green",
    fontWeight: "500",
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: colors.DBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
