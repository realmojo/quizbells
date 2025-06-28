// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_E2U2dgb8Smz-dBzcrpVlsQtwnxOBCMQ",
  authDomain: "quizbells-2d26a.firebaseapp.com",
  projectId: "quizbells-2d26a",
  storageBucket: "quizbells-2d26a.firebasestorage.app",
  messagingSenderId: "116519638071",
  appId: "1:116519638071:web:f03b878d06712a4e1adbb2",
  measurementId: "G-KH8RLMC19C",
};

let messaging: ReturnType<typeof getMessaging> | null = null;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      console.log("✅ Firebase Messaging Init");
    } else {
      console.warn("⚠️ 이 브라우저는 FCM을 지원하지 않습니다.");
    }
  });
}

export { messaging, getToken, onMessage };
