import BottomNavBar from "@/components/navbar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { auth, db } from "@/config/firebase";
import { getUserTimezone } from "@/services/location";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

function intensityToColor(intensity: number) {
    const minColor = [207, 197, 221]; // #CFC5DD
    const maxColor = [54, 58, 110];   // #363A6E
    const ratio = (intensity - 1) / 9; // map 1-10 to 0-1
    const r = Math.round(minColor[0] + (maxColor[0] - minColor[0]) * ratio);
    const g = Math.round(minColor[1] + (maxColor[1] - minColor[1]) * ratio);
    const b = Math.round(minColor[2] + (maxColor[2] - minColor[2]) * ratio);
    return `rgb(${r},${g},${b})`;
}

function formatDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function CalendarPage() {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  
    useEffect(() => {
      const fetchMigraineRecords = async () => {
        const user = auth.currentUser;
        if (!user) return;
  
        const today = new Date();
        const timezone = getUserTimezone();
        const todayKey = formatDateKey(today, timezone);
        
        const migraineRef = collection(db, "users", user.uid, "migraine_records");
        const q = query(migraineRef, orderBy("startDate", "desc"));
        const snapshot = await getDocs(q);
  
        const dates: { [date: string]: any } = {};
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          const dateObj = data.startDate.toDate();
          const intensity = data.intensity || 1;
          const dateKey = formatDateKey(dateObj, timezone);

          const isToday = dateKey === todayKey;
  
          dates[dateKey] = {
            customStyles: {
              container: {
                backgroundColor: intensityToColor(intensity),
                borderRadius: 8,
                borderWidth: isToday ? 3 : 0,
                borderColor: isToday ? "#424685" : undefined,
              },
              text: {
                color: "#fff",
                fontWeight: "600",
              },
            },
          };
        });
        if (!dates[todayKey]) {
          dates[todayKey] = {
            customStyles: {
              container: {
                borderColor: "#424685",
                borderWidth: 2,
                borderRadius: 8,
              },
              text: {
                color: "#000",
                fontWeight: "600",
              },
            },
          };
      }
  
        setMarkedDates(dates);
      };
  
      fetchMigraineRecords();
    }, []);
  
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.header}>
          Migraine Calendar
        </ThemedText>
  
        <View style={styles.calendarWrapper}>
          
        <Calendar
          markingType={"custom"}
          markedDates={markedDates}
          theme={{
            todayTextColor: "#424685",
            arrowColor: "#424685",
            monthTextColor: "#424685",
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
          }}
        />
        </View>
        <BottomNavBar/>
      </ThemedView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 110,
      justifyContent: 'flex-start',
      backgroundColor: "#636395",
    },
    header: {
      alignSelf: 'center',
    },
    calendarWrapper: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      marginVertical: 32,
    }
  });