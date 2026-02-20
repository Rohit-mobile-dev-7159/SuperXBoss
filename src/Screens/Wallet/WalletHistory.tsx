import React, {memo, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {SlideInRight} from 'react-native-reanimated';
import {Header} from '../../Component/Index';
import colors from '../../Style/Color';
import {useFetchWalletHistory} from '../../Services/Main/Hooks';
import moment from 'moment';

const {width} = Dimensions.get('window');

const WalletHistory = () => {
  const payload = useMemo(() => ({page_size: 10}), []);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchWalletHistory(payload);

  const isLoadingMore = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  const transactions = data?.result ?? [];

  // Load more with reset
  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage && !isLoadingMore.current) {
      isLoadingMore.current = true;
      try {
        await fetchNextPage();
      } finally {
        isLoadingMore.current = false;
      }
    }
  };

  //  Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({item, index}: any) => (
    <Animated.View
      entering={SlideInRight.delay(index * 120).duration(500)}
      style={styles.transactionCard}
    >
      <View
        style={[
          styles.iconWrapper,
          {backgroundColor: item.source === 'debit' ? '#f5e9e8ff' : '#E8F5E9'},
        ]}
      >
        <Icon
          name={
            item.source === 'debit'
              ? 'arrow-up-bold-circle'
              : 'arrow-down-bold-circle'
          }
          size={32}
          color={item.source === 'debit' ? colors.Red : '#4CAF50'}
        />
      </View>
      <View style={{flex: 1}}>
        {item?.order_id ? (
          <Text style={styles.title}>Product Purchase</Text>
        ) : item.source === 'free' ? (
          <Text style={styles.title}>Free Amount</Text>
        ) : (
          <Text style={styles.title}>Wallet Recharge</Text>
        )}
        <Text
          style={[
            styles.amount,
            {color: item.source === 'debit' ? colors.Red : '#4CAF50'},
          ]}
        >
          {item.source === 'debit' && '-'} ₹{item.amount}{' '}
          {item.offer_id && `+${item.offer_amount}`}
        </Text>
        <Text style={styles.date}>{moment(item.createdAt).format('LLL')}</Text>
      </View>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View testID="loader" style={styles.loader}>
        <ActivityIndicator size="large" color={colors.DBlue} />
      </View>
    );
  }

  return (
    <View testID="wrapper">
      <Header title={'Wallet History'} />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Added Money</Text>
        <FlatList
          testID="list"
          data={transactions}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 40}}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                testID="footerLoader"
                size="small"
                color="#333"
                style={{marginVertical: 16}}
              />
            ) : null
          }
          ListEmptyComponent={() => (
            <Text testID="emptyList" style={styles.emptyText}>
              No added money yet
            </Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#333',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    width: width - 35,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 10,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 17,
    color: colors.Black,
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

export default memo(WalletHistory);
