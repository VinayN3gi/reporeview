import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || process.env.FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASURNEMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const storage = getStorage(app);

export const uploadMeetingFile = (
  file: File,
  onProgress: (progress: number) => void,
  onComplete: (downloadUrl: string) => void,
  onError: (error: Error) => void
) => {
  console.log("Starting upload for file:", file.name, "Size:", file.size);
  try {
    const storageRef = ref(storage, `meetings/${Date.now()}-${file.name}`);
    console.log("Storage ref created:", storageRef.fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log("Upload task started");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}% (${snapshot.bytesTransferred} / ${snapshot.totalBytes})`);
        onProgress(progress);
      },
      (error) => {
        console.error("Upload error caught in state_changed:", error);
        onError(error);
      },
      () => {
        console.log("Upload complete, getting download URL...");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Download URL retrieved:", downloadURL);
          onComplete(downloadURL);
        }).catch((err) => {
          console.error("Error getting download URL:", err);
          onError(err);
        });
      }
    );
  } catch (error) {
    console.error("Error initiating upload:", error);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};