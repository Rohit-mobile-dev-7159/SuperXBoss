import React, {memo} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import colors from "../../../Style/Color";
import MainStyle from "../../../Styles/MainStyle";
import Icon from "react-native-vector-icons/AntDesign";
import ImagePath from "../../../Constant/ImagePath";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../../../Constant/NavigationString";
import WishlistButton from "../../Product/Component/WishlistButton";

const {width} = Dimensions.get("window");
const CARD_WIDTH = width * 0.43;
const SPACING = 12;

const NewArrivalsCard = ({data}: any) => {
  const userData = useSelector((state: any) => state.token.token);
  const Navigation: any = useNavigation();

  const ProductCard = ({item}: any) => {
    return (
      <View style={styles.productCard} testID={`item_${item._id}`}>
        <TouchableOpacity
          testID="arrival_detail"
          activeOpacity={0.9}
          onPress={() => {
            Navigation.navigate(NavigationString.ProductDetail, {
              productId: item._id,
            });
          }}
        >
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={
                item.images.length ? {uri: item.images[0]} : ImagePath.Default
              }
              style={styles.productImage}
              resizeMode="contain"
            />

            {/* Points Display - Top Right */}
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>{item.point} pts</Text>
            </View>

            {/* Wishlist Button - Top Left */}
            <View style={styles.wishlistButton}>
              <WishlistButton productId={item._id} status={item.wishList} />
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ₹
                {userData.type === "customer"
                  ? item.discount_customer_price
                  : item.discount_b2b_price}
              </Text>
              {item.any_discount && (
                <>
                  <Text style={styles.originalPrice}>
                    ₹
                    {userData.type === "customer"
                      ? item.customer_price
                      : item.b2b_price}
                  </Text>
                  <Text style={styles.discountText}>
                    {item.any_discount}% off
                  </Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container} testID="arrival">
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>New Arrivals</Text>
      </View>

      {/* Product Cards */}
      <FlatList
        data={data}
        renderItem={({item}) => <ProductCard item={item} />}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        ListFooterComponent={
          <TouchableOpacity
            testID="footer"
            style={styles.viewAllButton}
            activeOpacity={0.7}
            onPress={() => {
              Navigation.navigate(NavigationString.Product, {
                filter: {new_arrival: true},
              });
            }}
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        }
      />

      {/* Exclusive Mega Deals Banner */}
      <TouchableOpacity
        style={[styles.megaDealsBanner, MainStyle.flexRow, {gap: 10}]}
      >
        <Text style={styles.megaDealsText}>EXCLUSIVE MEGA DEALS</Text>
        <View style={[MainStyle.flexLeft]}>
          <Icon name="star" size={18} color="#FFD700" />
          <Icon name="star" size={18} color="#FFD700" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  viewAllButton: {
    width: 100,
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe8f7ff",
    borderRadius: 10,
    marginLeft: 4,
  },
  viewAllText: {
    color: "#4a6da7",
    fontWeight: "600",
    fontSize: 14,
  },
  container: {
    backgroundColor: colors.Black,
    padding: 10,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.White,
    textAlign: "center",
  },
  productsContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 10,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginRight: SPACING,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: colors.White,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 10, // Added padding to ensure image doesn't touch edges
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  pointsContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 165, 0, 0.9)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 2, // Ensure it stays above other elements
  },
  pointsText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(201, 199, 199, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure it stays above other elements
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.DBlue,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountText: {
    color: "green",
    fontWeight: "500",
    fontSize: 11,
  },
  megaDealsBanner: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  megaDealsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 2,
  },
});

export default memo(NewArrivalsCard);
