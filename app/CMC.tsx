import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, StatusBar } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BottomNav from './Bottom';
import Tabs from './Tabs';

const screenWidth = Dimensions.get('window').width;

const images = [
  { id: '1', source: require('../assets/images/One.png') },
  { id: '2', source: require('../assets/images/Two.png') },
  { id: '3', source: require('../assets/images/Three.png') },
];

const CMC = () => {
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>OneTap CMC</Text>
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          width={screenWidth}  // Full width of the screen
          height={170}         // Set the height you want for the carousel
          data={images}
          loop
          autoPlay
          autoPlayInterval={3000}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image
                source={item.source}
                style={styles.carouselImage}
                resizeMode="cover" // Ensure image covers the container
              />
            </View>
          )}
        />
      </View>

      {/* Tabs */}
      <Tabs />

      {/* Bottom Nav */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight, // Adjust the container to prevent overlap with the status bar
  },
  header: {
    padding: 0,
    paddingBottom: 19,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginTop: 0,
    alignItems: 'center',
    width: screenWidth, // Ensure the container stretches to full width
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',   // Ensure image takes full width
    height: '100%',  // Adjust height accordingly to the desired carousel height
  },
});

export default CMC;
