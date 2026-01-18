import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import TestIcon from './Testicon';

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header for dark theme
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TestIcon />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 40, // Distance from the top
  },
  text: {
    color: '#fff', // White text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
  terms: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20, // Distance from the image
  },
});