import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Button, Text, View} from 'react-native';
import Listing from '../components/Listing';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

// @ts-ignore
const HomeComponent = ({navigation}) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Home</Text>
      <Button
        title="Go to listing"
        onPress={() => navigation.navigate('Listing')}
      />
      <Button
        title={'Sign in with Google'}
        onPress={() => {
          GoogleSignin.configure({
            iosClientId:
              '24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com',
          });
          GoogleSignin.hasPlayServices()
            .then(hasPlayService => {
              if (hasPlayService) {
                GoogleSignin.signIn()
                  .then(userInfo => {
                    console.log(JSON.stringify(userInfo));
                  })
                  .catch(e => {
                    console.log('ERROR IS: ' + JSON.stringify(e));
                  });
              }
            })
            .catch((e: any) => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }}
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
        options={{headerShown: false}}
      />
      <Stack.Screen name="Listing" component={Listing} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
