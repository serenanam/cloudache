import { db } from "@/config/firebase";
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

export type MigraineRecord = {
    id: string;
    startDate: Date;
    endDate: Date | null;
    intensity: number;
    created_at: any;
};

export async function saveMigraineRecord(userId: string, startDate: Date, intensity: number) {
  try {
    await addDoc(collection(db, "users", userId, "migraine_records"), {
        startDate,
        intensity,
        created_at: serverTimestamp(),
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