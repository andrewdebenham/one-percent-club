import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { logout } from '../services/authService';
import ProgressGrid from '../components/ProgressGrid';

function HomeScreen() {
  const { setUser } = useAuthedUser(); // Access setUser to clear the user state

  const handleLogout = () => {
    logout(); // Call the logout function from authService
    setUser(null); // Clear the user from context
  };

  return (
    <View style={styles.container}>
      <ProgressGrid />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;