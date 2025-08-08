
"use client";

import { getAuth, signInWithPopup, GoogleAuthProvider, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthProvider, getRedirectResult } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  'webClientId': '913952811592-7rmagrurc80vs2404g01d028btblicra.apps.googleusercontent.com'
});


export async function signInWithGoogle(): Promise<User | null> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        throw error;
    }
}

export async function signInWithProvider(provider: AuthProvider): Promise<User | null> {
    try {
        const result = await signInWithPopup(auth, provider)
        return result.user;
    } catch (error) {
        console.error("Error signing in with popup: ", error);
        throw error;
    }
}

export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Email: ", error);
        throw error;
    }
}

export async function createUserWithEmail(email: string, pass: string): Promise<User | null> {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        return result.user;
    } catch (error) {
        console.error("Error creating user with Email: ", error);
        throw error;
    }
}

export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out: ", error);
    }
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log("User from redirect:", user, "with token:", token);
      return user;
    }
    return null;
  } catch(error) {
    const errorCode = (error as any).code;
    const errorMessage = (error as any).message;
    const email = (error as any).customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error as any);
    console.error("Error from redirect result:", errorCode, errorMessage, email, credential);
    throw error;
  }
}
