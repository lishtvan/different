import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/screens/Home';
import SellScreen from './src/screens/Sell';
import OrdersScreen from './src/screens/Orders';
import ProfileScreen from './src/screens/Profile';
import {ColorValue} from 'react-native';

const Tab = createBottomTabNavigator();

interface Tab {
  color?: number | ColorValue;
}

const HomeTab: React.FC<Tab> = ({color}) => (
  <Feather name="search" color={color} size={31} />
);
const SellTab: React.FC<Tab> = ({color}) => (
  <MaterialIcons name="add-circle-outline" color={color} size={32} />
);
const OrderTab: React.FC<Tab> = ({color}) => (
  <FontAwesome name="handshake-o" color={color} size={30} />
);
const ProfileTab: React.FC<Tab> = ({color}) => (
  <MaterialIcons name="account-circle" color={color} size={36} />
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarActiveTintColor: '#168c94'}}>
        <Tab.Screen
          name="Search"
          options={{tabBarLabel: 'Пошук', tabBarIcon: HomeTab}}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Sell"
          options={{tabBarLabel: 'Продати', tabBarIcon: SellTab}}
          component={SellScreen}
        />
        <Tab.Screen
          name="Orders"
          options={{tabBarLabel: 'Замовлення', tabBarIcon: OrderTab}}
          component={OrdersScreen}
        />
        <Tab.Screen
          name="Profile"
          options={{tabBarLabel: 'Профіль', tabBarIcon: ProfileTab}}
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
