import React from 'react';
import type { Element } from 'react';
import { SafeAreaView, Text } from 'react-native';

const Home: () => Element = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default Home;
