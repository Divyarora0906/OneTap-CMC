import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useRouter } from 'expo-router';

const Terms = () => {
  const router = useRouter();

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#fff', flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Terms & Conditions
      </Text>
      
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 16 }}>{'\u2022'} You must comply with all applicable laws while using this app.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} The app allows you to convert, merge, compress, and modify documents.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} We do not store or share any of your uploaded files.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} You are responsible for the content you process using the app.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} The app is provided "as is" without any guarantees of performance.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} We are not liable for any data loss or corruption during file processing.</Text>
        <Text style={{ fontSize: 16 }}>{'\u2022'} By using this app, you agree to these terms.</Text>
      </View>

      {/* Back Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Go Back" onPress={() => router.back()} color="black" />
      </View>
    </ScrollView>
  );
};

export default Terms;
