import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Button, Text, View} from 'react-native';
import Listing from '../components/Listing';

const Stack = createNativeStackNavigator();

// @ts-ignore
const Home = ({navigation}) => {
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
      initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Listing" component={Listing} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
