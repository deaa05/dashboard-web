import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyDcg14r-bMcH4geTMM13K-xEjKyCRfxZjI",
  authDomain:        "dashboard-1bdc5.firebaseapp.com",
  databaseURL:       "https://dashboard-1bdc5-default-rtdb.firebaseio.com",
  projectId:         "dashboard-1bdc5",
  storageBucket:     "dashboard-1bdc5.firebasestorage.app",
  messagingSenderId: "893144055898",
  appId:             "1:893144055898:web:8446e753ee3704ca625863",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
