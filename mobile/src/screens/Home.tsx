import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Button, Text, View} from 'react-native';
import Listing from '../components/Listing';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {fetcher} from '../utils/fetchInstance';
import {useQuery} from '@tanstack/react-query';

const Stack = createStackNavigator();

// @ts-ignore
const HomeComponent = ({navigation}) => {
  const {data} = useQuery({
    queryKey: ['user'],
    queryFn: () => fetcher({route: '/', method: 'GET'}),
  });
  if (data) console.log(data);

  const signIn = async () => {
    GoogleSignin.configure({
      iosClientId:
        '24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com',
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (!hasPlayService) return;
    await GoogleSignin.signIn();
    const {accessToken} = await GoogleSignin.getTokens();
    const headers = new Headers();
    headers.append('Content-type', 'application/json');
    const res = await fetch('http://127.0.0.1:8000/auth/google/mobile', {
      method: 'POST',
      headers,
      body: JSON.stringify({accessToken}),
    });
    const {token, userId} = await res.json();
    console.log(token, userId);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Home</Text>
      <Button
        title="Go to listing"
        onPress={() => navigation.navigate('Listing')}
      />
      <Button title={'Sign in with Google'} onPress={signIn} />
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
        options={{headerShown: false}}
      />
      <Stack.Screen name="Listing" component={Listing} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
