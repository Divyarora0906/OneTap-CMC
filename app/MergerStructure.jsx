import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { PDFDocument } from 'pdf-lib';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const MergeStructure = () => {
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [loading, setLoading] = useState(false); // NEW: Loading state

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(status === 'granted');
    };
    getPermissions();
  }, []);

  const pickFile = async (side) => {
    try {
      setLoading(true); // Show Loader
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const file = result.assets ? result.assets[0] : result;
      if (side === 'left') setLeftFile(file);
      else setRightFile(file);
    } catch (error) {
      console.error('File Picking Error:', error);
      Alert.alert('Error', 'Failed to pick the file.');
    } finally {
      setLoading(false); // Hide Loader
    }
  };

  const mergeFiles = async () => {
    if (!leftFile || !rightFile) {
      Alert.alert('Select Both Files', 'Please select two PDF files before merging.');
      return;
    }

    if (!hasMediaPermission) {
      Alert.alert('Permission Required', 'Media permission is required to save files.');
      return;
    }

    try {
      setLoading(true); // Show Loader
      const mergedPdf = await PDFDocument.create();

      const addPdf = async (file) => {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const pdf = await PDFDocument.load(base64, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      };

      await addPdf(leftFile);
      await addPdf(rightFile);

      const mergedPdfBytes = await mergedPdf.saveAsBase64({ dataUri: false });
      const fileName = `Merged_${Date.now()}.pdf`;
      const sandboxUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(sandboxUri, mergedPdfBytes, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(sandboxUri);
      if (!fileInfo.exists) throw new Error('Failed to create file');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(sandboxUri);
      } else {
        Alert.alert('Sharing Not Available', 'Sharing functionality is not available on this device.');
      }

      Alert.alert('Success', 'PDF merged and ready for sharing!');
    } catch (error) {
      console.error('Merge Error:', error);
      Alert.alert('Error', error.message || 'Merging failed. Try again.');
    } finally {
      setLoading(false); // Hide Loader
    }
  };

  const clearFiles = () => {
    setLeftFile(null);
    setRightFile(null);
  };

  return (
    <View style={styles.container}>
      {loading && ( // Show Loader when loading
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      {!loading && (
        <>
          <TouchableOpacity onPress={() => pickFile('left')} style={styles.fileBoxLeft}>
            <Feather name="upload" size={22} color="#60a5fa" style={{ paddingBottom: 6 }} />
            <Text style={styles.textWhite}>
              {leftFile ? (leftFile.name.length > 20 ? leftFile.name.substring(0, 20) + '...' : leftFile) : 'Select PDF 1'}
            </Text>

            <Text style={styles.subText}>.pdf</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => pickFile('right')} style={styles.fileBoxRight}>
            <Feather name="upload" size={22} color="#60a5fa" style={{ paddingBottom: 6 }} />
            <Text style={styles.textWhite}>{rightFile ? rightFile.name : 'Select PDF 2'}</Text>
            <Text style={styles.subText}>.pdf</Text>
          </TouchableOpacity>

          <View style={styles.buttons}>
            <TouchableOpacity onPress={mergeFiles} style={styles.mergeBtn}>
              <Text style={styles.buttonText}>Merge</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearFiles} style={styles.clearBtn}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#60a5fa',
    fontWeight: '500',
  },
  fileBoxLeft: {
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
    width: screenWidth * 0.35,
    height: 90,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    marginHorizontal: 4,
  },
  textWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  buttons: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
  },
  mergeBtn: {
    backgroundColor: '#4b5563',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: '30%',
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default MergeStructure;
