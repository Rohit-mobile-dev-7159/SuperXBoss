/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/Utils/NotificationHandler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const AppWithNavigation = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

// Register the wrapped component
AppRegistry.registerComponent(appName, () => AppWithNavigation);
