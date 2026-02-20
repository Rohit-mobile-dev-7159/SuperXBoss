// ProfileScreen.tsx
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Animated, {FadeInUp, FadeInDown} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import AllUrls from "../../Constant/AllUrls";
import {useDispatch, useSelector} from "react-redux";
import {CommonActions, useNavigation} from "@react-navigation/native";
import NavigationString from "../../Constant/NavigationString";
import {setToken} from "../../Redux/Slices/Token";
import {clearCart} from "../../Redux/Slices/AddToCartProduct";
import {useFetchUserProfile} from "../../Services/Main/Hooks";
import colors from "../../Style/Color";
import {pickImageFromGallery} from "../../Helper";
import {updateProfile} from "../../Services/Main/apis";
import ImagePath from "../../Constant/ImagePath";

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const ProfileScreen = () => {
  const userData = useSelector((state: any) => state.token.token);
  const Navigation: any = useNavigation();
  const Dispatch = useDispatch();
  const {data: userProfile, refetch} = useFetchUserProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const orders = [
    {
      icon: "history",
      label: "Order History",
      color: "#4CAF50",
      onPress: () => {
        Navigation.navigate(NavigationString.OrderHistory);
      },
    },
    {
      icon: "heart-outline",
      label: "Wishlist",
      color: "#F06292",
      onPress: () => {
        Navigation.navigate(NavigationString.WishListProduct);
      },
    },
    {
      icon: "wallet",
      label: "Wallet",
      color: "#03903bff",
      onPress: () => {
        Navigation.navigate(NavigationString.Wallet);
      },
    },
    {
      icon: "headset",
      label: "Help & Support",
      color: "#5a0b4fff",
      onPress: () => {
        Navigation.navigate(NavigationString.HelpSupport);
      },
    },
    {
      icon: "shield-check-outline",
      label: "Privacy Policy",
      color: "#2196F3",
      onPress: () => {
        Navigation.navigate(NavigationString.PrivacyPolicy);
      },
    },
    {
      icon: "file-document-outline",
      label: "Terms & Conditions",
      color: "#FF9800",
      onPress: () => {
        Navigation.navigate(NavigationString.TermsCondition);
      },
    },
    {
      icon: "help-circle-outline",
      label: "FAQs",
      color: "#9C27B0",
      onPress: () => {
        Navigation.navigate(NavigationString.Faqs);
      },
    },
  ];

  const logout = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        AllUrls.userLogout,
        {customerId: userData._id},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        },
      );
      if (response.data.success) {
        Dispatch(setToken({}));
        Dispatch(clearCart());
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        Navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: NavigationString.Login}],
          }),
        );
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };
  const pickProfile = async () => {
    const result = await pickImageFromGallery();
    if (result) {
      const formData = new FormData();
      formData.append("profile", {
        uri: result.uri,
        name: result.fileName,
        type: result.type,
      });

      const response = await updateProfile(formData);
      if (response.success) {
        setIsModalVisible(false);
        refetch();
      }
    }
  };
  const handleUpdate = async () => {
    const formData = new FormData();
    if (userName) {
      formData.append("name", userName);
    }

    const result = await updateProfile(formData);
    if (result.success) {
      setIsModalVisible(false);
    }
  };
  useEffect(() => {
    setUserName(userProfile?._payload?.name);
  }, [userProfile]);

  return (
    <LinearGradient
      testID="profile_wrapper"
      colors={["#fff", "#fff"]}
      style={styles.gradientBackground}
    >
      <View style={styles.profileContainer}>
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                userProfile?._payload?.profile
                  ? {uri: userProfile?._payload?.profile}
                  : ImagePath.Default
              }
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.cameraIcon} onPress={pickProfile}>
              <Icon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          {userProfile?._payload?.points && (
            <Text style={styles.userRole}>
              Points:-{userProfile?._payload?.points}
            </Text>
          )}
        </Animated.View>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        <View style={styles.grid}>
          {orders.map((item, index) => (
            <AnimatedButton
              testID={item.label}
              entering={FadeInDown.delay(index * 100)}
              key={index}
              style={styles.gridItem}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <Icon name={item.icon} size={28} color={item.color} />
              <Text style={styles.gridLabel}>{item.label}</Text>
            </AnimatedButton>
          ))}
        </View>
      </View>

      <View style={styles.listSection}>
        <TouchableOpacity
          testID="is_modal"
          style={styles.listItem}
          onPress={() => {
            setIsModalVisible(true);
          }}
        >
          <Icon name="account-edit" size={22} color="#333" />
          <Text style={styles.listText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <Modal
          testID="modal"
          isVisible={isModalVisible}
          onBackdropPress={() => {
            setIsModalVisible(false);
          }}
          onBackButtonPress={() => {
            setIsModalVisible(false);
          }}
          backdropOpacity={0.5}
          animationInTiming={1}
          animationOutTiming={1}
          backdropTransitionInTiming={1}
          backdropTransitionOutTiming={1}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              testID="close"
              style={styles.closeButton}
              onPress={() => {
                setIsModalVisible(false);
              }}
              activeOpacity={0.7}
            >
              <Icon2 name="close" size={20} color={colors.Black} />
            </TouchableOpacity>

            <Text style={styles.title}>Update Your Name</Text>
            <View style={styles.inputContainer}>
              <Icon2
                name="person"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                testID="name_input"
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                autoFocus={true}
              />
              {userName?.length > 0 && (
                <TouchableOpacity
                  testID="cancel"
                  onPress={() => setUserName("")}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <Icon2 name="cancel" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Icon2
                name="check-circle"
                size={20}
                color="white"
                style={styles.saveIcon}
              />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Icon name="logout" size={22} color="#9E9E9E" />
        {loading ? (
          <ActivityIndicator size={"small"} color={"#9E9E9E"} />
        ) : (
          <Text style={[styles.listText, {color: "#9E9E9E"}]}>Logout</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    position: "absolute",
    top: 15,
    left: 28,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 25,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    color: "#333",
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  saveIcon: {
    marginRight: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  gradientBackground: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 80,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 10,
  },
  backBtn: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -10,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: "#E91E63",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  userRole: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  ordersSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    marginBottom: 20,
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  listSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  listText: {
    fontSize: 14,
    marginLeft: 10,
  },
  logoutBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
  },
});
