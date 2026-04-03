import AppButton from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function LandingPage() {
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,}}>
        <ThemedText type="title" style={styles.title}>Cloudache</ThemedText>
        <ThemedText type="header" style={styles.header}>Track migraines easily</ThemedText>

        <AppButton
          title="Get Started"
          onPress={() => router.push('/signup')}
          style={{ marginTop: 16, backgroundColor: '#424685' }}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 16,
    fontSize: 56,
  },
  header: {
    marginBottom: 64,
    textAlign: 'center',
  },
});