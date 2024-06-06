// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "realestate-63bb7.firebaseapp.com",
  projectId: "realestate-63bb7",
  storageBucket: "realestate-63bb7.appspot.com",
  messagingSenderId: "137241136993",
  appId: "1:137241136993:web:a71e7ea7748ce0baadbf20"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);