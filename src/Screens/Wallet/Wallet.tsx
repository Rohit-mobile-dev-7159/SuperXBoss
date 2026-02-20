import React, {useCallback, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import {
  useFetchUserProfile,
  useRechargeWallet,
  useRechargeWalletVerify,
} from "../../Services/Main/Hooks";
import RazorpayCheckout from "react-native-razorpay";
import {showErrorAlert, showToast} from "../../Constant/ShowDailog";
import MainStyle from "../../Styles/MainStyle";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import NavigationString from "../../Constant/NavigationString";
const {width} = Dimensions.get("window");
const colors = {
  primary: "#1B4B66",
  primaryLight: "#2D7A9C",
  primaryDark: "#0F2D3F",
  secondary: "#FF8C4B",
  accent: "#FFD166",
  background: "#F5F5F5",
  textLight: "#FFFFFF",
  textDark: "#333333",
  cardGradientStart: "#1B4B66",
  cardGradientEnd: "#2D7A9C",
};
const Wallet = () => {
  const Navigation: any = useNavigation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const {data: userProfile, refetch} = useFetchUserProfile();
  const {mutate} = useRechargeWallet();
  const {mutate: rechargeVerifyMutate} = useRechargeWalletVerify();
  // Animation values
  const cardRotation = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const rechargePanelHeight = useSharedValue(0);
  const rechargePanelOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const rechargeAmounts = [100, 200, 500, 1000, 1500, 2000];

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      cardRotation.value,
      [0, 1],
      [0, 10],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        {perspective: 1000},
        {rotateY: `${rotateY}deg`},
        {scale: cardScale.value},
      ],
    };
  });

  const animatedRechargePanelStyle = useAnimatedStyle(() => {
    return {
      height: rechargePanelHeight.value,
      opacity: rechargePanelOpacity.value,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: buttonScale.value}],
    };
  });

  const handleRechargePress = () => {
    if (isRecharging) {
      // Close panel
      rechargePanelHeight.value = withTiming(0, {duration: 300});
      rechargePanelOpacity.value = withTiming(0, {duration: 200});
      cardScale.value = withSpring(1);
      setShowCustomInput(false);
      setCustomAmount("");
    } else {
      // Open panel
      rechargePanelHeight.value = withTiming(400, {duration: 400});
      rechargePanelOpacity.value = withTiming(1, {duration: 300});
      cardScale.value = withSpring(0.95);
    }
    setIsRecharging(!isRecharging);
    setIsLoading(false);
  };

  const handleOfferPress = () => {
    Navigation.navigate(NavigationString.Offers);
  };
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setShowCustomInput(false);

    // Card animation when amount is selected
    cardRotation.value = withTiming(1, {duration: 200}, () => {
      cardRotation.value = withTiming(0, {duration: 200});
    });
  };

  const handleCustomAmountSelect = () => {
    if (
      !customAmount ||
      isNaN(+customAmount) ||
      parseFloat(customAmount) <= 0
    ) {
      return;
    }

    const amount = parseFloat(customAmount);
    setSelectedAmount(amount);

    // Card animation when amount is selected
    cardRotation.value = withTiming(1, {duration: 200}, () => {
      cardRotation.value = withTiming(0, {duration: 200});
    });
  };

  const handleConfirmRecharge = () => {
    if (!selectedAmount) {
      return;
    }
    setIsLoading(true);
    mutate(
      {amount: selectedAmount},
      {
        onSuccess: res => {
          if (res.success) {
            const options: any = {
              description: `Payment for order ${res?._payload?.orderId}`,
              // image: require('../../Images/ic_launcher.png'),
              currency: "INR",
              key: "rzp_test_FJbZTaMr0yy4pM",
              amount: selectedAmount * 100,
              name: "SuperXBoss",
              order_id: res?._payload?.orderId || "",
              prefill: {
                email: userProfile?._payload?.email,
                contact: userProfile?._payload?.mobile,
                name: userProfile?._payload?.name,
              },
              theme: {color: colors.primary},
            };

            RazorpayCheckout.open(options)
              .then(data => {
                console.log("Payment Success:", JSON.stringify(data, null, 2));
                rechargeVerifyMutate(
                  {...data, name: userProfile?._payload?.name},
                  {
                    onSuccess: response => {
                      if (response.success) {
                        refetch();
                        //Button press animation
                        rechargePanelHeight.value = withTiming(0, {
                          duration: 300,
                        });
                        rechargePanelOpacity.value = withTiming(0, {
                          duration: 200,
                        });
                        cardScale.value = withSpring(1);
                        setShowCustomInput(false);
                        setCustomAmount("");
                        showToast(response.message);
                        setIsLoading(false);
                      }
                    },
                    onError: () => {
                      setIsLoading(false);
                    },
                  },
                );
              })
              .catch(() => {
                showErrorAlert("Paymet failed");
                setIsLoading(false);
              });
          }
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    );

    // // Simulate recharge process
    // setTimeout(() => {
    //     setBalance(prev => prev + selectedAmount);
    //     setSelectedAmount(null);
    //     setCustomAmount('');
    //     setShowCustomInput(false);
    //     handleRechargePress(); // Close panel
    // }, 800);
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {
        console.log("Screen lost focus");
      };
    }, [refetch]),
  );

  return (
    <KeyboardAvoidingView
      testID="wrapper"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.background}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Wallet</Text>
            <TouchableOpacity>
              <Feather name="settings" size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.card, animatedCardStyle]}>
            <LinearGradient
              colors={[colors.cardGradientStart, colors.cardGradientEnd]}
              style={styles.cardGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Digital Wallet</Text>
                <FontAwesome
                  name="cc-visa"
                  size={32}
                  color="rgba(255,255,255,0.7)"
                />
              </View>

              <View style={styles.cardBalanceContainer}>
                <Text style={styles.cardBalanceLabel}>Available Balance</Text>
                <Text style={styles.cardBalance}>
                  ₹{userProfile?._payload?.wallet_amount.toFixed(2)}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRechargePress}
              >
                <View
                  style={[styles.actionIcon, {backgroundColor: colors.accent}]}
                >
                  <Icon name="money" size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionText}>Recharge</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOfferPress}
              >
                <View
                  style={[
                    styles.actionIcon,
                    {backgroundColor: colors.secondary},
                  ]}
                >
                  <Icon name="local-offer" size={24} color={colors.textLight} />
                </View>
                <Text style={styles.actionText}>Offers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Navigation.navigate(NavigationString.WalletHistory);
                }}
              >
                <View
                  style={[
                    styles.actionIcon,
                    {backgroundColor: colors.primaryLight},
                  ]}
                >
                  <Icon name="history" size={24} color={colors.textLight} />
                </View>
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={styles.recentTransactions}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Icon name="shopping-bag" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Amazon Purchase</Text>
                                <Text style={styles.transactionDate}>Today, 10:45 AM</Text>
                            </View>
                            <Text style={[styles.transactionAmount, { color: colors.primary }]}>-₹49.99</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Icon name="account-balance-wallet" size={20} color={colors.secondary} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Wallet Recharge</Text>
                                <Text style={styles.transactionDate}>Yesterday, 3:20 PM</Text>
                            </View>
                            <Text style={[styles.transactionAmount, { color: colors.secondary }]}>+₹200.00</Text>
                        </View>
                    </View> */}
        </ScrollView>

        {isRecharging && (
          <Animated.View
            style={[styles.rechargePanel, animatedRechargePanelStyle]}
          >
            <Text style={styles.rechargeTitle}>Select Recharge Amount</Text>
            <TouchableOpacity
              style={{padding: 10, position: "absolute", right: 10, top: 10}}
              activeOpacity={0.8}
              onPress={handleRechargePress}
            >
              <Icon name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.amountGrid}>
              {rechargeAmounts.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountButton,
                    selectedAmount === amount && styles.amountButtonSelected,
                  ]}
                  onPress={() => handleAmountSelect(amount)}
                >
                  <Text
                    style={[
                      styles.amountText,
                      selectedAmount === amount && styles.amountTextSelected,
                    ]}
                  >
                    ₹{amount}
                  </Text>
                  {selectedAmount === amount && (
                    <Icon
                      name="check-circle"
                      size={20}
                      color={colors.textLight}
                      style={styles.amountCheck}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {!showCustomInput ? (
              <TouchableOpacity
                style={styles.customAmountButton}
                onPress={toggleCustomInput}
              >
                <Text style={styles.customAmountButtonText}>Custom Amount</Text>
                <Icon name="keyboard" size={20} color={colors.primary} />
              </TouchableOpacity>
            ) : (
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  onSubmitEditing={handleCustomAmountSelect}
                />
                <TouchableOpacity
                  style={styles.customInputButton}
                  onPress={handleCustomAmountSelect}
                  disabled={
                    !customAmount ||
                    isNaN(+customAmount) ||
                    parseFloat(customAmount) <= 0
                  }
                >
                  <Text style={styles.customInputButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedAmount && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmRecharge}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size={"small"} color={colors.textLight} />
                ) : (
                  <View style={[MainStyle.flexRow]}>
                    <Text style={styles.confirmButtonText}>
                      Confirm Recharge
                    </Text>
                    <Icon
                      name="arrow-forward"
                      size={20}
                      color={colors.textLight}
                      style={styles.confirmIcon}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 220,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
    height: 180,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  cardBalanceContainer: {
    marginVertical: 20,
  },
  cardBalanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  cardBalance: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardNumber: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    letterSpacing: 1,
  },
  cardExpiry: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  quickActions: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  recentTransactions: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4B66",
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionText: {
    marginTop: 10,
    color: "#1B4B66",
    fontWeight: "500",
    textAlign: "center",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(27, 75, 102, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rechargePanel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  rechargeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1B4B66",
    textAlign: "center",
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  amountButton: {
    width: width * 0.28,
    height: 70,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    position: "relative",
  },
  amountButtonSelected: {
    backgroundColor: "#1B4B66",
    borderColor: "#1B4B66",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  amountTextSelected: {
    color: "#FFFFFF",
  },
  amountCheck: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  customAmountButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  customAmountButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1B4B66",
    marginRight: 10,
  },
  customInputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  customInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#333333",
  },
  customInputButton: {
    width: 80,
    height: 50,
    backgroundColor: "#1B4B66",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  customInputButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#1B4B66",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  confirmButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmIcon: {
    marginLeft: 10,
  },
});

export default Wallet;
