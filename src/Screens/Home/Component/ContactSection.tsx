import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Linking} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/FontAwesome6";
import colors from "../../../Style/Color";

type SocialMediaPlatform = "facebook" | "thread" | "instagram";

const ContactSection: React.FC = () => {
  const handleCall = (): void => {
    Linking.openURL("tel:+1234567890"); // Replace with actual phone number
  };

  const handleSocialMedia = (platform: SocialMediaPlatform): void => {
    // Replace with actual social media URLs
    const urls: Record<SocialMediaPlatform, string> = {
      facebook: "https://www.facebook.com/profile.php?id=61580076416783",
      thread: "https://x.com/SuperxBoss?t=WHEukkZp-GKOnUOAtCFvaw&s=08",
      instagram:
        "https://www.instagram.com/superxboss24?igsh=MXF4eDk2OWU4cnpxbA==",
    };

    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  const onPressCall = (): void => {
    handleCall();
  };

  const onPressSocial = (platform: SocialMediaPlatform) => (): void => {
    handleSocialMedia(platform);
  };

  return (
    <View style={styles.container} testID="contact">
      <TouchableOpacity
        testID="call_button"
        onPress={onPressCall}
        style={styles.callSection}
      >
        <Icon name="phone" size={20} color="#000" />
        <Text style={styles.callText}>CALL US</Text>
      </TouchableOpacity>

      <View style={styles.socialSection}>
        <Text style={styles.followText}>FOLLOW US ON</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity
            testID="facebook_button"
            onPress={onPressSocial("facebook")}
          >
            <Icon
              name="facebook"
              size={24}
              color="#3b5998"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID="thread_button"
            onPress={onPressSocial("thread")}
          >
            <Icon2
              name="threads"
              size={24}
              color={colors.Black}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID="instagram_button"
            onPress={onPressSocial("instagram")}
          >
            <Icon
              name="instagram"
              size={24}
              color="#e1306c"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  callSection: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  callText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 14,
    color: "#666",
  },
  socialSection: {
    alignItems: "center",
  },
  followText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 15,
  },
});

export default ContactSection;
