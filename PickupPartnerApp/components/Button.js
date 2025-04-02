// Button.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tailwind from 'tailwind-rn';

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={tailwind('bg-blue-500 p-3 rounded')}
      onPress={onPress}
    >
      <Text style={tailwind('text-white')}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
