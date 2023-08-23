import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeNavigator from './src/screens/Home';
import SellScreen from './src/screens/Sell';
import OrdersScreen from './src/screens/Orders';
import ProfileScreen from './src/screens/Profile';
import { AppState, AppStateStatus, ColorValue, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  useQueryClient,
} from '@tanstack/react-query';
import AuthScreen from './src/screens/Auth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface Tab {
  color?: number | ColorValue;
}

const HomeTab: React.FC<Tab> = ({ color }) => (
  <Entypo name="home" color={color} size={31} />
);
const SellTab: React.FC<Tab> = ({ color }) => (
  <MaterialIcons name="add-circle-outline" color={color} size={32} />
);
const OrderTab: React.FC<Tab> = ({ color }) => (
  <FontAwesome name="handshake-o" color={color} size={30} />
);
const ProfileTab: React.FC<Tab> = ({ color }) => (
  <MaterialIcons name="account-circle" color={color} size={36} />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        options={{ tabBarLabel: 'Головна', tabBarIcon: HomeTab }}
        component={HomeNavigator}
      />
      <Tab.Screen
        name="Sell"
        options={{ tabBarLabel: 'Продати', tabBarIcon: SellTab }}
        component={SellScreen}
      />
      <Tab.Screen
        name="Orders"
        options={{ tabBarLabel: 'Замовлення', tabBarIcon: OrderTab }}
        component={OrdersScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{ tabBarLabel: 'Профіль', tabBarIcon: ProfileTab }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    primary: '#168c94',
  },
};

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, [onChange]);
}

const App = () => {
  useAppState(onAppStateChange);

  return (
    <NavigationContainer theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
            component={AuthScreen}
          />
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
