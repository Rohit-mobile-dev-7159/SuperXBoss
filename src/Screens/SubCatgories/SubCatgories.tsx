// Categories.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '../../Component/Index';
import {useNavigation} from '@react-navigation/native';
import {NavigationString} from '../../Constant/AllImports';
const {width} = Dimensions.get('window');

const categories = [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: '2',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47',
  },
  {
    id: '3',
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161b89bf2',
  },
  {
    id: '4',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228724-4c1d7ca2e0c5',
  },
  {
    id: '5',
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1534367610501-4c1c7c2e33ba',
  },
  {
    id: '6',
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
  },
];

const SubCategories = () => {
  const Navigation = useNavigation();
  const [data, setData] = useState<any[]>([]);
  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
  useEffect(() => {
    setTimeout(() => {
      setData(categories);
    }, 1500);
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <AnimatedButton
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.card}
      onPress={() => {
        Navigation.navigate(NavigationString.Product as never);
      }}
    >
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </AnimatedButton>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Sub Categories'} isIcons={true} />
      <View style={styles.container}>
        {data.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#444" />
          </View>
        ) : (
          <FlatList
            data={data}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SubCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    width: width / 2 - 24,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  name: {
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
