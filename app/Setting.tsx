import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Setting = () => {
  return (
    <View className="flex-1 bg-gray-900 px-4 py-6">
      <Text className="text-2xl font-bold text-white mb-6 text-center">Settings</Text>

      <View className="bg-gray-800 rounded-xl">
        <TouchableOpacity className="border-b border-gray-700 px-4 py-4" onPress={() => router.push('/Terms')}>
          <Text className="text-white text-base">Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity className="border-b border-gray-700 px-4 py-4" onPress={() => router.push('/Privacy')}>
          <Text className="text-white text-base">Privacy Policy</Text>
        </TouchableOpacity>

        <View className="border-b border-gray-700 px-4 py-4">
          <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        </View>

        <View className="px-4 py-4">
          <Text className="text-white font-semibold text-center">GT Polytechnic DASK Project</Text>
        </View>
      </View>
    </View>
  );
};

export default Setting;
