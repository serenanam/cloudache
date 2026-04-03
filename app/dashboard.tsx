import GaugeWidget from '@/components/gauge-widget';
import BottomNavBar from '@/components/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth, db } from '@/config/firebase';
import { backfillMissingDays } from '@/services/dailyLog';
import { getUserLocation } from '@/services/location';
import { getWeather } from '@/services/weather';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const [name, setName] = useState<string | null>(null);
  const [weather, setWeather] = useState<{
    temperature: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    pressure_min: number;
    pressure_max: number;
  } | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

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
        setLocation(coords);

        const weatherData = await getWeather(coords.latitude, coords.longitude);
        setWeather(weatherData);
        backfillMissingDays(user.uid);

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
    <ThemedView
      gradientColors={['#9c8eb7', '#424685', '#9c8eb7'] as const}
      gradientLocations={[0, 0.525, 1] as const}
      gradientStart={{ x: 1.928, y: -0.19 }}
      gradientEnd={{ x: -0.25, y: 1.105 }}
      style={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <ThemedText type="subtitle">{name ? `Hi, ${name}` : 'Hi '}</ThemedText>

          <View style={styles.preForecastContainer}>
            <ThemedText type="header">Migraine Forecast</ThemedText>
          </View>

          <ThemedText type="header">Today's Forecast</ThemedText>
          <View style={styles.locationText}>
            <Ionicons name="location-outline" size={18} color="#fff" />
            <ThemedText type="default">{location?.name ?? 'Unknown Location'}</ThemedText>
          </View>

          {weather ? (
            <View style={styles.locForecastContainer}>

              <View style={styles.forecastInfoContainer}>
                <View style={styles.iconText}>
                  <MaterialIcons name="cloud-queue" size={18} color="#fff" />
                  <ThemedText type="default">Temperature</ThemedText>
                </View>
                <View style={styles.gaugeWrapper}>
                  <GaugeWidget
                    current={weather.temperature}
                    low={weather.temp_min}
                    high={weather.temp_max}
                    unit="°F"
                    trend="up"
                    size={110}
                    tintColor="rgba(255,255,255,0.9)"
                    mutedColor="rgba(255,255,255,0.5)"
                  />
                </View>
              </View>

              <View style={styles.forecastInfoContainer}>
                <View style={styles.iconText}>
                  <Entypo name="gauge" size={18} color="#fff" />
                  <ThemedText type="default">Pressure</ThemedText>
                </View>
                <View style={styles.gaugeWrapper}>
                  <GaugeWidget
                    current={weather.pressure}
                    low={weather.pressure_min}
                    high={weather.pressure_max}
                    unit="inHg"
                    decimals={2}
                    trend="up"
                    size={110}
                    tintColor="rgba(255,255,255,0.9)"
                    mutedColor="rgba(255,255,255,0.5)"
                  />
                </View>
              </View>

            </View>
          ) : (
            <ThemedText type="default" style={{ marginTop: 16 }}>
              Weather data not available
            </ThemedText>
          )}
        </View>
      </View>

      <BottomNavBar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 110,
    paddingHorizontal: 24,
  },
  contentWrapper: {
    width: '95%',
    alignItems: 'flex-start',
  },
  locationText: {
    marginLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 20,
    marginTop: 5,
  },
  iconText: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 5,
  },
  preForecastContainer: {
    alignSelf: 'center',
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "#424685",
    borderRadius: 10,
    padding: 16,
    marginVertical: 32,
  },
  locForecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  forecastInfoContainer: {
    width: '45%',
    height: 150,
    backgroundColor: "#424685",
    borderRadius: 10,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  gaugeWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});