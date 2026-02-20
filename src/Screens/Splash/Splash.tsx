import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Lottie from 'lottie-react-native';
import ImagePath from '../../Constant/ImagePath';
import MainStyle from '../../Styles/MainStyle';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavigationString from '../../Constant/NavigationString';
import {useSelector} from 'react-redux';

const Splash = () => {
  const navigation = useNavigation<any>();
  const tokenData = useSelector((state: any) => state.token.token);

  const AuthCheck = () => {
    if (!tokenData || !tokenData.token) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: NavigationString.Login}],
          }),
        );
      }, 2000);
      return;
    } else if (!tokenData.type || tokenData.type.length === 0) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: NavigationString.UserInfo,
                params: {mobile: tokenData.mobile},
              },
            ],
          }),
        );
      }, 2000);
      return;
    } else {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: NavigationString.Home}],
          }),
        );
      }, 2000);
    }
  };

  useEffect(() => {
    if (tokenData) {
      AuthCheck();
    }
  }, [tokenData]);

  return (
    <SafeAreaView testID="Splash" style={{flex: 1}}>
      <View style={styles.wrapper}>
        <ImagePath.Logo style={styles.logo} />
        <View
          style={[
            MainStyle.flexRow,
            {width: '100%', height: 200, position: 'absolute', bottom: 0},
          ]}
        >
          <Lottie
            source={require('../../lottie/Cogwheels.json')}
            autoPlay
            loop
            style={{width: '30%', height: '100%'}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  wrapper: {flex: 1, alignItems: 'center'},
  logo: {marginTop: 55},
  gair: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'red',
  },
});
