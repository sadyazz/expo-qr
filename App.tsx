import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import ScanQRScreen from './src/screens/ScanQRScreen';
import GenerateQRScreen from './src/screens/GenerateQRScreen';

type TabParamList = {
  ScanQR: undefined;
  GenerateQR: undefined;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export default function App() {
  return (
    <SafeAreaProvider style={styles.safeAreaView}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
            tabBarStyle: { backgroundColor: '#fff' },
            tabBarIndicatorStyle: { backgroundColor: '#F06292' },
            tabBarActiveTintColor: '#F06292',
            tabBarInactiveTintColor: '#666',
          }}
        >
          <Tab.Screen 
            name="ScanQR" 
            component={ScanQRScreen}
            options={{
              title: 'Scan QR'
            }}
          />
          <Tab.Screen 
            name="GenerateQR" 
            component={GenerateQRScreen}
            options={{
              title: 'Generate QR'
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeAreaView:{
    flex: 1,
    marginTop:50
  }
});
