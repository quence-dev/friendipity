import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginSchema } from '@/schemas';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');

  async function validateEmail() {
    try {
        // TODO
    } catch(error) {
        // TODO
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>This will be the login screen.</Text>
      <TextInput autoComplete='email'
        onChangeText={setEmail}
        value={email}
        placeholder='johndoe@gmail.com'
        />
    </SafeAreaView>
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
  text: {
    fontSize: 18,
    color: '#000',
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