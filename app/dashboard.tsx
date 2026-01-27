import { ThemedText } from '@/components/themed-text';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title">
        {name ? `Hi, ${name} 👋` : 'Hi 👋'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
