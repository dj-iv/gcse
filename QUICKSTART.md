# Quick Start Guide

## What's Been Added

✅ **Firebase Authentication** - Sign in from any device
✅ **Cloud Sync** - Progress syncs automatically across all devices  
✅ **Parent Monitoring** - You can view Katerina's progress in real-time
✅ **Sign Out Button** - In the header next to the date badge

## Next Steps

### 1. Set Up Firebase (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "GCSE to Japan"
3. Create project (disable Analytics if asked)

### 2. Enable Services

**Firestore Database:**
- Click "Build" → "Firestore Database" → "Create database"
- Choose "Start in test mode"
- Select region: europe-west2 (UK)

**Authentication:**
- Click "Build" → "Authentication" → "Get started"
- Enable "Email/Password"

### 3. Get Config

- Click gear icon → "Project settings"
- Scroll to "Your apps" → Click web icon (</>)
- Register app as "GCSE Tracker"
- **Copy the config values**

### 4. Create .env.local

Create file `c:\Users\roman\Documents\Projects\gcse\.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc...
```

### 5. Restart Development Server

```bash
npm run dev
```

### 6. Create Accounts

**For Katerina:**
- Open http://localhost:3003
- Click "Need an account? Sign up"
- Email: katerina@example.com (or her real email)
- Password: (create a secure password)

**For You (Parent):**
- Sign out (button in header)
- Create another account with your email
- This will be read-only monitoring

### 7. Link Parent Account (Optional)

To give parent account read access to Katerina's data, you'll need to:
1. Note Katerina's User ID from Firebase Console → Authentication
2. Add security rules in Firestore (see FIREBASE_SETUP.md)

## How It Works Now

- **Katerina** logs in on phone/tablet/laptop → marks tasks → progress saves to cloud
- **You** log in from anywhere → see her progress in real-time
- **All devices stay in sync** automatically!

## Testing

1. Log in as Katerina on your computer
2. Mark some tasks as done
3. Log in as Katerina on your phone
4. See the same tasks marked as done! ✨

---

Need help? Check FIREBASE_SETUP.md for detailed instructions!
