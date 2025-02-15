import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// ✅ Correct Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8IIYzKZbBl3dKU0qh2AqvH3n9PRyCHvI",
  authDomain: "streaming-platform-001.firebaseapp.com",
  projectId: "streaming-platform-001",
  storageBucket: "streaming-platform-001.appspot.com", // ✅ Fixed typo
  messagingSenderId: "765124129395",
  appId: "1:765124129395:web:bb6af0a5001ac21b943006",
  measurementId: "G-NS21M1VL3Y"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export both auth and db correctly (NO DUPLICATES)
export { auth, db };
