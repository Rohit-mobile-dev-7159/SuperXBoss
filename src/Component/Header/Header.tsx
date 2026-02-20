import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {colors, FontsFamily, NavigationString} from '../../Constant/AllImports';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {Badge} from 'react-native-paper';
import ImagePath from '../../Constant/ImagePath';

const Header = (props: any) => {
  const navigation = useNavigation();
  const cart = useSelector((state: any) => state.cart.cartProducts);
  // Calculate total items in cart (sum of all quantities)
  const cartCount = Object.keys(cart)?.length;

  return (
    <View
      style={[
        styles.Wrapper,
        {
          paddingHorizontal: moderateScale(10),
          backgroundColor: 'white',
          zIndex: 11,
          elevation: 1,
          paddingTop: 35,
          paddingBottom: 10,
        },
      ]}
    >
      <View style={styles.Wrapper}>
        {props.isDrawer ? (
          <TouchableOpacity>
            <ImagePath.Icon.HumBurger style={{marginTop: 8}} />
          </TouchableOpacity>
        ) : (
          !props?.arrow && (
            <TouchableOpacity
              testID="GoBack"
              onPress={() => navigation.goBack()}
            >
              <ImagePath.BackArrow
                style={{marginTop: 8}}
                width={18}
                height={18}
              />
            </TouchableOpacity>
          )
        )}
        <Text style={styles.HeaderText}>{props.title}</Text>
      </View>

      <View style={styles.Wrapper}>
        {props.isIcons && (
          <>
            <TouchableOpacity
              testID="Search"
              onPress={() => {
                navigation.navigate(
                  NavigationString.ProductSearchScreen as never,
                );
              }}
            >
              <ImagePath.Icon.Search />
            </TouchableOpacity>

            <TouchableOpacity
              testID="WishList"
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate(NavigationString.WishListProduct as never)
              }
            >
              <ImagePath.Icon.HeartFill />
              {/* Heart badge can be added here if needed */}
            </TouchableOpacity>

            <TouchableOpacity
              testID="Cart"
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate(NavigationString.Cart as never)
              }
            >
              <ImagePath.Icon.Cart />
              {cartCount > 0 && (
                <Badge style={styles.badge} size={20}>
                  {cartCount}
                </Badge>
              )}
            </TouchableOpacity>

            {props.isNotification && (
              <TouchableOpacity style={styles.iconContainer}>
                <ImagePath.Icon.Notification />
                {/* Notification badge can be added here if needed */}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default memo(Header);

const styles = StyleSheet.create({
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    paddingHorizontal: 5,
  },
  HeaderText: {
    fontFamily: FontsFamily.poppinsBold,
    fontSize: 18,
    fontWeight: '600', // Note: fontWeight should be string in React Native
    color: colors.DBlue,
    marginTop: 10,
  },
  iconContainer: {
    position: 'relative',
    padding: 5, // Add some padding for better touch area
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: colors.DBlue, // Use your theme color
    color: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: 'red',
  },
});
