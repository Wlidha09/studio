
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        console.warn("Firebase Admin SDK service account key not found. Push notifications will be disabled.");
        // Initialize without credentials if you only need other services when running locally
        // This will have limited permissions.
        admin.initializeApp();
    }
}


export const adminApp = admin.app();
