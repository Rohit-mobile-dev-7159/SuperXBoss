import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Linking, LogBox, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/Redux/Store.js';
import Routes from './src/Navigation/Routes.jsx';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import NavigationString from './src/Constant/NavigationString';
import { navigationRef } from './src/Utils/NavigationService';
import {
  checkPendingNotification,
  registerTokenRefreshListener,
  requestUserPermission,
  setupNotificationListeners,
} from './src/Utils/NotificationHandler';
import messaging from '@react-native-firebase/messaging';
import { updateProfile } from './src/Services/Main/apis';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
LogBox.ignoreAllLogs(true);
import Config from 'react-native-config'
const queryClient = new QueryClient();
console.log(Config, 'll')
 
const App = () => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [isPersistReady, setIsPersistReady] = useState(false);
  const inset = useSafeAreaInsets()
  const linking = {
    prefixes: ['superXBoss://'],
    config: {
      screens: {
        [NavigationString.Home]: {
          screens: {
            Home: 'home',
            Categories: 'categories',
            Profile: 'profile',
            OrderHistoryDetail: 'orderhistorydetail',
          },
        },
      },
    },
  };

  // Set up FCM + Notifee listeners
  useEffect(() => {
    requestUserPermission();
    setupNotificationListeners();
    registerTokenRefreshListener()
  }, []);

  // Trigger notification if both persist and navigation are ready
  useEffect(() => {
    if (isNavigationReady && isPersistReady) {
      // console.log('🚀 App is fully ready. Checking queued notifications...');
      checkPendingNotification();
    }
  }, [isNavigationReady, isPersistReady]);

  const fcmTokenUpdate = async () => {
    const fcm_token = await messaging().getToken();
    const formData = new FormData()
    formData.append("fcm_token", fcm_token)
    updateProfile(formData)
  }
  useEffect(() => {
    fcmTokenUpdate()
  }, [])

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => setIsNavigationReady(true)}
    >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AlertNotificationRoot>
            <PaperProvider>
              <Provider store={store}>
                <PersistGate
                  loading={null}
                  persistor={persistor}
                  onBeforeLift={() => setIsPersistReady(true)}
                >
                  <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                  <View style={{ flex: 1, paddingBottom: inset.bottom }}>
                    <Routes />
                  </View>
                </PersistGate>
              </Provider>
            </PaperProvider>
          </AlertNotificationRoot>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
