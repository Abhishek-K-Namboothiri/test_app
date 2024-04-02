import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './app/redux';
import Router from './app/router/Router';



const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}
AppRegistry.registerComponent(appName, () => App);

export default App;