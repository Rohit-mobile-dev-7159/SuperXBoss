import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import NavigationString from '../../../Constant/NavigationString';

const {width} = Dimensions.get('window');

interface Coupon {
  _id: string;
  code: string;
  amount: number;
  min_cart_amt: number;
  start_date: string;
  end_date: string;
  status: boolean;
}

export const CouponCard = ({item, fullWidth = false}: any) => {
  const isValid = moment().isBetween(
    moment(item.start_date),
    moment(item.end_date),
  );

  return (
    <View
      testID={`item_${item._id}`}
      style={[
        styles.card,
        !isValid && styles.expiredCard,
        {width: fullWidth ? '100%' : width * 0.55},
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.couponHeader}>
          <View style={styles.couponInfo}>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.amount}>₹{item.amount} OFF</Text>
          </View>
          <Ionicons
            name="pricetag"
            size={20}
            color={isValid ? '#4CAF50' : '#999'}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="cart" size={12} color="#666" />
            <Text style={styles.detailText}>Min: ₹{item.min_cart_amt}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={12} color="#666" />
            <Text style={styles.detailText}>
              Till: {moment(item.end_date).format('DD MMM')}
            </Text>
          </View>
        </View>

        {!isValid && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredText}>Expired</Text>
          </View>
        )}
      </View>

      {/* Coupon edge design */}
      <View style={styles.couponEdge}>
        <View style={styles.circle} />
        <View style={styles.circle} />
      </View>
    </View>
  );
};

const Coupon = ({coupons}: {coupons: Coupon[]}) => {
  const Navigation: any = useNavigation();
  const validCoupons = coupons.filter(coupon =>
    moment().isBetween(moment(coupon.start_date), moment(coupon.end_date)),
  );

  return (
    <View style={styles.container} testID="coupon">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Available Offers</Text>
        <View style={styles.divider} />
      </View>

      {validCoupons.length > 0 ? (
        <FlatList
          testID="list"
          data={validCoupons}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <CouponCard item={item} />}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.viewAllButton}
              activeOpacity={0.7}
              onPress={() => {
                Navigation.navigate(NavigationString.BrandDay);
              }}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetags" size={32} color="#ccc" />
          <Text style={styles.emptyText}>No coupons available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewAllButton: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe8f7ff',
    borderRadius: 10,
    marginLeft: 4,
  },
  viewAllText: {
    color: '#4a6da7',
    fontWeight: '600',
    fontSize: 14,
  },
  container: {
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 5,
  },
  divider: {
    height: 2,
    width: 35,
    backgroundColor: '#4a6da7',
    borderRadius: 2,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 110, // Reduced height
  },
  expiredCard: {
    opacity: 0.7,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  couponInfo: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  expiredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffebee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 4,
  },
  expiredText: {
    color: '#d32f2f',
    fontSize: 10,
    fontWeight: '500',
  },
  couponEdge: {
    width: 12,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default Coupon;
