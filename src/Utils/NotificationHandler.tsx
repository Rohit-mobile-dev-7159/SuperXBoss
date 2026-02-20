import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {navigate, isReady} from './NavigationService';
import {updateProfile} from '../Services/Main/apis';

let pendingNotification: FirebaseMessagingTypes.RemoteMessage | null = null;

export async function requestUserPermission(): Promise<void> {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔐 FCM Permission granted. Auth status:', authStatus);
  }
}

export function setupNotificationListeners(): void {
  // Foreground notification
  messaging().onMessage(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('📩 Foreground FCM message:', remoteMessage);
      const {title, body} = remoteMessage.notification ?? {};
      if (title && body) {
        Alert.alert(title, body);
      }
    },
  );

  // Background: user taps on notification
  messaging().onNotificationOpenedApp(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        console.log(
          '📲 App opened from background via notification:',
          remoteMessage,
        );
        handleNotificationNavigation(remoteMessage);
      }
    },
  );

  // Cold start: user taps notification when app is quit
  messaging()
    .getInitialNotification()
    .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        console.log('❄️ App opened from quit via notification:', remoteMessage);
        handleNotificationNavigation(remoteMessage);
      }
    });
}

function handleNotificationNavigation(remoteMessage: any): void {
  const screen = remoteMessage?.data?.screen;
  if (screen) {
    if (isReady()) {
      console.log('✅ Navigation is ready. Navigating to:', screen);
      navigate(screen, {_id: remoteMessage?.data.orderId, goHome: true});
    } else {
      console.log(
        '⏳ Navigation not ready yet. Queuing navigation to:',
        screen,
      );
      pendingNotification = remoteMessage;
    }
  }
}

export function checkPendingNotification(): void {
  if (pendingNotification && isReady()) {
    const screen = pendingNotification.data?.screen;
    if (screen) {
      console.log('🚀 Processing queued notification. Navigating to:', screen);
      navigate(screen);
    }
    pendingNotification = null;
  }
}

export function registerTokenRefreshListener() {
  const unsubscribe = messaging().onTokenRefresh(async newToken => {
    const formData = new FormData();
    formData.append('fcm_token', newToken);
    updateProfile(formData);
    return newToken;
  });

  return unsubscribe;
}
