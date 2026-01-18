import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';


const BottomNav = () => {
  const router = useRouter();
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#111827');
  }, []);
  return (
    <View className="absolute bottom-0 w-full bg-gray-900 py-4 border-t border-gray-700">
      <View className="flex-row justify-around items-center">
        <TouchableOpacity onPress={() => router.push('/Home')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Setting')}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNav;
