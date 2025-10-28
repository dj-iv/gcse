# GCSE → Japan Study Tracker 🇯🇵✈️

An engaging, interactive study dashboard designed to help track GCSE study progress with the ultimate reward: a trip to Japan!

## Features

- 📅 **Weekly Study Schedule** - Pre-populated study plans from Oct 27 to Dec 19, 2025
- ✅ **Task Tracking** - Click tasks to mark them complete
- 📊 **Progress Visualization** - See weekly completion rates and journey to Japan
- 💾 **Auto-Save** - All progress saved to localStorage
- 🎨 **Japan-Themed Design** - Beautiful sakura and torii gate decorations
- 🎯 **Point System** - Earn points for each completed task

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
5. Vercel will auto-detect Next.js and deploy!

### Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

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
- **shadcn/ui** - UI components

## License

Personal project - Feel free to adapt for your own use!

---

Made with ❤️ for aspiring students and Japan dreamers
