import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Helper function to get correct MIME type for file formats
const getMimeType = (format: string): string => {
  return format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;
};

const screenWidth = Dimensions.get('window').width;

const FileStructure = ({ fromFormat = "jpeg", toFormat = "webp", fileFormat = "jpeg" }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [conversionDone, setConversionDone] = useState(false);
  const [fromTo, setFromTo] = useState({
    from: fromFormat,
    to: toFormat,
  });

  const pickfile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: getMimeType(fromTo.from), // Use the correct MIME type for jpeg
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const fileUri = file.uri;
      const fileName = file.name;

      setShowDialog(true);

      setTimeout(async () => {
        setShowDialog(false);
        setConversionDone(true);

        const newFileName = fileName.replace(/\.[^/.]+$/, `.${fromTo.to}`); // Safely replace extension
        const newFileUri = `${FileSystem.documentDirectory}${newFileName}`;

        await FileSystem.copyAsync({
          from: fileUri,
          to: newFileUri,
        });

        // Request permission to access the gallery
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: requestStatus } = await MediaLibrary.requestPermissionsAsync();
          if (requestStatus !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access denied. Please enable it from settings.');
            return;
          }
        }

        // Create asset and save to the gallery
        const asset = await MediaLibrary.createAssetAsync(newFileUri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);
        Alert.alert('Download Complete', `Saved to Gallery successfully!`);
      }, 2000);
    } catch (error) {
      console.error('File Error:', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  const handleToggle = () => {
    setFromTo(prev => ({
      from: prev.to,
      to: prev.from,
    }));
    setConversionDone(false);
  };

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity style={styles.fileBox} onPress={pickfile}>
          <Feather name="upload" size={22} color="#60a5fa" />
          <Text style={styles.label}>Select File</Text>
          <Text style={styles.formatText}>{fromTo.from.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
          <Ionicons name="swap-horizontal" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={[styles.fileBox, styles.fileBoxRight]}>
          <Feather name="check-circle" size={22} color={conversionDone ? "#34d399" : "#9ca3af"} />
          <Text style={styles.label}>Convert To</Text>
          <Text style={styles.formatText}>
            {conversionDone ? "Done ✅" : fromTo.to.toUpperCase()}
          </Text>
        </View>
      </View>

      <Modal transparent visible={showDialog}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#f87171" />
            <Text style={styles.modalText}>Converting your file...</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 13,
    alignItems: 'center',
  },
  fileBox: {
    width: screenWidth * 0.35,
    height: 90,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    marginHorizontal: 4,
  },
  fileBoxRight: {
    backgroundColor: '#111827',
  },
  toggleButton: {
    backgroundColor: '#4b5563',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: 6,
    elevation: 4,
  },
  label: {
    color: '#d1d5db',
    fontSize: 14,
    marginTop: 6,
  },
  formatText: {
    color: '#f3f4f6',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: 260,
    alignItems: 'center',
    elevation: 6,
  },
  modalText: {
    fontSize: 17,
    marginTop: 15,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
});

export default FileStructure;
