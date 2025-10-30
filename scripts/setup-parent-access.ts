// This script sets up parent access by creating a mapping from Katerina's email to her userId
// Run this ONCE after Katerina has signed in for the first time

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupParentAccess() {
  const KATERINA_EMAIL = "rom.kat08@gmail.com";
  
  // You need to get Katerina's userId after she signs in
  // Check the Firestore console under "users" collection to find her userId
  // Then paste it here:
  const KATERINA_USER_ID = "PASTE_KATERINAS_USER_ID_HERE";
  
  if (KATERINA_USER_ID === "PASTE_KATERINAS_USER_ID_HERE") {
    console.error("❌ Please update KATERINA_USER_ID with her actual userId from Firestore!");
    console.log("\nSteps:");
    console.log("1. Have Katerina sign in to the app");
    console.log("2. Go to Firebase Console > Firestore Database");
    console.log("3. Look in the 'users' collection for her document");
    console.log("4. Copy the document ID (her userId)");
    console.log("5. Paste it in this script where it says PASTE_KATERINAS_USER_ID_HERE");
    console.log("6. Run this script again");
    return;
  }
  
  try {
    // Create the email -> userId mapping
    const mappingRef = doc(db, "userMappings", KATERINA_EMAIL);
    await setDoc(mappingRef, {
      userId: KATERINA_USER_ID,
      email: KATERINA_EMAIL,
      createdAt: new Date().toISOString(),
    });
    
    console.log("✅ Parent access set up successfully!");
    console.log(`Parent (romanov.ivan@gmail.com) can now view Katerina's progress`);
  } catch (error) {
    console.error("❌ Error setting up parent access:", error);
  }
}

setupParentAccess();
