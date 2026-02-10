import * as Localization from "expo-localization";
import * as Location from 'expo-location';
import { Alert } from "react-native";

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
    console.log('Device location:', location.coords); // latitude, longitude
  
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  export const getUserTimezone = () => {
    // Get current location's timezone
    const timezone = Localization.getCalendars()[0]?.timeZone ?? "UTC";
    console.log("User timezone:", timezone);

    return timezone;

  };
      
  