import {View, Text} from "react-native";
import React from "react";
import MainStyle from "../../../Styles/MainStyle";
import colors from "../../../Style/Color";

const BulkDiscount = ({data, point, gst}: any) => {
  return (
    <>
      {(data?.count || point) && (
        <View style={[MainStyle.flexBetween, {marginTop: "auto"}]}>
          {data?.count && (
            <Text style={{fontSize: 11, color: "green", fontWeight: "500"}}>
              Buy {data?.count} items, save {data?.discount}%
            </Text>
          )}
          {point && (
            <Text
              style={{color: colors.DBlue, fontSize: 12, fontWeight: "500"}}
            >
              {point || 0} point
            </Text>
          )}
          {gst && (
            <Text
              style={{color: colors.DBlue, fontSize: 12, fontWeight: "500"}}
            >
              Tax: {gst || 0}%
            </Text>
          )}
        </View>
      )}
    </>
  );
};

export default BulkDiscount;
