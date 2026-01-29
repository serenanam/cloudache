import { HelloWave } from '@/components/hello-wave';
import BottomNavBar from '@/components/navbar';
import { ThemedText } from '@/components/themed-text';
import { auth, db } from '@/config/firebase';
import { getUserLocation } from '@/services/location';
import { getWeather } from '@/services/weather';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const [name, setName] = useState<string | null>(null);
  const [weather, setWeather] = useState<{temperature: number; pressure: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Get user data
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return;

        const userData = docSnap.data();
        setName(userData.name);

        const coords = await getUserLocation();
        if (!coords) {
          setLoading(false);
          return;
        }

        const weatherData = await getWeather(coords.latitude, coords.longitude);

        setWeather(weatherData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    };

    fetchData();

  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
        <View style={styles.container}>
      <View style={styles.welcomecontainer}> 
        <ThemedText type="title">{name ? `Hi, ${name}` : 'Hi '} </ThemedText>
        <HelloWave/>
      </View>

      {weather? (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <ThemedText type="subtitle">
            Temperature: {weather.temperature.toFixed(0)}°F
          </ThemedText>
          <ThemedText type="subtitle">
            Pressure: {(weather.pressure * 0.02953).toFixed(2)} inHg
          </ThemedText>
        </View>
      ) : (
        <ThemedText type="subtitle" style={{ marginTop: 16 }}>
          Weather data not available
        </ThemedText>
      )}


      
      </View>
      <BottomNavBar/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#636395',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
