// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8IIYzKZbBl3dKU0qh2AqvH3n9PRyCHvI",
  authDomain: "streaming-platform-001.firebaseapp.com",
  projectId: "streaming-platform-001",
  storageBucket: "streaming-platform-001.firebasestorage.app",
  messagingSenderId: "765124129395",
  appId: "1:765124129395:web:bb6af0a5001ac21b943006",
  measurementId: "G-NS21M1VL3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);
export { auth };