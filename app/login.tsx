import AppButton from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/config/firebase';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <ThemedView
      gradientColors={['#dec2db00', '#dec2dbaa', '#dec2dbb3', '#424685', '#424685']}
      gradientStart={{ x: 0.2, y: 0 }}
      gradientEnd={{ x: 0.86, y: 1 }}
      style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
          Welcome Back!
        </ThemedText>

        <View style={styles.textcontainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <ThemedText style={{ marginTop: 16, opacity: 0.8 }}>
          Don't have an account?{' '}
          <ThemedText
            onPress={() => router.push('/signup')}
            style={{
              fontWeight: '600',
              textDecorationLine: 'underline',
            }}
          >
            Sign Up
          </ThemedText>
        </ThemedText>

        <AppButton
          title="Log In"
          onPress={handleLogin}
          style={{ marginTop: 16, backgroundColor: '#424685' }}
        />


      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textcontainer: {
    gap: 20,
    padding: 10,
    width: '90%',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#ffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Raleway-SemiBold',
    color: '#fff',
  },
});
