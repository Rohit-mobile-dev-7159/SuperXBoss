import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  SlideInRight,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import NavigationString from '../../Constant/NavigationString';
import {useFetchAllOrder} from '../../Services/Main/Hooks';
import {Header} from '../../Component/Index';
import colors from '../../Style/Color';

const STATUS_FILTERS = [
  'All',
  'Confirmed',
  'Shipped',
  'Completed',
  'Cancelled',
];

const OrderHistory = () => {
  const navigation: any = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState('All');

  const {data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage}: any =
    useFetchAllOrder({});

  const orders = data?.result || [];

  const filteredOrders =
    selectedStatus === 'All'
      ? orders
      : orders.filter(
          (order: any) =>
            order.status.toLowerCase() === selectedStatus.toLowerCase(),
        );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFilterTabs = () => (
    <Animated.View
      style={styles.filterContainer}
      entering={FadeIn.duration(500)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {STATUS_FILTERS.map((status, index) => (
          <Animated.View
            key={status}
            entering={FadeInDown.delay(index * 100).springify()}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === status && styles.activeFilter,
              ]}
              onPress={() => setSelectedStatus(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status && styles.activeFilterText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'shipped':
        return '#2196F3';
      case 'processing':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#000';
    }
  };

  const renderSkeletonItem = () => (
    <Animated.View
      style={styles.skeletonCard}
      entering={ZoomIn.delay(300)}
      exiting={ZoomOut}
    >
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonFooter} />
    </Animated.View>
  );

  const renderOrderItem = ({item, index}: any) => {
    const totalItems = item.summary.totalQty;
    const orderDate = new Date(item.createdAt).toLocaleDateString();
    return (
      <Animated.View
        entering={SlideInRight.delay(index * 50)}
        layout={Layout.springify()}
        style={{marginHorizontal: 5}}
      >
        <TouchableOpacity
          testID={`item_${item._id}`}
          style={styles.orderCard}
          onPress={() =>
            navigation.navigate(NavigationString.OrderHistoryDetail, {
              _id: item._id,
            })
          }
          activeOpacity={0.8}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#{item.orderNo}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: `${getStatusColor(item.status)}20`},
              ]}
            >
              <Text
                style={[
                  styles.orderStatus,
                  {color: getStatusColor(item.status)},
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>Placed on {orderDate}</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.itemCount}>
              {totalItems} {totalItems > 1 ? 'items' : 'item'}
            </Text>
            <Text style={styles.orderTotal}>
              ₹{item.summary.grandTotal.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View style={styles.footer} testID="footer">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  return (
    <>
      <Header title={'My Orders'} />
      <View style={styles.container} testID="order_history">
        {renderFilterTabs()}
        {isLoading ? (
          <FlatList
            testID="skelton"
            data={[1, 2, 3, 4]}
            renderItem={renderSkeletonItem}
            keyExtractor={item => item.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Animated.FlatList
            testID="list"
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Animated.View
                style={styles.emptyContainer}
                entering={FadeIn.delay(200)}
              >
                <Text style={styles.emptyText}>No orders found</Text>
                <Text style={styles.emptySubText}>
                  {selectedStatus !== 'All'
                    ? 'Try changing the filter to "All"'
                    : "You haven't placed any orders yet"}
                </Text>
              </Animated.View>
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    height: 40,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#1a1a1a',
  },
  filterText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  separator: {
    height: 12,
  },
  skeletonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 16,
    width: '70%',
  },
  skeletonFooter: {
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 8,
  },
  footer: {
    paddingVertical: 20,
  },
});

export default OrderHistory;
