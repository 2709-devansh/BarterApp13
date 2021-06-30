import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {AppStackNavigator} from './AppStackNavigator';
import HomeScreen from '../Screens/HomeScreen';
import ExchangeScreen from '../Screens/ExchangeScreen';

export const AppTabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: AppStackNavigator, 
    navigationOptions: { 
      tabBarIcon: (
        <Image
          source={require('../assets/home.png')}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: 'Home Screen',
    }, 
  },

  ExchangeScreen: {
    screen: ExchangeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/exchange.png')}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: 'Exchange Screen',
    },
  },
});
