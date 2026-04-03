import { db } from "@/config/firebase";
import { getUserLocation } from "@/services/location";
import { getWeather } from "@/services/weather";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";

export type DailyWeatherLog = {
  date: string; // YYYY-MM-DD
  temperature: number;
  pressure: number;
  tempDiff24h: number;
  pressureDiff24h: number;
  hadMigraine: boolean;
  migraineIntensity: number | null;
};

export async function markMigraineDay(userId: string, intensity: number) {
  const today = new Date().toISOString().split("T")[0];
  const logsRef = collection(db, "users", userId, "daily_logs");
  const snapshot = await getDocs(query(logsRef, where("date", "==", today)));

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, { hadMigraine: true, migraineIntensity: intensity });
  }
}

export async function backfillMissingDays(userId: string) {
  const logsRef = collection(db, "users", userId, "daily_logs");
  const coords = await getUserLocation();
  if (!coords) return;

  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Skip if already logged
    const existing = await getDocs(query(logsRef, where("date", "==", dateStr)));
    if (!existing.empty) continue;

    const weather = await getWeather(coords.latitude, coords.longitude, date);
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevWeather = await getWeather(coords.latitude, coords.longitude, prevDate);

    await addDoc(logsRef, {
      date: dateStr,
      temperature: weather.temperature,
      pressure: weather.pressure,
      tempDiff24h: weather.temperature - prevWeather.temperature,
      pressureDiff24h: weather.pressure - prevWeather.pressure,
      hadMigraine: false,
      migraineIntensity: null,
    });
  }
}