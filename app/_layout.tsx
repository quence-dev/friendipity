import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootLayoutContent() {
  const { loading } = useAuth();

  // Handle deep links for magic link authentication
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      // Supabase magic links contain access_token and refresh_token in the URL fragment
      // The session will be automatically detected by AuthContext
      // We just need to trigger a session check
      if (url.includes('access_token') || url.includes('refresh_token')) {
        // Supabase client will automatically handle the tokens from the URL
        // Your AuthContext's onAuthStateChange listener will pick up the new session
        console.log('Magic link detected, session should update automatically');
      }
    };

    // Listen for incoming deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Splash' }} />
      <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
