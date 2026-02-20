import React, {useCallback} from 'react';
import {Header} from '../../Component/Index';
import {colors} from '../../Constant/AllImports';
import {useFetchWishlistProduct} from '../../Services/Main/Hooks';
import ProductList from './Component/ProductList';
import {useFocusEffect} from '@react-navigation/native';
import {View} from 'react-native';
const WishListProduct = ({route}: any) => {
  const {data, isLoading, hasNextPage, fetchNextPage, refetch}: any =
    useFetchWishlistProduct();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [route]),
  );
  return (
    <View style={{flex: 1, backgroundColor: colors.White}}>
      <Header title={'Wishlist'} isIcons={true} />
      <ProductList
        data={data?._payload || []}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isPageRefresh={true}
      />
    </View>
  );
};

export default WishListProduct;
