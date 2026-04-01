import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACgyA7yGEV-JFsbFWmmLPoiL5I8imaays",
  authDomain: "school-management-system-sai.firebaseapp.com",
  projectId: "school-management-system-sai",
  storageBucket: "school-management-system-sai.firebasestorage.app",
  messagingSenderId: "640146756193",
  appId: "1:640146756193:web:027d3f1ac8a99e8c2d5020",
  measurementId: "G-YJTPN5V83N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
