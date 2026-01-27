import AppButton from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill all fields.');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                createdAt: new Date(),
              });

              Alert.alert('Success', 'Account created successfully!');
              router.replace('/dashboard');
        } catch (error: any) {
            console.log(error);
            Alert.alert('Error', error.message || 'Something went wrong');
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
            <ThemedText type="title" style={{ marginBottom: 24 }}>Sign Up</ThemedText>
            <View style={styles.textcontainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    keyboardType="default"
                    autoCapitalize="none"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
            
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>
    
            
            <ThemedText style={{ marginTop: 16, opacity: 0.8 }}>
                Already have an account?{' '}
                <ThemedText
                    onPress={() => router.push('/login')}
                    style={{
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    }}
                >
                    Log in
                </ThemedText>
            </ThemedText>
            

        <AppButton
        title="Sign Up"
        onPress={handleSignUp}
        height={50}
        width={160}
        style={{ marginTop: 16, backgroundColor: '#424685' }}
        />
        </KeyboardAvoidingView>
        </ThemedView>
      );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
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