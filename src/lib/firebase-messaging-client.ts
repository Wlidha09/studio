
"use client";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

// This key is generated from the Firebase console:
// Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = "BIP31aGg3KjHwdVmbdK8jIq-fL8dFm2g81M2zH_hI8H6zF5kG9dY7pW1fE3xL8sY9hW1cR7jZ4K3wA2bC1vD";

export const getMessagingToken = async () => {
  let token = null;
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration,
        });
      } else {
        console.log("Unable to get permission to notify.");
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  }
  return token;
};

export const onMessageListener = () =>
  new Promise<{notification: {title: string, body: string}}>((resolve, reject) => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          resolve(payload as {notification: {title: string, body: string}});
        } else {
          reject('No notification payload');
        }
      });
    } else {
      reject('Notifications not supported');
    }
  });

