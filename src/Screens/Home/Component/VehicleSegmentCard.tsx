import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import ImagePath from '../../../Constant/ImagePath';
import {useNavigation} from '@react-navigation/native';
import NavigationString from '../../../Constant/NavigationString';

const VehicleSegmentCard = ({data}: any) => {
  const Navigation: any = useNavigation();
  return (
    <View style={styles.container} testID="vehicle_segment">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Vehicle Segments</Text>
        <View style={styles.divider} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {data.map((segment: any, index: any) => (
          <View key={index} style={styles.cardWrapper}>
            <TouchableOpacity
              testID={`item_${segment._id}`}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => {
                Navigation.navigate(NavigationString.Product, {
                  filter: {segment: [segment._id].join(',')},
                });
              }}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={
                    segment.icon ? {uri: segment.icon} : ImagePath.Default
                  }
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.segmentName} numberOfLines={1}>
                {segment.name
                  .split(' ')
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(' ')}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: '#4a6da7',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2D3748',
    paddingLeft: 4,
  },
  scrollContainer: {
    paddingRight: 16,
    alignItems: 'center',
  },
  cardWrapper: {
    marginRight: 12,
    height: 120,
    justifyContent: 'center',
  },
  card: {
    width: 120,
    height: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginVertical: 5,
    padding: 20,
  },
  iconContainer: {
    marginBottom: 10,
    width: '100%',
    height: '100%',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  segmentName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#4A5568',
    fontWeight: '500',
    lineHeight: 16,
    width: '100%',
  },
});

export default VehicleSegmentCard;
