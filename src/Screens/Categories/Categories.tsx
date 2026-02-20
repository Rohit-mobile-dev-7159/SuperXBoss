import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useFetchCategory} from "../../Services/Main/Hooks";
import ImagePath from "../../Constant/ImagePath";
import colors from "../../Style/Color";
import {Header} from "../../Component/Index";
import {useNavigation} from "@react-navigation/native";
import NavigationString from "../../Constant/NavigationString";
import LottieLoader from "../../Component/LottieLoader";

const {width, height} = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 20 * 2 - CARD_MARGIN) / 2;

const Categories = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  }: any = useFetchCategory({active: true, page_size: 10});

  const Navigation: any = useNavigation();

  // Custom Skeleton Loader Component
  const CategorySkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(10)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage}>
            <View style={styles.skeletonImageBorder} />
          </View>
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        Navigation.navigate(NavigationString.FilterPoroduct, {catId: item._id})
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.picture ? {uri: item.picture} : ImagePath.Default}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.imageBorder} />
      </View>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasNextPage) {
      return null;
    }
    return (
      <ActivityIndicator
        size="small"
        color={colors.DBlue}
        style={{marginVertical: 16}}
      />
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    if (!isRefetching) {
      refetch();
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
      testID="Categories"
    >
      <Header arrow={true} title={"Categories"} isIcons={true} />
      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <FlatList
          data={data?.result || []}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <LottieLoader url={require("../../lottie/Inventory.json")} />
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={[colors.DBlue]}
              tintColor={colors.DBlue}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.White,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    marginRight: CARD_MARGIN,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.White,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  logo: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  imageBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 8,
  },
  details: {
    width: "100%",
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.Black,
    textAlign: "center",
  },
  emptyContainer: {
    height: height - 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.LGray,
    marginTop: 16,
    fontWeight: "500",
  },
  // Skeleton Styles
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingTop: 8,
    justifyContent: "space-between",
  },
  skeletonCard: {
    width: "49%",
    marginBottom: 16,
  },
  skeletonImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
    position: "relative",
  },
  skeletonImageBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 8,
  },
  skeletonText: {
    height: 16,
    width: "70%",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    alignSelf: "center",
  },
});

export default Categories;
