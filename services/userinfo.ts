import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function validateEmail(email: string) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// main sign-up function
export async function signUpUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (error: any) {
    console.error("Error signing up user:", error);
    throw error;
  }
}
