import React from "react";
import {View, Text, StyleSheet} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../../../Style/Color";

const StatsCard = ({data}: any) => {
  const stats = [
    {
      label: "Rating",
      value: `${data?.rating.toFixed(1) || 0} `,
      icon: <FontAwesome name="star" size={22} color="#FFD700" />,
    },
    {
      label: "Users",
      value: `${data?.userCount || 0}+`,
      icon: <Feather name="user" size={22} color="#4A90E2" />,
    },
    {
      label: "Category",
      value: `${data?.categoryCount || 0}+`,
      icon: <MaterialIcons name="apps" size={22} color="#50E3C2" />,
    },
    {
      label: "Years",
      value: data?.yearCount || 0,
      icon: <Feather name="clock" size={22} color="#9013FE" />,
    },
  ];

  return (
    <View style={styles.card}>
      {stats.map((stat, index) => (
        <View style={styles.statBox} key={index}>
          <View style={styles.iconCircle}>{stat.icon}</View>
          <Text style={styles.value}>{stat?.value}</Text>
          <Text style={styles.label}>{stat?.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default StatsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.DBlue,
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    shadowColor: colors.DBlue,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 50,
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.White,
  },
  label: {
    fontSize: 13,
    color: colors.LGray,
    marginTop: 2,
  },
});
