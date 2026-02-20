import * as React from "react";
import {createStackNavigator} from "@react-navigation/stack";

import Screens from "../Screens";
import NavigationString from "../Constant/NavigationString";
import colors from "../Style/Color";
import BottomTab from "./Bottom";

export default function MainStack() {
  const Stack = createStackNavigator();
  const option = {headerShown: false};

  const fadeTransition = {
    gestureDirection: "horizontal",
    transitionSpec: {
      open: {animation: "timing", config: {duration: 300}},
      close: {animation: "timing", config: {duration: 300}},
    },
    cardStyleInterpolator: ({current}) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: colors.White},
        ...fadeTransition,
      }}
    >
      <Stack.Screen
        name={NavigationString.Splash}
        component={Screens.Splash}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Login}
        component={Screens.Login}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Otp}
        component={Screens.Otp}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.UserInfo}
        component={Screens.UserInfo}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Home}
        component={BottomTab}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.ProductSearchScreen}
        component={Screens.ProductSearchScreen}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.SubCategories}
        component={Screens.SubCategories}
        options={option}
      />

      <Stack.Screen
        name={NavigationString.ProductDetail}
        component={Screens.ProductDetail}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Cart}
        component={Screens.Cart}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Brands}
        component={Screens.Brands}
        options={option}
      />

      <Stack.Screen
        name={NavigationString.WishListProduct}
        component={Screens.WishListProduct}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Wallet}
        component={Screens.Wallet}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.OrderHistory}
        component={Screens.OrderHistory}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.OrderHistoryDetail}
        component={Screens.OrderHistoryDetail}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.FilterPoroduct}
        component={Screens.FilterPoroduct}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.PaymentScreen}
        component={Screens.PaymentScreen}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.HelpSupport}
        component={Screens.HelpSupport}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.WalletHistory}
        component={Screens.WalletHistory}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Faqs}
        component={Screens.Faqs}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Offers}
        component={Screens.Offers}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.PrivacyPolicy}
        component={Screens.PrivacyPolicy}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.TermsCondition}
        component={Screens.TermsCondition}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.Product}
        component={Screens.Product}
        options={option}
      />
      <Stack.Screen
        name={NavigationString.FilterPage}
        component={Screens.FilterPage}
        options={option}
      />
    </Stack.Navigator>
  );
}
