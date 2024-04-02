import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, FontAwesomeIcon } from '@expo/vector-icons'; // Import FontAwesome5 icons
import { COLORS } from '../constants';

// Import your screens here
import Home from "../screens/jobs/Home";
import Profile from '../screens/profile';
import Notifications from '../screens/notification';
import Settings from '../screens/settings';
import Jobs from '../screens/jobs/Jobs';
import ImagePopup from '../screens/jobs/ImagePopup';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Jobs"
      component={Jobs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ImagePopup"
      component={ImagePopup}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#007260",
      tabBarShowLabel: false,
      tabBarStyle: [
        {
          display: "flex",
        },
        null,
      ],
    }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bell" size={size} color={color} />
            
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
