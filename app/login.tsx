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
        style={{flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ThemedText type="title" style={{ marginBottom: 24 }}>
          Log In
        </ThemedText>

        <View style={styles.textcontainer}>
            <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            />

            <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />
        </View>
        

        <AppButton
          title="Log In"
          onPress={handleLogin}
          height={50}
          width={160}
          style={{ marginTop: 16, backgroundColor: '#424685' }}
        />

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
        padding: 20,
        borderRadius: 8,
        backgroundColor: '#636395',
        width: '100%',
  },
  input: {
    borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: '#D9D9D9',
  },
});
