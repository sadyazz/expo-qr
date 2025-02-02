import { View, Text, StyleSheet } from 'react-native';

export default function GenerateQRScreen() {
  return (
    <View style={styles.container}>
      <Text>Generate QR Screen</Text>
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