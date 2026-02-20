import React, {memo} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import ImagePath from "../../../Constant/ImagePath";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../../../Constant/NavigationString";
import colors from "../../../Style/Color";

const CategorySlider = ({data}: any) => {
  const Navigation: any = useNavigation();

  const CategoryCard = ({item}: any) => {
    return (
      <TouchableOpacity
        testID={`item_${item._id}`}
        style={styles.categoryCard}
        activeOpacity={1}
        onPress={() => {
          Navigation.navigate(NavigationString.Product, {
            filter: {categories: item._id},
          });
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.picture ? {uri: item.picture} : ImagePath.Default}
            style={styles.categoryImage}
            resizeMode="contain" // ensures image fits properly
          />
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} testID="category">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Top Categories</Text>
        <View style={styles.divider} />
      </View>

      <FlatList
        data={data || []}
        renderItem={({item}) => <CategoryCard item={item} />}
        keyExtractor={item => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <TouchableOpacity
            testID="footer"
            style={styles.viewAllButton}
            activeOpacity={0.7}
            onPress={() => {
              Navigation.navigate(NavigationString.Categories);
            }}
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingBottom: 25,
  },
  headerContainer: {
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: "#4a6da7",
    borderRadius: 2,
  },
  listContainer: {
    paddingRight: 8,
  },
  categoryCard: {
    width: 75,
    marginRight: 8,
    alignItems: "center",
  },
  imageContainer: {
    width: 75,
    height: 75,
    backgroundColor: colors.White,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    color: "#444",
    lineHeight: 16,
    paddingHorizontal: 2,
  },
  viewAllButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe8f7ff",
    borderRadius: 10,
    marginLeft: 4,
  },
  viewAllText: {
    color: "#4a6da7",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default memo(CategorySlider);
