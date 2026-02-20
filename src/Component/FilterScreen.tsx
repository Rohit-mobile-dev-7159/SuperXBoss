// @ts-nocheck
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import React, {useEffect, useState} from "react";
import colors from "../Style/Color";
import Icon from "react-native-vector-icons/Ionicons";
import MainStyle from "../Styles/MainStyle";
import {useInfiniteQuery} from "@tanstack/react-query";
import {
  fetchBrandCategory,
  fetchBrands,
  fetchVehicles,
} from "../Services/Main/apis";
import {ScrollView} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../Constant/NavigationString";

// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const FilterScreen = props => {
  const {
    setSelectedYear,
    handleClear,
    setFiltersActive,
    setSelectedSpareBrandId,
    setCategoryIds,
    setSelectedVehicleIds,
    selectedBrandId,
    selectedVehicleIds,
    categoryIds,
    selectedSpareBrandId,
    setFilterValue,
    setSelectedBrandId,
    selectedYear,
    onClose,
    visible,
  } = props;
  const Navigation = useNavigation();

  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [spareBrands, setSpareBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showVehicleBrands, setShowVehicleBrands] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showSpareBrands, setShowSpareBrands] = useState(false);
  const [showYears, setShowYears] = useState(false);

  // Search state
  const [vehicleBrandSearch, setVehicleBrandSearch] = useState("");
  const [spareBrandSearch, setSpareBrandSearch] = useState("");
  const [vehicleModelSearch, setVehicleModelSearch] = useState("");
  const [categorisSearch, setCategorisSearch] = useState("");

  const debouncedVehicleSearch = useDebounce(vehicleBrandSearch);
  const debouncedSpareSearch = useDebounce(spareBrandSearch);
  const debouncedModelSearch = useDebounce(vehicleModelSearch);
  const debouncedCategoryModelSearch = useDebounce(categorisSearch);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      {length: currentYear - 1980 + 1},
      (_, i) => 1980 + i,
    ).reverse();
  };
  const years = generateYears();

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useInfiniteQuery({
      queryKey: ["fetchVehicleBrands", debouncedVehicleSearch],
      queryFn: async ({pageParam = 1}) => {
        const res = await fetchBrands({
          active: true,
          type: "Vehicle",
          page: pageParam,
          page_size: 15,
          search: debouncedVehicleSearch,
        });
        return {
          _payload: res._payload,
          page: res.pagination.page,
          totalPages: res.pagination.totalPages,
        };
      },
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      enabled: showVehicleBrands,
    });

  const {
    data: SBrands,
    fetchNextPage: fetchNextPage3,
    hasNextPage: hasNextPage3,
    isFetchingNextPage: isFetchingNextPage3,
    isLoading: isLoading3,
  } = useInfiniteQuery({
    queryKey: ["fetchSpareBrands", debouncedSpareSearch],
    queryFn: async ({pageParam = 1}) => {
      const res = await fetchBrands({
        active: true,
        type: "Spare Parts",
        page: pageParam,
        page_size: 15,
        search: debouncedSpareSearch,
      });
      return {
        _payload: res._payload,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
      };
    },
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: showSpareBrands,
  });

  const {
    data: vehiclesData,
    fetchNextPage: fetchNextPage2,
    hasNextPage: hasNextPage2,
    isFetchingNextPage: isFetchingNextPage2,
    isLoading: isLoading2,
  } = useInfiniteQuery({
    queryKey: ["fetchVehicles", selectedBrandId, debouncedModelSearch],
    queryFn: async ({pageParam = 1}) => {
      const res = await fetchVehicles(
        {
          active: true,
          page: pageParam,
          page_size: 15,
          search: debouncedModelSearch,
        },
        selectedBrandId,
      );
      return {
        _payload: res._payload,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
      };
    },
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: showVehicle && !!selectedBrandId,
  });

  const {
    data: categoryData,
    fetchNextPage: fetchNextPage4,
    hasNextPage: hasNextPage4,
    isFetchingNextPage: isFetchingNextPage4,
    isLoading: isLoading4,
  } = useInfiniteQuery({
    queryKey: [
      "fetchBrandCategory",
      selectedSpareBrandId,
      debouncedCategoryModelSearch,
    ],
    queryFn: async ({pageParam = 1}) => {
      const res = await fetchBrandCategory({
        page: pageParam,
        page_size: 15,
        search: debouncedCategoryModelSearch,
        brand_id: selectedSpareBrandId,
      });
      return {
        _payload: res._payload,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
      };
    },
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: showCategories && !!selectedSpareBrandId,
  });

  useEffect(() => {
    if (data?.pages) {
      const combined = data.pages.flatMap(page => page?._payload || []);
      setVehicleBrands(
        Array.from(new Map(combined.map(item => [item._id, item])).values()),
      );
    }
  }, [data]);

  useEffect(() => {
    if (vehiclesData?.pages) {
      const combined = vehiclesData.pages.flatMap(page => page?._payload || []);
      setVehicles(
        Array.from(new Map(combined.map(item => [item._id, item])).values()),
      );
    }
  }, [vehiclesData]);

  useEffect(() => {
    if (SBrands?.pages) {
      const combined = SBrands.pages.flatMap(page => page?._payload || []);
      setSpareBrands(
        Array.from(new Map(combined.map(item => [item._id, item])).values()),
      );
    }
  }, [SBrands]);
  useEffect(() => {
    if (categoryData?.pages) {
      const combined = categoryData.pages.flatMap(page => page?._payload || []);
      setCategories(
        Array.from(new Map(combined.map(item => [item._id, item])).values()),
      );
    }
  }, [categoryData]);

  const handleBrand = item => {
    setVehicles([]);
    setSelectedVehicleIds([]);
    setShowVehicle(false);
    setSelectedBrandId(item._id);
  };

  const handleSpareBrand = item => {
    setCategories([]);
    setShowCategories(false);
    setCategoryIds([]);
    setSelectedSpareBrandId(item._id);
  };

  const handleVehicleToggle = vehicleId => {
    setSelectedVehicleIds(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId],
    );
  };
  const handleCategoriesToggle = vehicleId => {
    setCategoryIds(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId],
    );
  };

  const renderCategory = (
    title,
    show,
    setShow,
    data,
    onPressItem,
    selectedId,
    isCheckbox = false,
    selectedIds = [],
    search = "",
    onChangeSearch = () => {},
  ) => (
    <View
      style={[
        styles.categoryContainer,
        {width: title == "Categories" ? "100%" : "100%"},
      ]}
    >
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setShow(prev => !prev)}
      >
        <Text style={styles.categoryTitle}>{title}</Text>
        <Icon
          name={show ? "chevron-up" : "chevron-down"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>
      {show && (
        <View style={[styles.dropdownContent, {maxHeight: 300}]}>
          {title != "Year" && (
            <View style={styles.searchBox}>
              <Icon name="search" size={16} color="#aaa" />
              <TextInput
                value={search}
                onChangeText={onChangeSearch}
                placeholder={"Search..."}
                style={styles.searchInput}
              />
            </View>
          )}
          <FlatList
            data={data}
            keyExtractor={item => item._id || item.toString()}
            nestedScrollEnabled={true}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => onPressItem(item)}
              >
                {isCheckbox ? (
                  <View
                    style={[
                      styles.checkbox,
                      selectedIds.includes(item._id) && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    {selectedIds.includes(item._id) && (
                      <Icon name="checkmark" size={14} color={colors.white} />
                    )}
                  </View>
                ) : (
                  <View style={styles.radioOuter}>
                    {selectedId === (item._id || item) && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                )}
                <Text style={styles.optionText}>{item.name || item}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => {
              if (data?.length < 10) {
                return;
              }
              if (
                title === "Vehicle Brands" &&
                hasNextPage &&
                !isFetchingNextPage
              ) {
                fetchNextPage();
              }
              if (
                title === "Vehicle Models" &&
                hasNextPage2 &&
                !isFetchingNextPage2
              ) {
                fetchNextPage2();
              }
              if (
                title === "Spare Part Brands" &&
                hasNextPage3 &&
                !isFetchingNextPage3
              ) {
                fetchNextPage3();
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ||
              isFetchingNextPage2 ||
              isFetchingNextPage3 ? (
                <ActivityIndicator color={colors.DBlue} size="small" />
              ) : null
            }
            ListEmptyComponent={
              isLoading || isLoading2 || isLoading3 ? (
                <ActivityIndicator />
              ) : (
                <Text>No data found</Text>
              )
            }
          />
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[MainStyle.flexBetween, styles.header]}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
        >
          <View style={styles.categoriesContainer}>
            {renderCategory(
              "Vehicle Brands",
              showVehicleBrands,
              setShowVehicleBrands,
              vehicleBrands,
              handleBrand,
              selectedBrandId,
              false,
              [],
              vehicleBrandSearch,
              setVehicleBrandSearch,
            )}
            {renderCategory(
              "Vehicle Models",
              showVehicle,
              setShowVehicle,
              vehicles,
              item => handleVehicleToggle(item._id),
              null,
              true,
              selectedVehicleIds,
              vehicleModelSearch,
              setVehicleModelSearch,
            )}
            {renderCategory(
              "Year",
              showYears,
              setShowYears,
              years,
              item => setSelectedYear(item),
              selectedYear,
            )}
            {renderCategory(
              "Spare Brands",
              showSpareBrands,
              setShowSpareBrands,
              spareBrands,
              handleSpareBrand,
              selectedSpareBrandId,
              false,
              [],
              spareBrandSearch,
              setSpareBrandSearch,
            )}
            {renderCategory(
              "Categories",
              showCategories,
              setShowCategories,
              categories,
              item => handleCategoriesToggle(item._id),
              null,
              true,
              categoryIds,
              categorisSearch,
              setCategorisSearch,
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.backdrop}]}
            onPress={() => {
              handleClear();
            }}
          >
            <Text style={styles.buttonText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={() => {
              let filter = {};
              if (selectedBrandId) {
                filter = {
                  ...filter,
                  brand_id: selectedBrandId,
                };
              }
              if (selectedSpareBrandId) {
                filter = {
                  ...filter,
                  spart_brand_id: selectedSpareBrandId,
                };
              }

              if (categoryIds.length) {
                filter = {
                  ...filter,
                  categories: categoryIds.join(","),
                };
              }
              if (selectedVehicleIds.length) {
                filter = {
                  ...filter,
                  vehicle: selectedVehicleIds.join(","),
                };
              }
              if (years) {
                filter = {
                  ...filter,
                  year: selectedYear,
                };
              }
              setFilterValue(filter);
              setFiltersActive(false);
            }}
          >
            <Text style={styles.buttonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.DGray,
    paddingBottom: 8,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 120,
    paddingHorizontal: 12,
  },
  categoryContainer: {
    width: "49%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dropdownContent: {
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    padding: 6,
    marginLeft: 6,
    fontSize: 14,
  },
});
