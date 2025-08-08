
"use client";

import { getAuth, signInWithPopup, GoogleAuthProvider, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'webClientId': '913952811592-7rmagrurc80vs2404g01d028btblicra.apps.googleusercontent.com'
});


export async function signInWithGoogle(): Promise<User | null> {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google: ", error);
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
