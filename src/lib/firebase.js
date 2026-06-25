import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore"; // <-- Agregamos esto
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMI-MRDFV5aD7Gk1NDK8omS6EcqPjOrk4",
  authDomain: "mis-tickets-8a29a.firebaseapp.com",
  projectId: "mis-tickets-8a29a",
  storageBucket: "mis-tickets-8a29a.firebasestorage.app",
  messagingSenderId: "962394076222",
  appId: "1:962394076222:web:f9a3415d1dd191fe3d4d6f"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
// Exportamos estas funciones para usarlas en el componente
export { doc, deleteDoc, updateDoc };
