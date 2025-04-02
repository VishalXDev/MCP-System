// HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'tailwind-rn'; // Correct import

const HomeScreen = () => {
  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <Text style={tailwind('text-lg text-blue-500')}>Welcome to the Home Screen</Text>
      <TouchableOpacity style={tailwind('bg-blue-500 p-4 rounded')}>
        <Text style={tailwind('text-white')}>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
