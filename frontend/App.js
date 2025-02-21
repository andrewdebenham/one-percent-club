import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthedUserProvider, useAuthedUser } from './contexts/AuthedUserProvider';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user } = useAuthedUser();

  // return login screen if no user, else return main app content
  return (
    <>
      <StatusBar barStyle="dark-content" />

      {user ? (
        <View style={styles.container}>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </View>
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const hideSplashScreenAfterDelay = async () => {
      // Wait for 3 seconds before hiding the splash screen
      await new Promise((resolve) => setTimeout(resolve, 1000));
      SplashScreen.hideAsync();
    };

    hideSplashScreenAfterDelay();
  }, []);

  return (
    <AuthedUserProvider>
        <AppContent />
    </AuthedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});