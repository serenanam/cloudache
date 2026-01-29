import AppButton from "@/components/app-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { auth } from "@/config/firebase";
import { MigraineRecord, getActiveMigraineRecord, saveMigraineRecord, updateMigraineRecord } from "@/services/migrainerecord";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from '@react-native-community/slider';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function StartMigraineRecord() {
  const router = useRouter();
  const user = auth.currentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [sliderValue, setSliderValue] = useState(5);

  // Load active migraine record if it exists
  useEffect(() => {
    if (!user) return;

    getActiveMigraineRecord(user.uid).then((record: MigraineRecord | null) => {
      if (record) {
        setIsEditing(true);
        setRecordId(record.id);
        setStartDate(record.startDate);
        setEndDate(record.endDate || new Date());
        setSliderValue(record.intensity);
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const recordData = {
      startDate,
      endDate,
      intensity: sliderValue,
    };

    let success = false;
    if (isEditing && recordId) {
      // Update existing record
      success = await updateMigraineRecord(user.uid, recordId, recordData);
    } else {
      // Create new record
      success = await saveMigraineRecord(user.uid, startDate, sliderValue);
    }

    if (success) {
      Alert.alert("Success", "Migraine record saved!");
      router.push("/dashboard");
    } else {
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Start Date & Time</ThemedText>
      <DateTimePicker
        value={startDate}
        mode="datetime"
        display="default"
        onChange={(_e, selected) => selected && setStartDate(selected)}
        accentColor="#F7F4ED"
      />


      <ThemedText style={styles.label}>Intensity: {sliderValue.toFixed(0)}</ThemedText>
      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={sliderValue}
        onValueChange={(value) => setSliderValue(value)}
        minimumTrackTintColor="#F7F4ED"
        maximumTrackTintColor="#F7F4ED"
        thumbTintColor="#424685"
        tapToSeek={true}
        renderStepNumber={true}
      />

    {isEditing && (
    <>
        <ThemedText style={styles.label}>End:</ThemedText>
        <DateTimePicker
            value={endDate || new Date()}
            mode="datetime"
            onChange={(event, selected) => selected && setEndDate(selected)}
            accentColor="#F7F4ED"
        />
    </>
    )}

      <AppButton
        title="Save"
        onPress={handleSave}
        height={50}
        width={160}
        style={{ marginTop: 24, backgroundColor: "#424685" }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#636395',
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    color: "#F7F4ED",
  },
});
