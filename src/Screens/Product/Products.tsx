import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import {Header} from "../../Component/Index";
import {colors, NavigationString} from "../../Constant/AllImports";
import {useFetchAllProduct} from "../../Services/Main/Hooks";
import ProductList from "./Component/ProductList";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
const Product = ({route}: any) => {
  const {filter} = route?.params;
  const Navigation: any = useNavigation();
  const {data, refetch, fetchNextPage, hasNextPage, isLoading}: any =
    useFetchAllProduct({...filter, page: 1, page_size: 15});

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.White}}>
      <Header title={"Products "} isIcons={true} />
      <ProductList
        data={data?.result || []}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
      />
      {
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => {
              Navigation.navigate(NavigationString.FilterPage);
            }}
          >
            <Icon name="filter-alt" size={20} color={colors.Black} />
            <Text style={styles.bottomButtonText}>FILTER</Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.White,
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-around",
    paddingVertical: 10,
    elevation: 10,
    zIndex: 20,
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    color: colors.Black,
  },
});

export default Product;
