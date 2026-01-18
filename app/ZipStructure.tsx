import React, { useState } from 'react';
import { View, Alert, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const ZipStructure = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [zipContent, setZipContent] = useState<string | null>(null);
  const [zipUri, setZipUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 

  const pickAndZipFile = async () => {
    try {
      setLoading(true); 
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      const file = result.assets[0];
      const uri = file.uri;
      const name = file.name;

      if (!uri || !name) {
        Alert.alert('Error', 'Invalid file selected');
        setLoading(false);
        return;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const zip = new JSZip();
      zip.file(name, fileBase64, { base64: true });

      const zipContent = await zip.generateAsync({ type: 'base64' });

      const zipFileName = name.replace(/\.[^/.]+$/, '') + '.zip';
      setZipContent(zipContent);
      setFileName(zipFileName);

      setZipUri(FileSystem.documentDirectory + zipFileName);
      setLoading(false);
    } catch (error) {
      console.error('Error during file processing:', error);
      Alert.alert('Error', 'Something went wrong while processing the file.');
      setLoading(false); 
    }
  };

  const downloadZip = async () => {
    if (!zipContent || !zipUri) {
      Alert.alert('Error', 'No ZIP file to download.');
      return;
    }

    try {
      setLoading(true); 
      await FileSystem.writeAsStringAsync(zipUri, zipContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(zipUri);
        Alert.alert('Success', 'ZIP file saved and shared successfully!');
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error during download:', error);
      Alert.alert('Error', 'Failed to save ZIP file to external storage.');
      setLoading(false); 
    }
  };

  const clearAll = () => {
    setFileName(null);
    setZipUri(null);
    setZipContent(null);
  };

  return (
    <View style={{ padding: 0, marginTop: 0 }}>
      {loading && ( 
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Processing...</Text>
        </View>
      )}

      {!loading && (
        <>
          <View style={styles.row}>
            <TouchableOpacity style={styles.fileBoxLeft} onPress={pickAndZipFile}>
              <Feather name="upload" size={22} color="#60a5fa" style={{ paddingBottom: 6 }} />
              <Text style={styles.textWhite}>Pick File for ZIP</Text>
            </TouchableOpacity>
          </View>

          {fileName && zipContent && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.picked}>Picked File: {fileName}</Text>

              <View style={styles.row}>
                <TouchableOpacity style={styles.fileBoxRight} onPress={downloadZip}>
                  <Text style={styles.textWhite}>Share ZIP</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 10 }}>
                <TouchableOpacity style={styles.fileBoxRight} onPress={clearAll}>
                  <Text style={styles.textWhite}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  picked: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    alignItems: 'center',
  },
  fileBoxLeft: {
    width: 200,
    height: 90,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBoxRight: {
    width: screenWidth * 0.8,
    height: 70,
    backgroundColor: '#374151',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default ZipStructure;
