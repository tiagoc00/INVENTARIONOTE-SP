import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);

// Inicializa Firestore SEM long polling forçado.
// Long polling era a causa principal da lentidão na conexão.
// O Firestore usa WebChannel por padrão, que é eficiente e rápido.
// Só ative experimentalForceLongPolling se WebSocket estiver bloqueado na rede.
export const db = initializeFirestore(app, {});
