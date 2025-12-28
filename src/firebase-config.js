// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8ebi1-AdnarVVeM3UhxgGg6HDqY39cH4",
  authDomain: "fir-proj-3c55e.firebaseapp.com",
  projectId: "fir-proj-3c55e",
  storageBucket: "fir-proj-3c55e.firebasestorage.app",
  messagingSenderId: "1041037777184",
  appId: "1:1041037777184:web:dac54e4269ed2924d31f45",
  measurementId: "G-94B2BFMF9G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);