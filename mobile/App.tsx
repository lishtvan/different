import * as React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeNavigator from './src/screens/Home';
import SellScreen from './src/screens/Sell';
import OrdersScreen from './src/screens/Orders';
import ProfileScreen from './src/screens/Profile';
import {ColorValue, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Search"
        options={{tabBarLabel: 'Пошук', tabBarIcon: HomeTab}}
        component={HomeNavigator}
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
  );
};

const Auth = () => (
  <View>
    <Text>Auth</Text>
  </View>
);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    primary: '#168c94',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Auth" component={Auth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
