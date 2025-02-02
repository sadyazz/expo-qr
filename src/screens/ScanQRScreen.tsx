import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Vibration, Linking } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function ScanQRScreen() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <View />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setLastScanned(data);
    Vibration.vibrate();

    if (data.startsWith('http')) {
      const shouldOpen = window.confirm(`Open this URL?\n\n${data}`);
      if (shouldOpen) {
        try {
          await Linking.openURL(data);
        } catch (err) {
          alert('Could not open URL');
        }
      }
    } else {
      alert(`QR Code Content:\n\n${data}`);
    }
  };

  const toggleTorch = () => {
    setTorch(current => current === 'on' ? 'off' : 'on');
  };

  const handleScanAgain = () => {
    setScanned(false);
    setLastScanned(null);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.scanner}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        // torch={torch}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}>
             
              <View style={[styles.cornerTopLeft, styles.corner]} />
              <View style={[styles.cornerTopRight, styles.corner]} />
              <View style={[styles.cornerBottomLeft, styles.corner]} />
              <View style={[styles.cornerBottomRight, styles.corner]} />
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.controls}>
          <Ionicons 
            name={torch === 'on' ? 'flash' : 'flash-off'} 
            size={24} 
            color="white" 
            style={styles.torch}
            onPress={toggleTorch}
          />
        </View>
      </CameraView>
      {scanned && (
        <View style={styles.scanAgainContainer}>
          {lastScanned && (
            <Text style={styles.lastScannedText} numberOfLines={2}>
              Last scanned: {lastScanned}
            </Text>
          )}
          <Button title="Tap to Scan Again" onPress={handleScanAgain} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.2,
  },
  focusedContainer: {
    flex: 6,
  },
  corner: {
    width: 20,
    height: 20,
    borderColor: '#fff',
    position: 'absolute',
    borderRadius: 3,
  },
  cornerTopLeft: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    top: 0,
    right: 0,
  },
  cornerBottomLeft: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 0,
    right: 0,
  },
  controls: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  torch: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 10,
  },
  scanAgainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
  },
  lastScannedText: {
    color: 'white',
    marginBottom: 10,
    fontSize: 12,
  },
}); 