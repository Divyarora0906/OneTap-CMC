import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const TestIcon = () => {
  const [agreed, setAgreed] = useState(false);
  const [checking, setChecking] = useState(true); // ✅ state for checking AsyncStorage
  const router = useRouter();

  useEffect(() => {
    const checkStoredAgreement = async () => {
      try {
        const agreedToPolicies = await AsyncStorage.getItem('agreedToPolicies');
        const agreedToTerms = await AsyncStorage.getItem('agreedToTerms');

        if (agreedToPolicies === 'true' && agreedToTerms === 'true') {
          router.replace('/CMC'); 
        } else {
          setChecking(false); 
        }
      } catch (error) {
        console.error('Error checking agreement:', error);
        setChecking(false);
      }
    };

    checkStoredAgreement();
  }, []);

  const toggleAgreement = async () => {
    const newValue = !agreed;
    setAgreed(newValue);

    await AsyncStorage.setItem('agreedToPolicies', JSON.stringify(newValue));
    await AsyncStorage.setItem('agreedToTerms', JSON.stringify(newValue));
  };

  if (checking) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="crimson" />
        <Text style={styles.loaderText}>Checking your agreement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Agreement Section */}
      <View style={styles.agreementContainer}>
        <Pressable onPress={toggleAgreement} style={{ marginRight: 8 }}>
          <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={24} color="crimson" />
        </Pressable>

        <View style={styles.textContainer}>
          <Text style={{ color: "white" }}>I agree to the </Text>
          <TouchableOpacity onPress={() => router.push('/Terms')}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={{ color: "white" }}> and </Text>
          <TouchableOpacity onPress={() => router.push('/Privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        onPress={() => router.replace('/CMC')} 
        disabled={!agreed} 
        style={[styles.nextButton, { backgroundColor: agreed ? 'crimson' : 'gray' }]}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loaderText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkText: {
    color: 'crimson',
    textDecorationLine: 'underline',
  },
  nextButton: {
    marginTop: 20,
    width: '80%',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    width: 140,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TestIcon;
