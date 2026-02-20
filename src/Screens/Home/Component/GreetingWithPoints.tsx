import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../Style/Color';
import MainStyle from '../../../Styles/MainStyle';
import {useFetchUserProfile} from '../../../Services/Main/Hooks';
import {useNavigation} from '@react-navigation/native';
import NavigationString from '../../../Constant/NavigationString';

const GreetingWithPoints = () => {
  const Navigation: any = useNavigation();
  const [timeGreeting, setTimeGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState('weather-sunny');

  const {data} = useFetchUserProfile();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingIcon('weather-sunny');
      setTimeGreeting('Good Morning');
      return 'Good Morning';
    }
    if (hour < 17) {
      setGreetingIcon('weather-sunset');
      setTimeGreeting('Good Afternoon');
      return 'Good Afternoon';
    }
    if (hour < 24) {
      setGreetingIcon('weather-night-partly-cloudy');
      setTimeGreeting('Good Evening');
      return 'Good Evening';
    }
    setGreetingIcon('weather-night');
    return 'Good Night';
  };
  useEffect(() => {
    getTimeGreeting();
    const interval = setInterval(() => getTimeGreeting(), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container} testID="greet">
      <View style={styles.greetingRow}>
        <Icon
          name={greetingIcon}
          size={24}
          color={colors.primary}
          style={styles.icon}
        />
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{timeGreeting}, </Text>
          <Text style={styles.userName}>{data?._payload?.name}</Text>
        </View>
      </View>

      <View style={[MainStyle.flexRow, {gap: 10}]}>
        <View style={styles.pointsContainer}>
          <Icon
            name="trophy-award"
            size={20}
            color={colors.DBlue}
            style={styles.pointsIcon}
          />
          <Text style={styles.pointsLabel}>Points: </Text>
          <Text testID="point" style={styles.pointsValue}>
            {data?._payload?.points || 0}
          </Text>
        </View>
        <TouchableOpacity
          testID="go_wallet"
          style={styles.pointsContainer}
          onPress={() => {
            Navigation.navigate(NavigationString.Wallet);
          }}
          activeOpacity={1}
        >
          <Icon
            name="wallet"
            size={20}
            color={colors.DBlue}
            style={styles.pointsIcon}
          />
          <Text style={styles.pointsLabel}>Wallet: </Text>
          <Text style={styles.pointsValue}>
            ₹{data?._payload?.wallet_amount || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    margin: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(51, 51, 51, 0.9)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(51, 51, 51, 0.95)',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pointsIcon: {
    marginRight: 6,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(102, 102, 102, 0.8)',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(76, 175, 80, 0.9)',
  },
});

export default GreetingWithPoints;
