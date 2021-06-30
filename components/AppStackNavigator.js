import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../Screens/HomeScreen';
import ReceiverDetailsScreen from '../Screens/ReceiverDetailsScreen';
import MyBartersScreen from '../Screens/MyBartersScreen';

export const AppStackNavigator = createStackNavigator(
  {
    ItemList: {
      screen: HomeScreen,
      navigationOptions: { 
        headerShown: false,
      },
    },

    ReceiverDetails: {
      screen: ReceiverDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },

  {
    InitialRouteName: 'ItemList',
  }
);
