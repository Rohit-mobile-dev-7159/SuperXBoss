import {View, Text} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const Skelton = () => {
  return (
    <View testID="skeleton-container" style={{padding: 10, paddingTop: 20}}>
      {[...Array(6)].map((_, index) => (
        <SkeletonPlaceholder key={index} borderRadius={8}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            marginBottom={20}
            alignItems="center"
          >
            {/* Image */}
            <SkeletonPlaceholder.Item width={90} height={95} borderRadius={8} />

            {/* Content beside image */}
            <SkeletonPlaceholder.Item
              marginLeft={12}
              flex={1}
              justifyContent="space-between"
            >
              {/* Trending badge */}
              <SkeletonPlaceholder.Item
                width={220}
                height={16}
                borderRadius={4}
              />

              {/* Title */}
              <SkeletonPlaceholder.Item
                marginTop={8}
                width={200}
                height={16}
                borderRadius={4}
              />

              {/* Subtitle */}
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={180}
                height={14}
                borderRadius={4}
              />

              {/* Price and discount */}
              <SkeletonPlaceholder.Item
                marginTop={8}
                flexDirection="row"
                alignItems="center"
              >
                <SkeletonPlaceholder.Item
                  width={100}
                  height={16}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginLeft={10}
                  width={60}
                  height={16}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>

              {/* Buttons */}
              <SkeletonPlaceholder.Item
                flexDirection="row"
                marginTop={10}
                justifyContent="flex-start"
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default Skelton;
