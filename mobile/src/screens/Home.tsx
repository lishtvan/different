import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import Listing from '../components/Listing';
import { fetcher } from '../utils/fetchInstance';
import { useQuery } from '@tanstack/react-query';

const Stack = createStackNavigator();

// @ts-ignore
const HomeComponent = ({ navigation }) => {
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetcher({ route: '/auth/check', method: 'GET', navigation }),
  });

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Home</Text>
      <Button
        title="Go to listing"
        onPress={() => navigation.navigate('Listing')}
      />
    </View>
  );
};

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: '',
        headerShadowVisible: false,
      }}
      initialRouteName="HomeС">
      <Stack.Screen
        name="HomeС"
        component={HomeComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Listing" component={Listing} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
