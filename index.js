/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import AppMain from './js/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppMain);

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
