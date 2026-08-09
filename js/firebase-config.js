// Module for Firebase connection and setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'pixel-critique-dev';

export async function initFirebase() {
    let firebaseConfig = {};
    
    try {
        if (typeof window.__firebase_config !== 'undefined' && window.__firebase_config) {
            firebaseConfig = typeof window.__firebase_config === 'string' ? JSON.parse(window.__firebase_config) : window.__firebase_config;
        } else {
            console.warn("Firebase config not found. Operating in local fallback mode.");
            return { db: null, auth: null, userAuthId: null, appId };
        }
    } catch (e) {
        console.error("Error parsing Firebase config:", e);
        return { db: null, auth: null, userAuthId: null, appId };
    }

    if (Object.keys(firebaseConfig).length === 0) {
        return { db: null, auth: null, userAuthId: null, appId };
    }

    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
            await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }

        const userAuthId = auth.currentUser?.uid || null;
        console.log("Firebase connection established successfully. UID:", userAuthId);

        return { app, db, auth, userAuthId, appId };
    } catch (error) {
        console.error("Firebase auth/init error:", error);
        return { db: null, auth: null, userAuthId: null, appId, error };
    }
}

export function getReviewsCollection(db, appId) {
    if (!db) return null;
    return collection(db, 'artifacts', appId, 'public', 'data', 'game_reviews');
}
