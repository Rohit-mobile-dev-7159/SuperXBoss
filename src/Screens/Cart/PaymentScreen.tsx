import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddressModal from './Component/AddressModal';
import {
  useFetchAddress,
  useFetchAllAddToCartProduct,
  useFetchUserProfile,
  useKmPointCharge,
  useOrderConfirm,
  useOrderPaymnet,
  useUpdateAddress,
} from '../../Services/Main/Hooks';
import {showSuccessAlert} from '../../Constant/ShowDailog';
import RazorpayCheckout from 'react-native-razorpay';
import colors from '../../Style/Color';
import {getDistanceInKm} from '../../Helper/getDistanceInKm';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../Redux/Slices/AddToCartProduct';
import {useNavigation} from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';

const PaymentScreen = ({route}: any) => {
  const {payload, total} = route.params || {};
  const Navigation: any = useNavigation();
  const Dispatch = useDispatch();
  const {data, isLoading, refetch} = useFetchAddress();
  const {data: Charges, isLoading: loading1} = useKmPointCharge();
  const {data: userProfile, isLoading: loading2} = useFetchUserProfile();
  const {mutate: orderMutate, isPending: isPending1} = useOrderPaymnet();
  const {mutate: confirmOrderMutate, isPending: isPending2} = useOrderConfirm();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([
    'razorpay',
  ]);
  const [isAddressCollapsed, setIsAddressCollapsed] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const {mutate, isPending} = useUpdateAddress();
  const [showDelete, setShowDelete] = useState('');
  const [distance, setDistance] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [PlatformCharge, setPlatformCharge] = useState(0);
  const {data: cartData, isLoading: fetchLoading}: any =
    useFetchAllAddToCartProduct({});

  const orderTotal = total;
  const freeShippingThreshold = Charges?._payload?.freeShippingUpto || 0;
  // Calculate if shipping should be applied (orderTotal > freeShippingThreshold)
  const shouldApplyShipping = orderTotal < freeShippingThreshold;

  const isWalletUsed = selectedMethods.includes('wallet');
  const isPointsUsed = selectedMethods.includes('points');

  const walletBalance = userProfile?._payload?.wallet_amount || 0;
  const pointsBalance = userProfile?._payload?.points || 0;
  const pointsRupeeBalance =
    pointsBalance * (Charges?._payload?.pointValue || 1);

  const grandTotal = useMemo(
    () =>
      (orderTotal || 0) +
      (shouldApplyShipping ? shippingCharge : 0) +
      (PlatformCharge || 0),
    [orderTotal, shippingCharge, PlatformCharge, shouldApplyShipping],
  );

  // Calculate deductions
  const walletDeduction = isWalletUsed
    ? Math.min(walletBalance, grandTotal)
    : 0;
  const remainingAfterWallet = grandTotal - walletDeduction;
  const pointsDeduction = isPointsUsed
    ? Math.min(pointsRupeeBalance, remainingAfterWallet)
    : 0;

  // Remaining amount user has to pay via Razorpay
  const remainingAmount = useMemo(() => {
    return Math.max(
      0,
      Number((grandTotal - walletDeduction - pointsDeduction).toFixed(2)),
    );
  }, [grandTotal, walletDeduction, pointsDeduction]);

  const toggleAddressCollapse = () => {
    setIsAddressCollapsed(!isAddressCollapsed);
  };

  const handleAddressStatus = async (_id: any) => {
    setShowDelete(_id);
    const payload = {_id, status: false};
    mutate(payload, {
      onSuccess: res => {
        if (res.success) {
          showSuccessAlert(res.message);
          refetch();
        }
      },
    });
  };

  const togglePaymentMethod = (id: string) => {
    if (id === 'razorpay') {
      return;
    }

    setSelectedMethods(prev => {
      if (id === 'wallet' || id === 'points') {
        return prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id];
      }

      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      const pointsToUse = isPointsUsed
        ? Math.min(
            pointsBalance,
            pointsDeduction / (Charges?._payload?.pointValue || 1),
          )
        : 0;
      const product = cartData.result.map((prev: any) => ({
        product_id: prev._id,
        qty: prev.addToCartQty,
      }));
      const mainPayload = {
        products: product,
        coupon: payload?.coupon?.code,
        shippingAddress: selectedAddress,
        point: Number(pointsToUse.toFixed(2)),
        walletAmount: Number(walletDeduction.toFixed(2)),
        shippingCharges: shouldApplyShipping
          ? Number(shippingCharge.toFixed(2))
          : 0,
        platformCharges: Number(
          (Charges?._payload?.platformCharges || 0).toFixed(2),
        ),
      };
      console.log(mainPayload, '99999999999999999999999999');

      orderMutate(mainPayload, {
        onSuccess: res => {
          if (res.success) {
            // Only proceed to Razorpay if there's an amount to pay
            if (remainingAmount > 0) {
              const options: any = {
                description: 'Payment for order',
                currency: 'INR',
                key: 'rzp_test_FJbZTaMr0yy4pM',
                amount: res?._payload?.razorpay?.amount,
                name: 'SuperXBoss',
                order_id: res?._payload?.razorpay?.order_id || '',
                prefill: {
                  email: userProfile?._payload?.email,
                  contact: userProfile?._payload?.mobile,
                  name: userProfile?._payload?.name,
                },
                theme: {color: colors.DBlue},
              };

              RazorpayCheckout.open(options)
                .then(data => {
                  confirmOrderMutate(
                    {
                      ...data,
                      orderNo: res?._payload?.orderNo,
                      name: userProfile?._payload?.name,
                    },
                    {
                      onSuccess: response => {
                        if (response.success) {
                          Dispatch(clearCart());
                          Navigation.navigate(
                            NavigationString.OrderHistoryDetail,
                            {
                              order: response?._payload?.order,
                              goHome: true,
                            },
                          );
                        }
                      },
                    },
                  );
                })
                .catch(error => {
                  console.error(`Error: ${error.code} | ${error.description}`);
                });
            } else {
              // No payment needed, confirm order directly
              confirmOrderMutate(
                {
                  orderNo: res?._payload?.orderNo,
                  name: userProfile?._payload?.name,
                },
                {
                  onSuccess: response => {
                    if (response.success) {
                      Dispatch(clearCart());
                      Navigation.navigate(NavigationString.OrderHistoryDetail, {
                        order: response?._payload?.order,
                        goHome: true,
                      });
                    }
                  },
                },
              );
            }
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!addAddress) {
      refetch();
    }
  }, [addAddress]);

  useEffect(() => {
    const result = data?._payload?.find((res: any) => res.isDefault === true);
    if (result) {
      const calculatedDistance = getDistanceInKm(
        27.2077865,
        77.9815186,
        result?.coordinates[1],
        result?.coordinates[0],
      );

      setDistance(calculatedDistance);
      if (Charges?._payload?.deliveryChargesPerKM) {
        setShippingCharge(
          calculatedDistance * Charges?._payload?.deliveryChargesPerKM,
        );
      }
      setSelectedAddress(result._id);
    }
  }, [data?._payload, Charges?._payload]);

  useEffect(() => {
    if (Charges?._payload?.platformCharges) {
      setPlatformCharge(Charges?._payload?.platformCharges || 0);
    }
  }, [Charges]);

  const paymentOptions = [
    {
      id: 'razorpay',
      name: 'Online Payment',
      icon: 'credit-card',
      value: 0,
      alwaysSelected: true,
    },
    {
      id: 'wallet',
      name: 'Wallet Balance',
      icon: 'account-balance-wallet',
      value: walletBalance,
      disabled: walletBalance <= 0,
    },
    {
      id: 'points',
      name: 'Point Balance',
      icon: 'stars',
      value: pointsBalance,
      disabled: pointsBalance <= 0,
    },
  ];

  if (isLoading || loading1 || loading2 || fetchLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.White,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={colors.DBlue} size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={toggleAddressCollapse}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Icon
              name={
                isAddressCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'
              }
              size={24}
              color="#1B4B66"
            />
          </TouchableOpacity>

          {isAddressCollapsed && (
            <>
              <FlatList
                nestedScrollEnabled={true}
                data={data?._payload}
                renderItem={({item: address}) => (
                  <TouchableOpacity
                    key={address._id}
                    style={[
                      styles.addressCard,
                      selectedAddress === address._id && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedAddress(address._id)}
                  >
                    <View style={styles.radioIcon}>
                      <Icon
                        name={
                          selectedAddress === address._id
                            ? 'check-box'
                            : 'check-box-outline-blank'
                        }
                        size={20}
                        color={
                          selectedAddress === address._id
                            ? '#1B4B66'
                            : '#757575'
                        }
                      />
                    </View>

                    {data?._payload.length > 1 && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 5,
                          padding: 5,
                          zIndex: 100,
                        }}
                        onPress={() => handleAddressStatus(address._id)}
                      >
                        {isPending && showDelete === address._id ? (
                          <ActivityIndicator size="small" color="#ed6b6bff" />
                        ) : (
                          <Icon
                            name="restore-from-trash"
                            size={20}
                            color="#ed6b6bff"
                          />
                        )}
                      </TouchableOpacity>
                    )}

                    <View style={styles.addressDetails}>
                      <Text style={styles.addressType}>
                        <Icon name="location-on" size={16} color="#1B4B66" />{' '}
                        {address.label}
                      </Text>
                      <Text style={styles.addressText}>{address.address}</Text>
                      <Text style={styles.addressText}>{address.city}</Text>
                      <Text style={styles.addressText}>{address.mobile}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddAddress(true)}
              >
                <Icon name="add" size={20} color="#1B4B66" />
                <Text style={styles.addButtonText}>Add new address</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                selectedMethods.includes(option.id) && styles.selectedOption,
                option.disabled && styles.disabledOption,
              ]}
              disabled={option.disabled || option.alwaysSelected}
              onPress={() => togglePaymentMethod(option.id)}
            >
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}
              >
                <Icon
                  name={option.icon}
                  size={24}
                  color={
                    selectedMethods.includes(option.id)
                      ? '#1B4B66'
                      : option.disabled
                      ? '#ccc'
                      : '#757575'
                  }
                />
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedMethods.includes(option.id) &&
                        styles.selectedOptionText,
                      option.disabled && styles.disabledText,
                    ]}
                  >
                    {option.name}
                  </Text>
                  {option.id !== 'razorpay' && (
                    <View style={{flexDirection: 'row', gap: 5}}>
                      <Text
                        style={[
                          styles.optionSubtext,
                          option.disabled && styles.disabledText,
                        ]}
                      >
                        {option.value.toFixed(2)}
                      </Text>
                      {option.id === 'points' && (
                        <Text
                          style={[
                            styles.optionSubtext,
                            option.disabled && styles.disabledText,
                          ]}
                        >
                          | 1 point = ₹
                          {(Charges?._payload?.pointValue || 0).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.radioIcon}>
                {option.alwaysSelected ? (
                  <Icon name="check-box" size={20} color="#1B4B66" />
                ) : (
                  <Icon
                    name={
                      selectedMethods.includes(option.id)
                        ? 'check-box'
                        : 'check-box-outline-blank'
                    }
                    size={20}
                    color={
                      selectedMethods.includes(option.id)
                        ? '#1B4B66'
                        : option.disabled
                        ? '#ccc'
                        : '#757575'
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total product amount</Text>
            <Text style={styles.summaryValue}>
              ₹{(orderTotal || 0).toFixed(2)}
            </Text>
          </View>

          {shouldApplyShipping && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>{distance.toFixed(2)} km</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Charge</Text>
            <Text style={styles.summaryValue}>
              {shouldApplyShipping ? (
                `₹${shippingCharge.toFixed(2)}`
              ) : (
                <Text style={{color: '#4CAF50'}}>
                  FREE (Order over ₹{freeShippingThreshold})
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Charge</Text>
            <Text style={styles.summaryValue}>
              ₹{(PlatformCharge || 0).toFixed(2)}
            </Text>
          </View>

          {isWalletUsed && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Wallet Deduction</Text>
              <Text style={styles.summaryValue}>
                -₹{walletDeduction.toFixed(2)}
              </Text>
            </View>
          )}

          {isPointsUsed && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points Deduction</Text>
              <Text style={styles.summaryValue}>
                -₹{pointsDeduction.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Amount to Pay</Text>
            <Text style={styles.totalValue}>₹{remainingAmount.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          *Final payable amount includes product total, shipping, platform
          charges, and wallet/points deduction.
          {!shouldApplyShipping &&
            ` Free shipping applied on orders over ₹${freeShippingThreshold}.`}
        </Text>
      </ScrollView>

      {/* Proceed Button */}
      <TouchableOpacity
        style={styles.proceedButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={isPending1 || isPending2}
      >
        {isPending1 || isPending2 ? (
          <ActivityIndicator color={colors.White} size={'small'} />
        ) : (
          <Text style={styles.proceedButtonText}>
            {remainingAmount === 0
              ? 'Confirm Order'
              : `Pay ₹${remainingAmount.toFixed(2)}`}
          </Text>
        )}
      </TouchableOpacity>

      {addAddress && (
        <AddressModal
          visible={addAddress}
          onClose={() => setAddAddress(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4B66',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    maxHeight: 400,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4B66',
  },
  addressCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 12,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#1B4B66',
    backgroundColor: '#F1F1F1',
  },
  radioIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  addressType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#1B4B66',
    marginLeft: 8,
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 12,
  },
  selectedOption: {
    borderColor: '#1B4B66',
    backgroundColor: '#F1F1F1',
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionText: {
    color: '#1B4B66',
    fontWeight: '500',
  },
  disabledText: {
    color: '#ccc',
  },
  optionSubtext: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4B66',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4B66',
  },
  footerNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#1B4B66',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
