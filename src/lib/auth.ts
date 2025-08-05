
"use client";

import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        return null;
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
