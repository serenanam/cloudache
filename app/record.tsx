import AppButton from "@/components/app-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { auth } from "@/config/firebase";
import {
    MigraineRecord,
    getActiveMigraineRecord,
    saveMigraineRecord,
    updateMigraineRecord,
} from "@/services/migraineRecord";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function StartMigraineRecord() {
  const router = useRouter();
  const user = auth.currentUser;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [isEditing, setIsEditing] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sliderValue, setSliderValue] = useState(5);

  // Load active migraine record if it exists
  useEffect(() => {
    if (!user) return;
  
    getActiveMigraineRecord(user.uid).then(
      (record: MigraineRecord | null) => {
        if (record) {
          setIsEditing(true);
          setRecordId(record.id);
          setStartDate(record.startDate);
          setEndDate(record.endDate || new Date());
          setSliderValue(record.intensity);
  
          // If active record exists and not finished, go directly to step 3
          if (!record.endDate) {
            setStep(3);
          } else {
            setStep(1); // past record finished → start new
          }
        } else {
          setStep(1); // no active record → start new
        }
      }
    );
  }, [user]);


  const handlePainSave = async () => {
    if (!user) return;

    if (!isEditing) {
      // NEW RECORD → Save immediately
      const success = await saveMigraineRecord(
        user.uid,
        startDate,
        sliderValue
      );

      if (success) {
        Alert.alert("Success", "Migraine started!");
        router.push("/dashboard");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } else {
      // Editing → Move to End Date step
      setStep(3);
    }
  };

  const handleFinalUpdate = async () => {
    if (!user || !recordId) return;

    const success = await updateMigraineRecord(user.uid, recordId, {
      startDate,
      endDate,
      intensity: sliderValue,
    });

    if (success) {
      Alert.alert("Success", "Migraine updated!");
      router.push("/dashboard");
    } else {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };


  const renderStartStep = () => (
    <>
      <ThemedText style={styles.label}>
        Choose your migraine start date
      </ThemedText>

      <DateTimePicker
        value={startDate}
        mode="datetime"
        display="default"
        onChange={(_e, selected) =>
          selected && setStartDate(selected)
        }
      />

      <AppButton
        title="Next"
        onPress={() => setStep(2)}
        style={styles.primaryButton}
      />

      <AppButton
        title="Cancel"
        onPress={handleCancel}
        style={styles.secondaryButton}
      />
    </>
  );

  const renderPainStep = () => (
    <>
      <ThemedText style={styles.label}>
        Intensity: {sliderValue}
      </ThemedText>

      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={sliderValue}
        onValueChange={setSliderValue}
        minimumTrackTintColor="#F7F4ED"
        maximumTrackTintColor="#F7F4ED"
        thumbTintColor="#424685"
      />

      <AppButton
        title="Save"
        onPress={handlePainSave}
        style={styles.primaryButton}
      />

      <AppButton
        title="Back"
        onPress={() => setStep(1)}
        style={styles.secondaryButton}
      />

      <AppButton
        title="Cancel"
        onPress={handleCancel}
        style={styles.secondaryButton}
      />
    </>
  );

  const renderEndStep = () => (
    <>
      <ThemedText style={styles.label}>
        End Date & Time
      </ThemedText>

      <DateTimePicker
        value={endDate}
        mode="datetime"
        display="default"
        onChange={(_e, selected) =>
          selected && setEndDate(selected)
        }
      />

      <AppButton
        title="Save"
        onPress={handleFinalUpdate}
        style={styles.primaryButton}
      />

      <AppButton
        title="Back"
        onPress={() => setStep(2)}
        style={styles.secondaryButton}
      />

      <AppButton
        title="Cancel"
        onPress={handleCancel}
        style={styles.secondaryButton}
      />
    </>
  );

  /* -------------------- MAIN RETURN -------------------- */

  return (
    <ThemedView style={styles.container}>
      {step === 1 && renderStartStep()}
      {step === 2 && renderPainStep()}
      {step === 3 && isEditing && renderEndStep()}
    </ThemedView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#636395",
  },
  label: {
    marginTop: 12,
    fontSize: 18,
    color: "#F7F4ED",
    marginBottom: 12,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: "#424685",
    width: 180,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#9c8eb7",
    width: 180,
  },
});