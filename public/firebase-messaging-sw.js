// This file must be in the public directory

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// You can get this from the Firebase console.
const firebaseConfig = {
  "projectId": "hresource-42xov",
  "appId": "1:591491822516:web:b0f99c158ffd35179f78e1",
  "storageBucket": "hresource-42xov.firebasestorage.app",
  "apiKey": "AIzaSyBjvNMOaxQNE3UWQq9t7Vlu_ycNhqofilY",
  "authDomain": "hresource-42xov.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "591491822516"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // You can add a logo here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
