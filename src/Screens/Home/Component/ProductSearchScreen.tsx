// ProductSearchScreen.tsx
import React, {useEffect, useRef, useState, useCallback} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {debounce} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {fetchAllProduct} from "../../../Services/Main/apis";
import NavigationString from "../../../Constant/NavigationString";
import {useDispatch, useSelector} from "react-redux";
import {
  addRecentSearch,
  clearRecentSearch,
  selectRecentSearches,
} from "../../../Redux/Slices/searchSlice";

interface Product {
  _id: string;
  name: string;
  brand: {
    name: string;
  };
}

interface RecentSearch {
  _id: string;
  name: string;
}

const ProductSearchScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const recentSearches = useSelector(selectRecentSearches);

  const {data, isLoading, refetch} = useQuery({
    queryKey: ["searchProducts", searchQuery],
    queryFn: () => fetchAllProduct({search: searchQuery}),
    enabled: false,
  });

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim() === "") {
        setFilteredProducts([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      refetch().then(() => {
        setIsSearching(false);
      });
    }, 500),
    [refetch],
  );

  useEffect(() => {
    if (data?._payload) {
      setFilteredProducts(data._payload);
    }
  }, [data, dispatch]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const handleProductPress = (product: Product) => {
    dispatch(addRecentSearch({_id: product._id, name: product.name}));
    setSearchQuery("");
    navigation.navigate(NavigationString.ProductDetail, {
      productId: product._id,
    });
  };

  const handleRecentSearchPress = (searchItem: RecentSearch) => {
    navigation.navigate(NavigationString.ProductDetail, {
      productId: searchItem._id,
    });
    setSearchQuery("");
  };

  const clearRecentSearches = () => {
    dispatch(clearRecentSearch());
  };

  // const removeRecentSearch = (id: string) => {
  //   // Implement if you have removeRecentSearch action in your slice
  //   dispatch(removeRecentSearch({id}));
  // };

  const renderProductItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.brandName} numberOfLines={1}>
          {item.brand.name}
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderRecentSearchItem = ({item}: {item: RecentSearch}) => (
    <TouchableOpacity
      testID={`recent_${item._id}`}
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Icon
        name="time-outline"
        size={18}
        color="#666"
        style={styles.clockIcon}
      />
      <Text style={styles.recentSearchText} numberOfLines={1}>
        {item.name}
      </Text>
      {/* <TouchableOpacity onPress={() => removeRecentSearch(item._id)}>
        <Icon name="close" size={18} color="#999" />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (isSearching || isLoading) {
      return <ActivityIndicator size="large" style={styles.loader} />;
    }

    if (searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="search-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      );
    }

    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentSearchesHeader}>
          {recentSearches?.length > 0 && (
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          )}
          {recentSearches?.length > 0 && (
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
        {recentSearches?.length > 0 ? (
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearchItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.recentListContent}
          />
        ) : (
          <View style={styles.noRecentContainer}>
            <Icon name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No recent searches</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      testID={"search"}
      style={[styles.container, {opacity: fadeAnim}]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="go_back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          testID="search_input"
          style={styles.input}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            testID="empty_search"
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      <FlatList
        testID="list"
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
};

export default ProductSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    marginBottom: 16,
    height: 48,
  },
  backButton: {
    paddingRight: 8,
  },
  clearButton: {
    paddingLeft: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    height: "100%",
    color: "#333",
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  brandName: {
    fontSize: 13,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noRecentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  loader: {
    marginTop: 40,
  },
  recentSearchesContainer: {
    flex: 1,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearText: {
    fontSize: 14,
    color: "#666",
  },
  recentListContent: {
    paddingBottom: 20,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  clockIcon: {
    marginRight: 12,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginRight: 12,
  },
});
