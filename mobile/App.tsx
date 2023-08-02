import React from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <View className="p-2">
        <Image source={require('./assets/logo.jpg')} width={119} height={34} />
        <Text>Its different bitch.</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
