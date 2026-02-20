import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import {Header} from '../../Component/Index';
import {colors} from '../../Constant/AllImports';
import {useFetchAllBrandProduct} from '../../Services/Main/Hooks';
import ProductList from './Component/ProductList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FilterScreen from '../../Component/FilterScreen';
interface type {
  brand_id: string;
  spart_brand_id: string;
  vehicle: string[];
  year: number | '';
  categories: string[];
}
const FilterPoroduct = ({route}: any) => {
  const {segment = '', brandId, spare_brand_id, catId} = route?.params;
  const [filtersActive, setFiltersActive] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [categoryIds, setCategoryIds] = useState<any[]>([]);
  const [selectedSpareBrandId, setSelectedSpareBrandId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterValue, setFilterValue] = useState<type>({
    brand_id: '',
    vehicle: [],
    year: '',
    categories: [],
    spart_brand_id: '',
  });
  const handleSubmit = () => {
    const {brand_id, vehicle, year, categories, spart_brand_id} = filterValue;
    let filter = {};
    if (brand_id) {
      filter = {
        brand_id: [brand_id]?.join(','),
      };
    }
    if (spart_brand_id) {
      filter = {
        spart_brand: [spart_brand_id].join(','),
      };
    }

    if (categories?.length) {
      filter = {
        ...filter,
        categories: categories,
      };
    }
    if (vehicle?.length) {
      filter = {
        ...filter,
        vehicle: vehicle,
      };
    }
    if (year) {
      filter = {
        ...filter,
        year: year,
      };
    }
    return filter;
  };
  useEffect(() => {
    if (brandId) {
      setSelectedBrandId(brandId);
      setFilterValue(prev => {
        return {
          ...prev,
          brand_id: brandId,
        };
      });
    }
    if (spare_brand_id) {
      setSelectedSpareBrandId(spare_brand_id);
      setFilterValue(prev => {
        return {
          ...prev,
          spart_brand_id: spare_brand_id,
        };
      });
    }
    if (catId) {
      setCategoryIds([catId]);
      setFilterValue(prev => {
        return {
          ...prev,
          categories: catId,
        };
      });
    }
  }, [brandId, catId]);
  const userFilter = handleSubmit();

  const handleClear = () => {
    setFilterValue({
      brand_id: '',
      vehicle: [],
      year: '',
      categories: [],
      spart_brand_id: '',
    });
    setSelectedBrandId(null);
    setSelectedVehicleIds([]);
    setCategoryIds([]);
    setSelectedSpareBrandId(null);
    setSelectedYear(null);
    setFiltersActive(false);
  };
  const toggleFilters = () => {
    setFiltersActive(true);
  };

  const onClose = () => {
    setFiltersActive(false);
  };
  const {data, isLoading, hasNextPage, fetchNextPage, refetch}: any =
    useFetchAllBrandProduct({...userFilter, segment});

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.White}}>
      <Header title={'Products '} isIcons={true} />

      <ProductList
        data={data?.result || []}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
      />

      {filtersActive && (
        <FilterScreen
          {...{
            handleSubmit,
            setSelectedYear,
            handleClear,
            setSelectedSpareBrandId,
            setCategoryIds,
            setSelectedVehicleIds,
            selectedBrandId,
            selectedVehicleIds,
            categoryIds,
            selectedSpareBrandId,
            setFilterValue,
            setFiltersActive,
            setSelectedBrandId,
            selectedYear,
            onClose: onClose,
            visible: filtersActive,
          }}
        />
      )}

      {/* Bottom Floating Action Bar */}
      {!catId && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton} onPress={toggleFilters}>
            <Icon name="filter-alt" size={20} color={colors.Black} />
            <Text style={styles.bottomButtonText}>FILTER</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.White,
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 10,
    zIndex: 20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    color: colors.Black,
  },
});

export default FilterPoroduct;
