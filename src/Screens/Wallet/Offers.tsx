import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {
  useFetchOffers,
  useFetchUserProfile,
  useRechargeWallet,
  useRechargeWalletVerify,
} from '../../Services/Main/Hooks';
import {Header} from '../../Component/Index';
import colors from '../../Style/Color';
import RazorpayCheckout from 'react-native-razorpay';
import {showErrorAlert, showToast} from '../../Constant/ShowDailog';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 20 padding + 20 between cards

const Offers = () => {
  const Navigation = useNavigation();
  const {data, isLoading, hasNextPage, fetchNextPage}: any = useFetchOffers({
    page_size: 10,
  });
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const {mutate, isPending: isPending} = useRechargeWallet();
  const {mutate: rechargeVerifyMutate, isPending: isPending1} =
    useRechargeWalletVerify();
  const {data: userProfile} = useFetchUserProfile();
  const handleSelectOffer = (offer: (typeof data.result)[0]) => {
    setSelectedOfferId(offer._id);
  };

  const handlePayNow = () => {
    const selectedOffer = data.result.find(
      (o: any) => o._id === selectedOfferId,
    );
    if (selectedOffer) {
      mutate(
        {offer_id: selectedOffer._id, amount: selectedOffer.amount},
        {
          onSuccess: res => {
            if (res.success) {
              const options: any = {
                description: `Payment for order ${res?._payload?.orderId}`,
                // image: require('../../Images/ic_launcher.png'),
                currency: 'INR',
                key: 'rzp_test_FJbZTaMr0yy4pM',
                amount: res._payload.amount,
                name: 'SuperXBoss',
                order_id: res?._payload?.orderId || '',
                prefill: {
                  email: userProfile?._payload?.email,
                  contact: userProfile?._payload?.mobile,
                  name: userProfile?._payload?.name,
                },
                theme: {color: colors.primary},
              };

              RazorpayCheckout.open(options)
                .then(data => {
                  console.log(
                    'Payment Success:',
                    JSON.stringify(data, null, 2),
                  );
                  rechargeVerifyMutate(
                    {...data, name: userProfile?._payload?.name},
                    {
                      onSuccess: response => {
                        if (response.success) {
                          Navigation.goBack();
                          showToast(response.message);
                        }
                      },
                      onError: () => {},
                    },
                  );
                })
                .catch(error => {
                  console.error(`Error: ${error.code} | ${error.description}`);
                  showErrorAlert('Paymet failed');
                });
            }
          },
          onError: error => {
            console.log(error, '----------');
          },
        },
      );
    }
  };

  const renderOfferItem = ({item}: {item: (typeof data.result)[0]}) => {
    const isSelected = item._id === selectedOfferId;
    const totalAmount = item.amount + item.offer_amount;
    return (
      <TouchableOpacity
        style={[styles.offerCard, isSelected && styles.selectedOffer]}
        onPress={() => handleSelectOffer(item)}
        activeOpacity={0.8}
      >
        <View style={styles.offerHeader}>
          <Text style={styles.offerTitle}>Offer</Text>
        </View>
        <View style={styles.offerBody}>
          <Text style={styles.amountText}>₹{item.amount}</Text>
          <Text style={styles.offerAmountText}>+ ₹{item.offer_amount}</Text>
          <Text style={styles.totalAmountText}>Total: ₹{totalAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const loadMoreOffers = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <Header title={'Wallet Offers'} />
      <View style={styles.container}>
        <FlatList
          data={data?.result || []}
          keyExtractor={item => item._id}
          renderItem={renderOfferItem}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
          onEndReached={loadMoreOffers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasNextPage ? <ActivityIndicator size="small" color="#000" /> : null
          }
          contentContainerStyle={{paddingBottom: 100}} // leave space for button
        />

        {/* Sticky Pay Now button */}
        <View style={styles.payNowContainer}>
          <TouchableOpacity
            style={[
              styles.payNowButton,
              !selectedOfferId && styles.payNowDisabled,
            ]}
            onPress={handlePayNow}
            disabled={!selectedOfferId}
          >
            {isPending || isPending1 ? (
              <ActivityIndicator color={colors.White} size={'small'} />
            ) : (
              <Text style={styles.payNowText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  offerCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 10,
  },
  selectedOffer: {
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  offerHeader: {
    backgroundColor: '#e0f7fa',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  offerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00796b',
  },
  offerBody: {
    alignItems: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  offerAmountText: {
    fontSize: 14,
    color: '#ff5722',
    marginVertical: 5,
    fontWeight: '600',
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  payNowContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  payNowButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payNowDisabled: {
    backgroundColor: '#a5d6a7',
  },
  payNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Offers;
