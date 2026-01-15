import { useState } from 'react';
import { Text, TextInput, StyleSheet, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/services/supabase';
import { loginSchema } from '@/schemas';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [invalid, setInvalid] = useState(false);

  function handleBlur() {
    if (!isValidEmail(email)) {
      setInvalid(true);
      return false;
    } else {
      setInvalid(false);
      return true;
    }
  }

  async function validateEmail() {
    const isValid = handleBlur();
    if (isValid) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: 'friendipity://', // Deep link back to app
        },
      });
      if (error) throw error;
      setSent(true);
      Alert.alert('Check your email! ', 'We sent you a magic link.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>This will be the login screen.</Text>
      <TextInput
        autoComplete="email"
        onChangeText={setEmail}
        onBlur={handleBlur}
        value={email}
        placeholder="johndoe@gmail.com"
      />
      {invalid && <Text>Invalid email</Text>}
      <Button title="Send code" onPress={validateEmail} disabled={loading} />
      {/* { loading ? (<>

        </>
        ) : (<>
        </>)} */}
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
