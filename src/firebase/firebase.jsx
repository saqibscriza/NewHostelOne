import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC3Zc2hpE-PjAsDpAXyG4PeLu9vKIJhR_k",
  authDomain: "hostelo-21b16.firebaseapp.com",
  projectId: "hostelo-21b16",
  storageBucket: "hostelo-21b16.firebasestorage.app",
  messagingSenderId: "594582067311",
  appId: "1:594582067311:web:85c0e6b37cf4cb9bbf159a",
  measurementId: "G-41KN8K8H25"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
