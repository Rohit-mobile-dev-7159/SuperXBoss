import React, {useState, useEffect, useCallback, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import colors from '../../../Style/Color';
import {useAddToCart} from '../../../Services/Main/Hooks';
import {
  removeFromCart,
  setQuantity,
} from '../../../Redux/Slices/AddToCartProduct';

type Props = {
  quantity: number;
  productId: string;
  itemStock: number;
  style?: {
    actionButton?: ViewStyle;
    actionButtonText?: TextStyle;
    cartIcon?: ViewStyle;
    qtyControls?: ViewStyle;
    qtyButton?: ViewStyle;
    qtyBtnText?: TextStyle;
    qtyBox?: ViewStyle;
    qtyCount?: TextStyle;
  };
  refetch?: any;
  minQty?: number;
};

const DEBOUNCE_DELAY = 500; // milliseconds

const QuantitySelector = ({
  quantity,
  productId,
  itemStock,
  style,
  refetch,
  minQty = 1,
}: Props) => {
  const dispatch = useDispatch();
  const cart = useSelector(
    (state: {cart: {cartProducts: Record<string, {qty: number}>}}) =>
      state.cart.cartProducts,
  );
  const [loading, setLoading] = useState(false);
  const [localQty, setLocalQty] = useState(quantity || 0);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const {mutate} = useAddToCart();

  // Merge default styles with custom styles
  const mergedStyles = {
    actionButton: StyleSheet.flatten([
      styles.actionButton,
      style?.actionButton,
    ]),
    actionButtonText: StyleSheet.flatten([
      styles.actionButtonText,
      style?.actionButtonText,
    ]),
    cartIcon: StyleSheet.flatten([styles.cartIcon, style?.cartIcon]),
    qtyControls: StyleSheet.flatten([styles.qtyControls, style?.qtyControls]),
    qtyButton: StyleSheet.flatten([styles.qtyButton, style?.qtyButton]),
    qtyBtnText: StyleSheet.flatten([styles.qtyBtnText, style?.qtyBtnText]),
    qtyBox: StyleSheet.flatten([styles.qtyBox, style?.qtyBox]),
    qtyCount: StyleSheet.flatten([styles.qtyCount, style?.qtyCount]),
  };

  // Sync local quantity with Redux when cart changes
  useEffect(() => {
    setLocalQty(cart[productId]?.qty ?? quantity ?? 0);
  }, [cart, productId, quantity]);

  const currentQty = cart[productId]?.qty ?? quantity ?? 0;
  const isOutOfStock = itemStock <= 0;
  const disableDecrement = currentQty <= 0 || loading;
  const shouldShowAddButton =
    localQty < minQty || (!cart[productId]?.qty && localQty === 0);

  // Debounced update function
  const debouncedUpdateCart = useCallback(
    (newQty: number) => {
      // If quantity is below minimum, remove from cart
      if (newQty < minQty) {
        setLoading(true);
        mutate(
          {product: productId, qty: 0},
          {
            onSuccess: res => {
              if (res.success) {
                dispatch(removeFromCart({productId}));
                if (refetch) {
                  refetch();
                }
              }
              setLoading(false);
            },
            onError: () => {
              setLoading(false);
              setLocalQty(currentQty);
            },
          },
        );
        return;
      }

      // Prevent quantities less than minQty or more than stock
      const validatedQty = Math.max(minQty, Math.min(newQty, itemStock));

      if (newQty !== validatedQty) {
        setLocalQty(validatedQty);
        return;
      }

      setLoading(true);
      mutate(
        {product: productId, qty: validatedQty},
        {
          onSuccess: res => {
            if (res.success) {
              if (validatedQty === 0) {
                dispatch(removeFromCart({productId}));
              } else {
                dispatch(setQuantity({productId, qty: validatedQty}));
              }
              if (refetch) {
                refetch();
              }
            }
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
            setLocalQty(currentQty);
          },
        },
      );
    },
    [mutate, productId, itemStock, dispatch, currentQty, minQty],
  );

  const handleQuantityChange = (newQty: number) => {
    setLocalQty(newQty);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      debouncedUpdateCart(newQty);
    }, DEBOUNCE_DELAY);

    setDebounceTimer(timer);
  };

  const handleAddToCart = () => handleQuantityChange(minQty);
  const handleIncrease = () => handleQuantityChange(localQty + 1);
  const handleDecrease = () => handleQuantityChange(localQty - 1);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  if (isOutOfStock) {
    return (
      <TouchableOpacity
        style={[mergedStyles.actionButton, {backgroundColor: colors.LGray}]}
        disabled={true}
      >
        <Text style={mergedStyles.actionButtonText}>Out Of Stock</Text>
      </TouchableOpacity>
    );
  }

  if (shouldShowAddButton) {
    return (
      <TouchableOpacity
        style={[mergedStyles.actionButton, {backgroundColor: colors.DBlue}]}
        disabled={loading}
        onPress={handleAddToCart}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={mergedStyles.actionButtonText}>Add to Cart</Text>
            <Icon2
              name="add-shopping-cart"
              size={16}
              color="#fff"
              style={mergedStyles.cartIcon}
            />
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={mergedStyles.qtyControls}>
      <TouchableOpacity
        style={[
          mergedStyles.qtyButton,
          disableDecrement && styles.disabledButton,
        ]}
        onPress={handleDecrease}
        disabled={disableDecrement}
      >
        <Text
          style={[
            mergedStyles.qtyBtnText,
            {color: disableDecrement ? '#ccc' : '#000'},
          ]}
        >
          -
        </Text>
      </TouchableOpacity>

      <View style={mergedStyles.qtyBox}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.DBlue} />
        ) : (
          <Text style={mergedStyles.qtyCount}>{localQty}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          mergedStyles.qtyButton,
          localQty == itemStock && styles.disabledButton,
        ]}
        onPress={handleIncrease}
        disabled={localQty == itemStock}
      >
        <Text
          style={[
            mergedStyles.qtyBtnText,
            {color: localQty == itemStock ? '#ccc' : '#000'},
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartIcon: {
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.DBlue,
    borderRadius: 10,
    zIndex: 100,
  },
  qtyButton: {
    backgroundColor: colors.White,
    width: '25%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qtyBox: {
    backgroundColor: colors.White,
    width: '25%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.DBlue,
  },
});

export default memo(QuantitySelector);
