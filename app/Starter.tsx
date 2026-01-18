import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';

const Starter = () => {
  const navigatiom = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigatiom.setOptions({headerShown: false })

    const timer = setTimeout(() => {
      router.replace('/Home'); // Navigates to Home
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Image
        source={require('../assets/images/Logo.png')}
        className="w-36 h-36 rounded-2xl absolute z-50"
        resizeMode="contain"
      />
      <Text className="text-white text-lg font-bold absolute bottom-16">
      </Text>
    </View>
  );
};

export default Starter;
