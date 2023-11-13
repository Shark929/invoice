import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const {
    VITE_apiKey,
    VITE_authDomain,
    VITE_projectId,
    VITE_storageBucket,
    VITE_messagingSenderId,
    VITE_appId,
    // VITE_measurementId,
} = import.meta.env;

const firebaseConfig = {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    db,
}