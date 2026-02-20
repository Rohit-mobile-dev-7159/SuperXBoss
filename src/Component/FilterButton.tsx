import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../Style/Color';
import NavigationString from '../Constant/NavigationString';
const FilterButton = () => {
  const Navigation: any = useNavigation();
  return (
    <TouchableOpacity
      testID="filter-button"
      onPress={() => {
        Navigation.navigate(NavigationString.FilterPage);
      }}
      activeOpacity={1}
      style={{
        width: 50,
        height: 50,
        backgroundColor: colors.primaryLight,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 20,
        bottom: 20,
        right: 10,
      }}
    >
      <Icon3 name="filter" color={colors.White} size={25} />
      <Text style={{color: colors.White, fontSize: 10, marginTop: -5}}>
        Fiters
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;
