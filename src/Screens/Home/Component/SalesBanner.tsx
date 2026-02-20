import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

interface SalesBannerProps {
  variant?: 'default' | 'modern' | 'elegant' | 'minimal';
  discountText?: string;
  saleText?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
  imageUrl?: any;
  timeRemaining?: string;
  badgeText?: string;
  height?: number;
}

// const SalesBanner: React.FC<SalesBannerProps> = ({
const SalesBanner: React.FC<SalesBannerProps> = ({
  variant = 'default',
  discountText = '50% OFF',
  saleText = 'SUMMER SALE',
  backgroundColor = '#FF5252',
  textColor = '#fff',
  onPress,
  imageUrl,
  timeRemaining,
  badgeText = 'HOT',
  height = 140,
}) => {
  const scaleValue = new Animated.Value(1);
  const rotateValue = new Animated.Value(0);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }),
      Animated.spring(rotateValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(rotateValue, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', variant === 'modern' ? '-3deg' : '0deg'],
  });

  const renderVariant = () => {
    switch (variant) {
      case 'modern':
        return (
          <Animated.View
            style={[
              styles.bannerContainer,
              styles.modernContainer,
              {
                height,
                backgroundColor: imageUrl ? 'transparent' : backgroundColor,
                transform: [{scale: scaleValue}, {rotate: rotateInterpolation}],
              },
            ]}
          >
            {imageUrl && (
              <ImageBackground
                source={imageUrl}
                style={styles.backgroundImage}
                imageStyle={[
                  styles.backgroundImageStyle,
                  styles.modernImageStyle,
                ]}
              >
                <View style={styles.overlay} />
              </ImageBackground>
            )}

            <View style={styles.modernBadge}>
              <Text style={[styles.modernBadgeText, {color: textColor}]}>
                {badgeText}
              </Text>
            </View>

            <View style={styles.modernDiscountContainer}>
              <Text style={[styles.modernDiscountText, {color: textColor}]}>
                {discountText}
              </Text>
              <View style={styles.modernDivider} />
              {timeRemaining && (
                <Text style={[styles.modernTimeText, {color: textColor}]}>
                  ⏱️ {timeRemaining}
                </Text>
              )}
            </View>

            <View style={styles.modernSaleContainer}>
              <Text style={[styles.modernSaleText, {color: textColor}]}>
                {saleText}
              </Text>
              <View style={styles.modernArrow}>
                <Text style={[styles.modernArrowText, {color: textColor}]}>
                  →
                </Text>
              </View>
            </View>

            <View style={styles.modernDecoration} />
          </Animated.View>
        );

      case 'elegant':
        return (
          <Animated.View
            style={[
              styles.bannerContainer,
              styles.elegantContainer,
              {
                height,
                backgroundColor: imageUrl ? 'transparent' : backgroundColor,
                transform: [{scale: scaleValue}],
              },
            ]}
          >
            {imageUrl && (
              <ImageBackground
                source={imageUrl}
                style={styles.backgroundImage}
                imageStyle={[
                  styles.backgroundImageStyle,
                  styles.elegantImageStyle,
                ]}
              >
                <View style={styles.elegantOverlay} />
              </ImageBackground>
            )}

            <View style={styles.elegantRibbon}>
              <Text style={styles.elegantRibbonText}>SALE</Text>
            </View>

            <View style={styles.elegantContent}>
              <View style={styles.elegantDiscountContainer}>
                <Text style={[styles.elegantDiscountText, {color: textColor}]}>
                  {discountText}
                </Text>
              </View>

              <View style={styles.elegantSaleContainer}>
                <Text style={[styles.elegantSaleText, {color: textColor}]}>
                  {saleText}
                </Text>
                {timeRemaining && (
                  <Text style={[styles.elegantTimeText, {color: textColor}]}>
                    Ends in: {timeRemaining}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
        );

      case 'minimal':
        return (
          <Animated.View
            style={[
              styles.bannerContainer,
              styles.minimalContainer,
              {
                height: height - 20,
                backgroundColor: imageUrl ? 'transparent' : backgroundColor,
                transform: [{scale: scaleValue}],
              },
            ]}
          >
            {imageUrl && (
              <Image
                source={imageUrl}
                style={styles.minimalImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.minimalContent}>
              <Text style={[styles.minimalDiscountText, {color: textColor}]}>
                {discountText}
              </Text>
              <Text style={[styles.minimalSaleText, {color: textColor}]}>
                {saleText}
              </Text>
              {timeRemaining && (
                <Text style={[styles.minimalTimeText, {color: textColor}]}>
                  {timeRemaining}
                </Text>
              )}
            </View>
          </Animated.View>
        );

      default:
        return (
          <Animated.View
            style={[
              styles.bannerContainer,
              styles.defaultContainer,
              {
                height,
                backgroundColor: imageUrl ? 'transparent' : backgroundColor,
                transform: [{scale: scaleValue}, {rotate: rotateInterpolation}],
              },
            ]}
          >
            {imageUrl && (
              <ImageBackground
                source={imageUrl}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}
              >
                <View style={styles.overlay} />
              </ImageBackground>
            )}

            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>{badgeText}</Text>
            </View>

            <View style={styles.defaultDiscountContainer}>
              <Text style={[styles.defaultDiscountText, {color: textColor}]}>
                {discountText}
              </Text>
            </View>

            <View style={styles.defaultSaleContainer}>
              <Text style={[styles.defaultSaleText, {color: textColor}]}>
                {saleText}
              </Text>
              {timeRemaining && (
                <Text style={[styles.defaultTimeText, {color: textColor}]}>
                  ⏱️ {timeRemaining}
                </Text>
              )}
            </View>

            <View style={styles.defaultDecoration} />
          </Animated.View>
        );
    }
  };

  return (
    <View style={{marginTop: 20}} testID="sale_banner">
      <TouchableOpacity
        testID="sales_ban_btn"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.touchableContainer}
      >
        {renderVariant()}
      </TouchableOpacity>
    </View>
  );
};

export default SalesBanner;

const styles = StyleSheet.create({
  touchableContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bannerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Modern Variant Styles
  modernContainer: {
    flexDirection: 'row',
  },
  modernBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  modernBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modernImageStyle: {
    borderTopRightRadius: 80,
  },
  modernDiscountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 2,
  },
  modernDiscountText: {
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  modernDivider: {
    width: '60%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: 8,
  },
  modernTimeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modernSaleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    zIndex: 2,
  },
  modernSaleText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  modernArrow: {
    marginTop: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modernArrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modernDecoration: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: -40,
    bottom: -40,
    zIndex: 1,
  },

  // Elegant Variant Styles
  elegantContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  elegantImageStyle: {
    borderBottomRightRadius: 100,
  },
  elegantOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  elegantRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#D4AF37',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderBottomRightRadius: 16,
  },
  elegantRibbonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  elegantContent: {
    flexDirection: 'row',
    flex: 1,
  },
  elegantDiscountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 2,
  },
  elegantDiscountText: {
    fontSize: 32,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  elegantSaleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    zIndex: 2,
  },
  elegantSaleText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 5,
  },
  elegantTimeText: {
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.5,
  },

  // Minimal Variant Styles
  minimalContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    elevation: 2,
  },
  minimalImage: {
    width: width * 0.35,
    height: '100%',
  },
  minimalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  minimalDiscountText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  minimalSaleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  minimalTimeText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999',
  },

  // Default Variant Styles
  defaultContainer: {
    flexDirection: 'row',
  },
  defaultBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  defaultDiscountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 2,
  },
  defaultDiscountText: {
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  defaultSaleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    zIndex: 2,
  },
  defaultSaleText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  defaultTimeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  defaultDecoration: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: -30,
    bottom: -30,
    zIndex: 1,
  },
});
