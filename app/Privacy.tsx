import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useRouter } from 'expo-router';

const Privacy = () => {
  const router = useRouter();

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#fff', flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Privacy Policy
      </Text>

      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 16 }}>{'\u2022'} We respect your privacy and do not collect personal data.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} Your uploaded documents are processed locally and not stored.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} We do not share any of your data with third parties.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} Permissions required are only for app functionality.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} Our app does not track or monitor your activity.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} Security measures are in place to protect your data.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} By using this app, you consent to this Privacy Policy.</Text>
      </View>

      {/* Back Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Go Back" onPress={() => router.back()} color="black" />
      </View>
    </ScrollView>
  );
};

export default Privacy;
