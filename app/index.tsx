import AppButton from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function LandingPage() {
  console.log('LandingPage rendered');
  const router = useRouter();
  
  return (
    <ThemedView
        gradientColors={['#dec2db00', '#dec2dbaa', '#dec2dbb3', '#424685', '#424685']}
        gradientStart={{ x: 0.2, y: 0 }}
        gradientEnd={{ x: 0.86, y: 1 }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        
        <ThemedText type="title" style={styles.title}>Cloudache</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Track migraines easily</ThemedText>

        
        <AppButton
        title="Get Started"
        onPress={() => router.push('/signup')}
        height={50}
        width={160}
        style={{ marginTop: 16, backgroundColor: '#424685' }}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,                     // fill the screen
      justifyContent: 'center',     // center vertically
      alignItems: 'center',         // center horizontally
      paddingHorizontal: 24,
    },
    title: {
      marginBottom: 16,
    },
    subtitle: {
      marginBottom: 64,
      textAlign: 'center',
    },
  });