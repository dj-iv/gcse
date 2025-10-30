# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "GCSE to Japan" or similar
4. Disable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Firestore Database
1. In Firebase console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules)
4. Select your region (europe-west2 for UK)
5. Click "Enable"

## 3. Enable Authentication
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

## 4. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app (name: "GCSE Tracker")
5. Copy the config values

## 5. Create .env.local file
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase config values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc...
   ```

## 6. Add Security Rules
In Firestore Database → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own progress
    match /users/{userId}/progress/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow parents to read their child's progress
    match /users/{userId}/progress/{document=**} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(userId)).data.parentId == request.auth.uid;
    }
  }
}
```

## 7. Create User Accounts
Run the app and create accounts for:
- Katerina (student account)
- Parent (monitoring account)

## 8. Restart Dev Server
```bash
npm run dev
```

Your progress will now sync across all devices! 🎉
