import { auth } from '@/config/firebase';
import { getActiveMigraineRecord } from '@/services/migraineRecord';
import { FontAwesome5, Foundation, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function BottomNavBar() {
  const router = useRouter();

  const [hasActiveMigraine, setHasActiveMigraine] = useState(false);

  useEffect(() => {
    const fetchActiveMigraine = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const record = await getActiveMigraineRecord(user.uid);
      setHasActiveMigraine(!!record);
    };

    fetchActiveMigraine();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={() => router.push('/dashboard')}>
        <Ionicons name="grid" size={32} color="#424685" />
      </Pressable>

      <Pressable style={styles.iconButton} onPress={() => router.push('/calendar')}>
        <FontAwesome5 name="calendar-alt" size={32} color="#424685" />
      </Pressable>

      <Pressable style={styles.middleButton} onPress={() => router.push('/record')}>
        {hasActiveMigraine ? (
          <MaterialIcons name="pause" size={48} color="#fff" />
        ) : (
          <MaterialIcons name="bolt" size={48} color="#fff" />
        )}
      </Pressable>

      <Pressable style={styles.iconButton} onPress={() => router.push('/report')}>
        <Foundation name="graph-bar" size={40} color="#424685" />
      </Pressable>

      <Pressable style={styles.iconButton} onPress={() => router.push('/profile')}>
        <Ionicons name="settings-sharp" size={32} color="#424685" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#F7F4ED',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconButton: {
    padding: 12,
  },
  middleButton: {
    width: 72,
    height: 72,
    borderRadius: 32,
    backgroundColor: '#424685',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: -36,
  },
});