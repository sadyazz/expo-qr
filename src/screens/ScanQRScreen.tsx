import { View, Text, StyleSheet } from 'react-native';

export default function ScanQRScreen() {
  return (
    <View style={styles.container}>
      <Text>Scan QR Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 