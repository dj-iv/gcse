# GCSE → Japan Study Tracker 🇯🇵✈️

Katerina's journey to Japan through GCSE success!

## Features

- 📅 **Weekly Study Schedule** - Pre-populated study plans from Oct 27 to Dec 19, 2025
- ✅ **Task Tracking** - Click tasks to mark them complete
- 📊 **Progress Visualization** - See weekly completion rates and journey to Japan
- ☁️ **Cloud Sync** - Firebase syncs progress across all devices
- 👀 **Parent Monitoring** - Parents can view progress in real-time
- 🔒 **Sunday Lock** - Lock weekly progress every Sunday with confirmation
- 🎨 **Japan-Themed Design** - Beautiful sakura and torii gate decorations
- 🎯 **Point System** - Earn points for each completed task

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Follow the instructions in `FIREBASE_SETUP.md` to:
- Create a Firebase project
- Enable Firestore and Authentication
- Get your Firebase config
- Create `.env.local` with your credentials

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Create Accounts

- **Student Account**: For Katerina to track her progress
- **Parent Account**: For monitoring (read-only access)

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. **Add Environment Variables** from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. Deploy!

## How It Works

### For Students (Katerina)
1. Sign in to your account
2. View your weekly study tasks
3. Click "Start →" to access learning resources
4. Mark tasks as done by clicking the time badge
5. On Sunday, click "Lock week" to bank your points
6. Watch your Japan progress bar fill up! 🗾

### For Parents
1. Sign in with your account
2. View Katerina's real-time progress
3. See completed tasks, points, and Japan progress
4. Progress syncs automatically across all devices

## Study Schedule

The app includes a pre-configured weekly schedule:

- **Monday**: English Language + Physics
- **Tuesday**: Maths + German
- **Wednesday**: English Literature + Chemistry
- **Thursday**: Geography + Biology
- **Friday**: Review + English refinement
- **Saturday**: Maths Challenge + Art Portfolio
- **Sunday**: Catch-up / Rest day

## Customization

Edit the `PLAN_BY_DAY` object in `components/GCSEToJapanDashboard.tsx` to customize:
- Study subjects
- Daily tasks
- Time allocations
- Resources

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Firebase** - Authentication & Database
- **shadcn/ui** - UI components

## Security

Firebase security rules ensure:
- Users can only edit their own data
- Parents can view (read-only) their child's progress
- Data is encrypted in transit and at rest

---

Made with ❤️ for Katerina's journey to Japan 🇯🇵✨
