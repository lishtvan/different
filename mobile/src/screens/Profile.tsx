import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import Listing from '../components/Listing';

const Stack = createStackNavigator();

// @ts-ignore
const ProfileComponent = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Profile</Text>
      <Button
        title="Go to listing"
        onPress={() => navigation.navigate('Listing')}
      />
    </View>
  );
};

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: '',
        headerShadowVisible: false,
      }}
      initialRouteName="ProfileC">
      <Stack.Screen
        name="ProfileC"
        component={ProfileComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Listing" component={Listing} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
