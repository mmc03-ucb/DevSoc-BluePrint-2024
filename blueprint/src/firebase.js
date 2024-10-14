// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6TiKwVQA9MP6YanKbiDmV-D-FUaa-8nU",
  authDomain: "blueprint-2024-ee679.firebaseapp.com",
  projectId: "blueprint-2024-ee679",
  storageBucket: "blueprint-2024-ee679.appspot.com",
  messagingSenderId: "221932361273",
  appId: "1:221932361273:web:d0f9352ba7d0742801dfe8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
