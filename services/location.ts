import * as Localization from "expo-localization";
import * as Location from 'expo-location';
import { Alert } from "react-native";

export function getLocationName(place?: {
  district?: string | null;
  city?: string | null;
  region?: string | null;
}): string {
  if (!place) return "Unknown Location";

  if (place.district && place.region) return `${place.district}, ${place.region}`;
  if (place.city && place.region) return `${place.city}, ${place.region}`;
  if (place.region) return place.region;

  return "Unknown Location";
}

export const getUserLocation = async () => {
    // Ask for foreground location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Denied',
        'Enable location in settings to see weather'
      );
      return null;
    }
  
    
    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const placemarks = await Location.reverseGeocodeAsync({ latitude, longitude});
    // Take first placemark (closest)
    const place = placemarks[0];
    const name = getLocationName(place);

    console.log('Device location:', latitude, longitude, 'Name:', name);

  return {
    latitude,
    longitude,
    name,
  };
    
    
  };

  export const getUserTimezone = () => {
    // Get current location's timezone
    const timezone = Localization.getCalendars()[0]?.timeZone ?? "UTC";
    console.log("User timezone:", timezone);

    return timezone;

  };
      
  