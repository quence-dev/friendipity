import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { supabase } from './src/services/supabase';

function AppContent() {
  const { session, user, loading, signOut } = useAuth();

  const testConnection = async () => {
    try {
      const { error } = await supabase.from('users').select('count');
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Supabase connection working! ✅');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Supabase');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>friendipity</Text>
      
      {user ? (
        <>
          <Text style={styles.subtitle}>Logged in as: {user.email}</Text>
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Phone: {user.phone_number}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Not logged in</Text>
          <Text style={styles.info}>Auth setup complete!</Text>
        </>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Test Supabase Connection" onPress={testConnection} />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});