import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFetchCoupon} from '../../../Services/Main/Hooks';
import colors from '../../../Style/Color';

interface Coupon {
  _id: string;
  code: string;
  amount: number;
  min_cart_amt: number;
  start_date: string;
  end_date: string;
  status: boolean;
}

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  appliedCoupon?: Coupon | null;
  cartTotal: number;
  testID?: string;
}

const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  onClose,
  onApplyCoupon,
  appliedCoupon,
  cartTotal,
  testID,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const {data, isLoading, refetch} = useFetchCoupon({});

  useEffect(() => {
    if (data?._payload) {
      const validCoupons = data?._payload.filter((coupon: Coupon) => {
        const now = new Date();
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);

        return (
          coupon.status &&
          now >= startDate &&
          now <= endDate &&
          cartTotal >= coupon.min_cart_amt
        );
      });
      setFilteredCoupons(validCoupons);
    }
  }, [data, cartTotal]);

  useEffect(() => {
    if (visible) {
      setSelectedCoupon(appliedCoupon || null);
      refetch();
    }
  }, [visible, appliedCoupon]);

  const handleApply = () => {
    onApplyCoupon(selectedCoupon);
    onClose();
  };

  const isCouponDisabled = (coupon: Coupon) => {
    return cartTotal < coupon.min_cart_amt;
  };

  const renderCouponItem = ({item}: {item: Coupon}) => {
    const disabled = isCouponDisabled(item);
    const isApplied = appliedCoupon?._id === item._id;
    const isSelected = selectedCoupon?._id === item._id;

    return (
      <TouchableOpacity
        style={[
          styles.couponItem,
          (isSelected || isApplied) && styles.selectedCoupon,
          disabled && styles.disabledCoupon,
        ]}
        onPress={() => !disabled && setSelectedCoupon(item)}
        disabled={disabled}
      >
        <View style={styles.couponLeft}>
          <Text
            style={[
              styles.couponCode,
              disabled && styles.disabledText,
              (isSelected || isApplied) && styles.selectedText,
            ]}
          >
            {item.code}
          </Text>
          <Text
            style={[
              styles.couponDiscount,
              disabled && styles.disabledText,
              (isSelected || isApplied) && styles.selectedText,
            ]}
          >
            ₹{item.amount} OFF
          </Text>
          <Text
            style={[
              styles.couponTerms,
              (isSelected || isApplied) && styles.selectedText,
            ]}
          >
            Min. order ₹{item.min_cart_amt}
          </Text>
          <Text
            style={[
              styles.couponTerms,
              (isSelected || isApplied) && styles.selectedText,
            ]}
          >
            Valid until {new Date(item.end_date).toLocaleDateString()}
          </Text>
          {disabled && (
            <Text style={styles.requiredAmountText}>
              Add ₹{item.min_cart_amt - cartTotal} more to apply
            </Text>
          )}
        </View>
        <View style={styles.couponRight}>
          {isApplied ? (
            <Icon name="checkmark-circle" size={24} color="#4CAF50" />
          ) : disabled ? (
            <Icon name="close-circle" size={24} color="#ccc" />
          ) : (
            <Icon
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={isSelected ? '#4CAF50' : '#ccc'}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      testID={testID}
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Available Coupons</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.Black} />
            </View>
          ) : (
            <FlatList
              data={filteredCoupons}
              renderItem={renderCouponItem}
              keyExtractor={item => item?._id.toString()}
              contentContainerStyle={styles.couponList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="pricetag-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No coupons available</Text>
                  {cartTotal > 0 && (
                    <Text style={styles.emptySubText}>
                      {data?.length > 0
                        ? 'No coupons match your cart value'
                        : 'No active coupons right now'}
                    </Text>
                  )}
                </View>
              }
            />
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.applyButton,
                !selectedCoupon && styles.disabledButton,
              ]}
              onPress={handleApply}
              disabled={!selectedCoupon}
            >
              <Text style={styles.applyButtonText}>
                {selectedCoupon?._id === appliedCoupon?._id
                  ? 'Applied'
                  : 'Apply Coupon'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  couponList: {
    paddingHorizontal: 16,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCoupon: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF4',
  },
  disabledCoupon: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  couponLeft: {
    flex: 1,
  },
  couponRight: {
    marginLeft: 16,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#114915',
  },
  couponDiscount: {
    fontSize: 14,
    color: '#114915ff',
    marginBottom: 4,
  },
  couponTerms: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  requiredAmountText: {
    fontSize: 12,
    color: '#9bdf9fff',
    marginTop: 4,
    fontStyle: 'italic',
  },
  disabledText: {
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
  emptySubText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#223c23ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CouponModal;
