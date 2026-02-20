// @ts-nocheck
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {
  fetchAllBrandProduct,
  fetchBrandCategory,
  fetchBrands,
  fetchVehicles,
  fetchVehicleSegment,
} from "../../Services/Main/apis";
import colors from "../../Style/Color";
import MainStyle from "../../Styles/MainStyle";
import {useNavigation} from "@react-navigation/native";
import ProductList from "../Product/Component/ProductList";
import LinearGradient from "react-native-linear-gradient";
import {useSafeAreaInsets} from "react-native-safe-area-context";

//  Types
interface FilterScreenProps {
  setSelectedYear: (year: number | null) => void;
  handleClear: () => void;
  setFiltersActive: (val: boolean) => void;
  setSelectedSpareBrandId: (id: string | null) => void;
  setCategoryIds: (ids: string[]) => void;
  setSelectedVehicleIds: (ids: string[]) => void;
  setFilterValue: (filter: Record<string, any>) => void;
  setSelectedBrandId: (id: string | null) => void;
  selectedYear: number | null;
  selectedBrandId: string | null;
  selectedVehicleIds: string[];
  categoryIds: string[];
  selectedSpareBrandId: string | null;
}

//  debounce hook
const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const FilterScreen: React.FC<FilterScreenProps> = props => {
  const [filtersActive, setFiltersActive] = useState(false);
  const [sortActive, setSortActive] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [categoryIds, setCategoryIds] = useState<any[]>([]);
  const [selectedSpareBrandId, setSelectedSpareBrandId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectSegement, setSelectSegement] = useState(null);
  const {data: segments, refetch: refetchSegments} = useQuery({
    queryKey: ["fetchVehicleSegment", selectedVehicleIds],
    queryFn: () =>
      fetchVehicleSegment({
        status: true,
        page: 1,
        page_size: 20,
      }),
    enabled: !!selectedVehicleIds.length,
  });

  const Navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [vehicleBrands, setVehicleBrands] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [spareBrands, setSpareBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [segment, setSegment] = useState<any[]>([]);

  const [showVehicleBrands, setShowVehicleBrands] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showSpareBrands, setShowSpareBrands] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showSegment, setShowSegment] = useState(false);

  const [vehicleBrandSearch, setVehicleBrandSearch] = useState("");
  const [spareBrandSearch, setSpareBrandSearch] = useState("");
  const [vehicleModelSearch, setVehicleModelSearch] = useState("");
  const [categorisSearch, setCategorisSearch] = useState("");

  const debouncedVehicleSearch = useDebounce(vehicleBrandSearch);
  const debouncedSpareSearch = useDebounce(spareBrandSearch);
  const debouncedModelSearch = useDebounce(vehicleModelSearch);
  const debouncedCategoryModelSearch = useDebounce(categorisSearch);
  const [isLoading6, setIsLoading6] = useState(false);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      {length: currentYear - 1980 + 1},
      (_, i) => 1980 + i,
    ).reverse();
  };
  const years = generateYears();

  // 🔹 Queries
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
  const [enable, setEnable] = useState(false);
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const {
    data: products,
    fetchNextPage: fetchNextPage5,
    hasNextPage: hasNextPage5,
    isFetchingNextPage: isFetchingNextPage5,
    isLoading: isLoading5,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["fetchAllBrandProduct", enable, reload],
    queryFn: async ({pageParam = 1}) => {
      const res = await fetchAllBrandProduct({
        page: pageParam,
        page_size: 10,
        ...filters,
      });

      setIsLoading6(false);
      return {
        _payload: res._payload,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
      };
    },
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: enable,
  });
  const [productData, setProductData] = useState([]);
  const handleSubmit = async filter => {
    setIsLoading6(true);
    setProductData([]);
    setEnable(true);
    setReload(prev => !prev);
    setFilters(filter);
    // refetch()
  };
  useEffect(() => {
    const fetchProduct = () => {
      try {
        if (products?.pages) {
          setProductData(products.pages.flatMap(page => page?._payload || []));
        }
      } catch (error) {
      } finally {
        setIsLoading6(false);
      }
    };
    fetchProduct();
  }, [products]);

  const handleClear = () => {
    setSelectedBrandId(null);
    setSelectedVehicleIds([]);
    setCategoryIds([]);
    setSelectedSpareBrandId(null);
    setSelectedYear(null);
    setFiltersActive(false);
    setEnable(false);
    setFilters({});
    setProductData([]);
  };
  // 🔹 Set state after query
  useEffect(() => {
    if (data?.pages) {
      setVehicleBrands(data.pages.flatMap(page => page?._payload || []));
    }
  }, [data]);

  useEffect(() => {
    if (vehiclesData?.pages) {
      setVehicles(vehiclesData.pages.flatMap(page => page?._payload || []));
    }
  }, [vehiclesData]);

  useEffect(() => {
    if (SBrands?.pages) {
      setSpareBrands(SBrands.pages.flatMap(page => page?._payload || []));
    }
  }, [SBrands]);

  useEffect(() => {
    if (categoryData?.pages) {
      setCategories(categoryData.pages.flatMap(page => page?._payload || []));
    }
  }, [categoryData]);

  useEffect(() => {
    setFilters([]);
    setProductData([]);
  }, []);
  // 🔹 reusable category renderer
  const renderCategory = (
    title: string,
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    data: any[],
    onPressItem: (item: any) => void,
    selectedId: string | number | null,
    isCheckbox = false,
    selectedIds: (string | number)[] = [],
    search = "",
    onChangeSearch: (val: string) => void = () => {},
  ) => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setShow(prev => !prev)}
      >
        <Text style={styles.categoryTitle}>{title}</Text>
        <Icon
          name={show ? "chevron-up" : "chevron-down"}
          size={22}
          color={colors.primary}
        />
      </TouchableOpacity>
      {show && (
        <View style={styles.dropdownContent}>
          {title !== "Year" && (
            <View style={styles.searchBox}>
              <Icon name="search" size={18} color="#aaa" />
              <TextInput
                value={search}
                onChangeText={onChangeSearch}
                placeholder={`Search ${title}...`}
                style={styles.searchInput}
              />
            </View>
          )}
          <FlatList
            data={data}
            keyExtractor={item => item._id || item.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
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
                title === "Spare Brands" &&
                hasNextPage3 &&
                !isFetchingNextPage3
              ) {
                fetchNextPage3();
              }
              if (
                title === "Categories" &&
                hasNextPage4 &&
                !isFetchingNextPage4
              ) {
                fetchNextPage4();
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              (isFetchingNextPage ||
                isFetchingNextPage2 ||
                isFetchingNextPage3 ||
                isFetchingNextPage4) && (
                <ActivityIndicator color={colors.primary} size="small" />
              )
            }
            ListEmptyComponent={
              isLoading || isLoading2 || isLoading3 || isLoading4 ? (
                <ActivityIndicator />
              ) : (
                <Text style={{textAlign: "center", padding: 10, color: "#777"}}>
                  No data found
                </Text>
              )
            }
          />
        </View>
      )}
    </View>
  );
  useEffect(() => {
    if (!selectedVehicleIds.length && showVehicle) {
      setSelectSegement(null);
    }
  }, [selectedVehicleIds]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Filters */}
      <ScrollView contentContainerStyle={{paddingBottom: 50}}>
        <View>
          <LinearGradient
            colors={["rgba(27, 75, 102, 0.8)", "rgba(76, 115, 138, 0.2)"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{paddingTop: insets.top, paddingBottom: 20}}
          >
            <View style={[styles.header]}>
              <TouchableOpacity
                onPress={() => {
                  Navigation.goBack();
                }}
              >
                <Icon name="arrow-back" color={colors.White} size={25} />
              </TouchableOpacity>
              <Text style={styles.title}>Find Part By Vehicle Or Spare</Text>
            </View>
            <View style={styles.categoriesWrapper}>
              {renderCategory(
                "Vehicle Brands",
                showVehicleBrands,
                setShowVehicleBrands,
                vehicleBrands,
                item => {
                  setSelectedBrandId(item._id);
                  setVehicles([]);
                  setSelectedVehicleIds([]);
                  setShowVehicle(false);
                  setSelectedYear(null);
                  setShowYears(false);
                },
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
                item =>
                  setSelectedVehicleIds(prev =>
                    prev.includes(item._id)
                      ? prev.filter(id => id !== item._id)
                      : [...prev, item._id],
                  ),
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
                "Segments",
                showSegment,
                setShowSegment,
                segments?._payload || [],
                item => setSelectSegement(item._id),
                selectSegement,
              )}

              {renderCategory(
                "Spare Brands",
                showSpareBrands,
                setShowSpareBrands,
                spareBrands,
                item => {
                  setSelectedSpareBrandId(item._id);
                  setCategories([]);
                  setCategoryIds([]);
                  setShowCategories(false);
                },
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
                item =>
                  setCategoryIds((prev: any) =>
                    prev.includes(item._id)
                      ? prev.filter(id => id !== item._id)
                      : [...prev, item._id],
                  ),
                null,
                true,
                categoryIds,
                categorisSearch,
                setCategorisSearch,
              )}
            </View>
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.clearBtn]}
                onPress={handleClear}
              >
                <Text style={[styles.buttonText, {color: colors.primary}]}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.applyBtn,
                  {
                    backgroundColor:
                      selectedBrandId || selectedSpareBrandId
                        ? colors.DBlue
                        : colors.DGray,
                  },
                ]}
                disabled={
                  selectedBrandId || selectedSpareBrandId ? false : true
                }
                onPress={() => {
                  let filter: Record<string, any> = {};
                  if (selectedBrandId) {
                    filter.brand_id = selectedBrandId;
                  }
                  if (selectedSpareBrandId) {
                    filter.spart_brand = selectedSpareBrandId;
                  }
                  if (categoryIds.length) {
                    filter.categories = categoryIds.join(",");
                  }
                  if (selectedVehicleIds.length) {
                    filter.vehicle = selectedVehicleIds.join(",");
                  }
                  if (selectedYear) {
                    filter.year = selectedYear;
                  }
                  if (selectSegement) {
                    filter.segment = selectSegement;
                  }
                  handleSubmit(filter);
                }}
              >
                <Text style={styles.buttonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {isLoading6 ? (
          <View style={{height: 50, justifyContent: "center", alignItems: "c"}}>
            <ActivityIndicator size={"small"} color={colors.DBlue} />
          </View>
        ) : (
          productData?.length > 0 && (
            <View>
              {productData?.length > 0 && (
                <View
                  style={[
                    MainStyle.flexBetween,
                    {paddingHorizontal: 20, marginTop: 20},
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.DBlue,
                      fontWeight: "600",
                    }}
                  >
                    Products
                  </Text>
                  {/* <Text style={{}}>found: 10/100</Text> */}
                </View>
              )}
              <ProductList
                data={productData || []}
                refetch={refetch}
                fetchNextPage={fetchNextPage5}
                hasNextPage={hasNextPage5}
                isLoading={isLoading5}
              />
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  header: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.White,
    textAlign: "center",
  },
  categoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  categoryCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#f7f7f7",
  },
  categoryTitle: {fontSize: 15, fontWeight: "600", color: "#333"},
  dropdownContent: {
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    zIndex: 200,
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
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
  optionText: {fontSize: 12, color: "#333"},
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fafafa",
  },
  searchInput: {flex: 1, padding: 6, marginLeft: 6, fontSize: 14},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  clearBtn: {backgroundColor: "#f2f2f2"},
  applyBtn: {backgroundColor: colors.primary},
  buttonText: {fontWeight: "600", fontSize: 15, color: colors.white},
});
