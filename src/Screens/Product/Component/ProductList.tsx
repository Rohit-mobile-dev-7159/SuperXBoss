import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  colors,
  ImagePath,
  NavigationString,
} from '../../../Constant/AllImports';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import BulkDiscount from '../../Home/Component/BulkDiscount';
import WishlistButton from './WishlistButton';
import Skelton from '../../../Component/Skelton/Skelton';
import LottieLoader from '../../../Component/LottieLoader';
import QuantitySelector from './QuantitySelector';
import MainStyle from '../../../Styles/MainStyle';
const ProductList = ({
  data,
  refetch,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isPageRefresh,
}: {
  data: any;
  refetch: any;
  fetchNextPage: any;
  hasNextPage: any;
  isLoading: boolean;
  isPageRefresh?: boolean;
}) => {
  const Navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const userData = useSelector((state: any) => state.token.token);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!hasNextPage) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.DBlue} />
      </View>
    );
  };

  return isLoading ? (
    <Skelton />
  ) : (
    <FlatList
      testID="flatlist"
      data={data}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.DBlue]}
          tintColor={colors.DBlue}
        />
      }
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <LottieLoader url={require('../../../lottie/Inventory.json')} />
        </View>
      )}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              Navigation.navigate(NavigationString.ProductDetail, {
                productId: item._id,
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={
                  item?.images.length
                    ? {uri: item.images[0]}
                    : ImagePath.Default
                }
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text
                  style={styles.title}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item?.name}
                </Text>
                <WishlistButton
                  productId={item._id || ''}
                  status={item.wishList}
                  isPageRefresh={isPageRefresh}
                  refetch={refetch}
                />
              </View>

              <View style={[MainStyle.flexBetween]}>
                <Text style={styles.brandText}>{item?.brand?.name}</Text>
                {/* <Text style={styles.brandText}>{item?.part_no}</Text> */}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  ₹
                  {userData?.type === 'customer'
                    ? (item?.discount_customer_price).toFixed(2)
                    : (item?.discount_b2b_price).toFixed(2)}
                </Text>
                {item.any_discount && (
                  <>
                    <Text style={styles.originalPrice}>
                      ₹
                      {userData?.type === 'customer'
                        ? (item?.customer_price).toFixed(2)
                        : (item?.b2b_price).toFixed(2)}
                    </Text>
                    <Text style={styles.discountText}>
                      {item?.any_discount}% off
                    </Text>
                  </>
                )}
              </View>
              <View style={[MainStyle.flexBetween]}>
                <Text
                  style={{fontSize: 12, color: colors.Black, fontWeight: '500'}}
                >
                  Item Stock : {item.item_stock}
                </Text>
                <Text
                  style={{fontSize: 12, color: colors.Black, fontWeight: '500'}}
                >
                  MinQty : {item.min_qty}
                </Text>
              </View>
              <BulkDiscount data={item?.bulk_discount[0]} point={item?.point} />
              {item.item_stock > 0 ? (
                <QuantitySelector
                  quantity={item?.addToCartQty || 0}
                  productId={item._id}
                  itemStock={item.item_stock}
                  minQty={Number(item.min_qty)}
                />
              ) : (
                <View
                  style={{
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#e5adadff',
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.White,
                      fontWeight: '600',
                    }}
                  >
                    Stock not available
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => item._id}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
    paddingBottom: 70,
  },
  emptyContainer: {
    height: Dimensions.get('screen').height - 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.Black,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    height: 182,
  },
  imageContainer: {
    width: 120,
    height: '100%',
    backgroundColor: colors.White,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.Black,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a6da7',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountText: {
    color: 'green',
    textDecorationLine: 'none',
    fontWeight: '500',
    fontSize: 12,
  },
  addToCartButton: {
    backgroundColor: colors.DBlue,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.DBlue,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.DBlue,
  },
  qtyBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  qtyBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.Black,
  },
});

export default ProductList;
