import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Feather } from '@expo/vector-icons';

export default function CompressStructure() {
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [savedUri, setSavedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);   // For compression
  const [uploading, setUploading] = useState(false); // For file uploading

  const pickImage = async () => {
    setUploading(true); // Start upload loader
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow access to the media library to pick an image.');
      setUploading(false);
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPreviewUri(uri);

      const originalInfo = await FileSystem.getInfoAsync(uri);
      if (originalInfo.exists && originalInfo.size) {
        setOriginalSize(originalInfo.size / 1024); // KB
      } else {
        setOriginalSize(null);
        Alert.alert('Error', 'Could not determine original file size.');
      }

      await compressImage(uri);
    }

    setUploading(false); // End upload loader
  };

  const compressImage = async (uri: string) => {
    setLoading(true);
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCompressedUri(result.uri);

      const compressedInfo = await FileSystem.getInfoAsync(result.uri);
      if (compressedInfo.exists && compressedInfo.size) {
        setCompressedSize(compressedInfo.size / 1024); // KB
      } else {
        setCompressedSize(null);
        Alert.alert('Error', 'Could not determine compressed file size.');
      }
    } catch (error) {
      console.error('Image compression error:', error);
      Alert.alert('Error', 'Failed to compress the image.');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!compressedUri) {
      Alert.alert('No image to save', 'Please compress an image first.');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Storage permission is required to save the image.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(compressedUri);
      await MediaLibrary.createAlbumAsync('CompressedImages', asset, false);

      setSavedUri(asset.uri);
      Alert.alert('Success', 'Image saved to gallery in "CompressedImages" folder.');
    } catch (error) {
      console.error('Saving error:', error);
      Alert.alert('Error', 'Failed to save the image to gallery.');
    }
  };

  const clearAll = () => {
    setPreviewUri(null);
    setCompressedUri(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setSavedUri(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fileBox} onPress={pickImage}>
        <Feather name="upload" size={22} color="#60a5fa" style={{ paddingBottom: 6 }} />
        <Text style={styles.textWhite}>{previewUri ? 'Image Selected' : 'Select Image'}</Text>
        <Text style={styles.subText}>.jpg/.png</Text>
      </TouchableOpacity>

      {(uploading || loading) && (
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          {uploading && <Text style={styles.uploadingText}>Uploading image...</Text>}
          {loading && !uploading && <Text style={styles.uploadingText}>Compressing image...</Text>}
        </View>
      )}

      {(originalSize !== null || compressedSize !== null) && (
        <View style={styles.infoBox}>
          {originalSize !== null && (
            <Text style={styles.text}>Original Size: {originalSize.toFixed(2)} KB</Text>
          )}
          {compressedSize !== null && (
            <Text style={styles.text}>Compressed Size: {compressedSize.toFixed(2)} KB</Text>
          )}
        </View>
      )}

      {savedUri && (
        <View style={styles.savedInfo}>
          <Text style={styles.text}>Image saved at: {savedUri}</Text>
        </View>
      )}

      <View style={styles.buttons}>
        {compressedUri && (
          <TouchableOpacity style={styles.mergeBtn} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Image</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBox: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  textWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    marginTop: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    marginVertical: 4,
  },
  savedInfo: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttons: {
    marginTop: 20,
    gap: 10,
  },
  mergeBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#60a5fa',
    fontWeight: '500',
  },
});
