import React from 'react';
import { AppTabNavigator } from './AppTabNavigator';
import { createDrawerNavigator } from 'react-navigation-drawer';
import CustomSideBarMenu from './CustomSideBarMenu';
import ProfileSettingsScreen from '../Screens/ProfileSettingsScreen';
import MyBartersScreen from '../Screens/MyBartersScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import MyReceivedItemsScreen from '../Screens/MyReceivedItemsScreen';

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },

    Settings: {
      screen: ProfileSettingsScreen,
    },

    'My Barters': {
      screen: MyBartersScreen,
    },

    Notifications: {
      screen: NotificationsScreen,
    },

    'Received Items': {
      screen: MyReceivedItemsScreen,
    },
  },

  {
    contentComponent: CustomSideBarMenu,
  },

  {
    initialRouteName: 'Home',
  }
);
