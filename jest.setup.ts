import { useFocusEffect } from '@react-navigation/native';
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

//  Mock Reanimated (required)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // Silence useNativeDriver warning
  Reanimated.default.call = () => {};
  return Reanimated;
});

//  Silence Animated warnings (modern-safe)
jest.mock('react-native/Libraries/Animated/Animated', () => {
  const ActualAnimated = jest.requireActual(
    'react-native/Libraries/Animated/Animated',
  );
  return ActualAnimated;
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => {
      return {
        Navigator: ({ children }: any) => children,
        Screen: ({ children }: any) => children ?? null,
      };
    }),
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
    }),
     useRoute: () => ({
      params: {},
    }),
    useFocusEffect:()=>({})
  };
});



jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');

  return {
    ...actual,
    persistStore: jest.fn(() => ({
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
    })),
  };
});

jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-razorpay', () => {
  return {
    open: jest.fn(() => Promise.resolve({})),
  };
});

jest.mock('react-native-skeleton-placeholder', () => {
  const React = require('react');
  const { View } = require('react-native');

  return ({ children }: any) =>
    React.createElement(View, null, children);
});


jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
  shareSingle: jest.fn(() => Promise.resolve()),
  isPackageInstalled: jest.fn(() => Promise.resolve({ isInstalled: true })),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  openSettings: jest.fn(() => Promise.resolve()),
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
    LIMITED: 'limited',
  },
  PERMISSIONS: {
    ANDROID: {},
    IOS: {},
  },
}));

/* ------------------ Firebase (ALL native) ------------------ */
jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    requestPermission: jest.fn(() => Promise.resolve(1)),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    setBackgroundMessageHandler: jest.fn(),
  });
});

jest.mock('react-native-otp-textinput', () => {
  const React = require('react');
  const { TextInput, View } = require('react-native');

  return React.forwardRef((props: any, ref: any) =>
    React.createElement(
      View,
      null,
      React.createElement(TextInput, {
        ref,
        ...props,
        value: props.value || '',
      })
    )
  );
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    WebView: (props: any) =>
      React.createElement(View, {
        ...props,
        testID: props.testID || 'mock-webview',
      }),
  };
});

jest.mock('react-native-image-zoom-viewer', () => {
  const React = require('react');
  const { View } = require('react-native');

  return (props: any) =>
    React.createElement(View, {
      ...props,
      testID: props?.testID || 'mock-image-zoom-viewer',
    });
});

jest.mock('react-native-modal', () => 'Modal');

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn((options, callback) => {
    callback({
      assets: [
        {
          uri: 'file://test.jpg',
          fileName: 'test.jpg',
          type: 'image/jpeg',
        },
      ],
    });
  }),
}));

jest.mock('./src/Utils/NotificationHandler', () => ({
  requestNotificationPermission: jest.fn(),
  requestUserPermission: jest.fn(),
  setupNotificationListeners: jest.fn(),
  registerTokenRefreshListener: jest.fn(),
}));



// 🔹 Mock Navigation
export const mockNavigate = jest.fn();
export const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    dispatch: mockDispatch,
  }),
}));

// 🔹 Mock Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock("react-native-linear-gradient", () => "LinearGradient");

jest.mock("react-native-skeleton-placeholder", () => {
  return ({ children }: any) => children;
});

jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}));
