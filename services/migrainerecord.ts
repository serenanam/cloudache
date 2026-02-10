import { db } from "@/config/firebase";
import { getUserLocation, getUserTimezone } from "@/services/location";
import { getWeather } from "@/services/weather";
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

export type MigraineRecord = {
    id: string;
    timezone: any;
    startDate: Date;

    intensity: number;

    created_at: any;
    startTemperature: number;
    startPressure: number;

    tempDiff24h: number;
    pressureDiff24h: number;

    endTemperature?: number;
    endPressure?: number;

    endDate: Date | null;
};

export async function saveMigraineRecord(userId: string, startDate: Date, intensity: number) {
  try {

    const coords = await getUserLocation();
    if (!coords) throw new Error("No location available");

    // get user timezone
    const timezone = getUserTimezone();

    // get current weather
    const currentWeather = await getWeather(
      coords.latitude,
      coords.longitude
    );

    const startTemperature = currentWeather.temperature;
    const startPressure = currentWeather.pressure;

    // get yesterday weather
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayWeather = await getWeather(
      coords.latitude,
      coords.longitude,
      yesterday // we will add this support below
    );

    const tempDiff24h =
      startTemperature - yesterdayWeather.temperature;

    const pressureDiff24h =
      startPressure - yesterdayWeather.pressure;


    await addDoc(collection(db, "users", userId, "migraine_records"), {
        startDate,
        timezone,
        intensity,
        created_at: serverTimestamp(),
        startTemperature,
        startPressure,
        tempDiff24h,
        pressureDiff24h,
        endDate: null,
        
    });
    return true;
  } catch (error) {
    console.error("Error saving migraine record:", error);
    return false;
  }
}

export async function getActiveMigraineRecord(userId: string) {
    const migraineRef = collection(db, "users", userId, "migraine_records");
    const q = query(migraineRef, where("endDate", "==", null), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      const data = docData.data();

      return {
        id: docData.id,
        timezone: data.timezone,
        startDate: data.startDate.toDate ? data.startDate.toDate() : data.startDate,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate,
        intensity: data.intensity,
        created_at: data.created_at,
      };
    }
    return null;
  }

  export async function updateMigraineRecord(userId: string, recordId: string, updates: any) {
    try {
      const recordRef = doc(db, "users", userId, "migraine_records", recordId);
      await updateDoc(recordRef, updates);
      return true;
    } catch (error) {
      console.error("Error updating migraine record:", error);
      return false;
    }
  }