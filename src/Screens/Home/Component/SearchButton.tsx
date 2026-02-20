import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../Style/Color';

interface SearchButtonProps {
  onPress: () => void;
  placeholderOptions?: string[];
  interval?: number;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onPress,
  placeholderOptions = [],
  interval = 2000,
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const placeholders =
    placeholderOptions.length > 0
      ? placeholderOptions
      : ['Brands', 'Products', 'Styles', 'Offers'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, interval);

    return () => clearInterval(timer);
  }, [placeholders.length, interval]);

  return (
    <TouchableOpacity
      testID="search"
      onPress={onPress}
      style={styles.searchContainer}
      activeOpacity={0.8}
    >
      <View style={styles.searchInner}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.placeholderText}>
          Search {placeholders[currentPlaceholderIndex]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '60%',
    height: 40,
    backgroundColor: colors.White,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  placeholderText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  cameraIcon: {
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
});

export default SearchButton;
