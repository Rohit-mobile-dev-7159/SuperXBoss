import React, {useEffect, useState} from "react";
import {TouchableOpacity, ActivityIndicator} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useUpdateWishlist} from "../../../Services/Main/Hooks";

interface WishlistButtonProps {
  productId: string;
  status: boolean;
  iconSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  isPageRefresh?: boolean;
  refetch?: any;
}

const WishlistButton = ({
  productId,
  status,
  iconSize = 20,
  activeColor = "red",
  inactiveColor = "gray",
  isPageRefresh = false,
  refetch,
}: WishlistButtonProps) => {
  const [isWishlist, setIsWishlist] = useState(status);
  const [isLoading, setIsLoading] = useState(false);

  const {mutate} = useUpdateWishlist();

  const updateWishlist = () => {
    if (isLoading) {
      return;
    }
    const previousState = isWishlist;
    setIsWishlist(!isWishlist);
    setIsLoading(true);

    mutate(
      {product: productId},
      {
        onSuccess: res => {
          setIsLoading(false);
          if (!res.success) {
            setIsWishlist(previousState); // rollback
          } else {
            setIsWishlist(res._payload.isAdded || false);
          }
          if (isPageRefresh) {
            refetch();
          }
        },
        onError: () => {
          setIsWishlist(previousState); // rollback
          setIsLoading(false);
        },
      },
    );
  };

  useEffect(() => {
    setIsWishlist(status);
  }, [status]);

  return (
    <TouchableOpacity
      testID="wishlist-1"
      onPress={updateWishlist}
      style={{padding: 5}}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator testID="loader" size="small" color={inactiveColor} />
      ) : (
        <AntDesign
          testID="icon-1"
          name={isWishlist ? "heart" : "hearto"}
          size={iconSize}
          color={isWishlist ? activeColor : inactiveColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(WishlistButton);
