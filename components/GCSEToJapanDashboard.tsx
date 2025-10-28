"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// --- SAMPLE DATA MODEL ---
// localStorage persists progress across sessions

const START_DATE = new Date("2025-10-27");
const END_DATE = new Date("2025-12-19");

// Daily study plan template by weekday (0=Mon,...6=Sun)
const PLAN_BY_DAY: Record<number, Array<{
  subject: string;
  task: string;
  resource: string;
  minutes: number;
  url?: string;
}>> = {
  0: [
    {
      subject: "English Language",
      task:
        "Watch Mr Bruff narrative / descriptive writing and write 1 creative paragraph (~200 words)",
      resource: "YouTube: Mr Bruff",
      minutes: 30,
      url: "https://www.youtube.com/@mrbruff",
    },
    {
      subject: "Physics",
      task:
        "FreeScienceLessons: Forces & Velocity-Time Graphs. Write 5 key facts in notes",
      resource: "YouTube: FreeScienceLessons",
      minutes: 30,
      url: "https://www.youtube.com/@Freesciencelessons",
    },
  ],
  1: [
    {
      subject: "Maths",
      task:
        "DrFrost / Corbett / Sparks: algebra & quadratics. Do 10 questions, mark + correct",
      resource: "DrFrost / Corbett / Sparks",
      minutes: 30,
      url: "https://www.drfrostmaths.com/",
    },
    {
      subject: "German",
      task:
        "Learn 20 new words (Quizlet / Duolingo) + write 5 short sentences using them",
      resource: "Duolingo / Quizlet",
      minutes: 30,
      url: "https://www.duolingo.com/",
    },
  ],
  2: [
    {
      subject: "English Literature",
      task:
        "Read set text (e.g. An Inspector Calls). Pick 3 key quotes and explain why they matter",
      resource: "Book / BBC Bitesize Lit",
      minutes: 30,
      url: "https://www.bbc.co.uk/bitesize/examspecs/zy3ptyc",
    },
    {
      subject: "Chemistry",
      task:
        "FreeScienceLessons: bonding / structure. Do Seneca mini-quiz",
      resource: "YouTube / Seneca",
      minutes: 30,
      url: "https://www.youtube.com/@Freesciencelessons",
    },
  ],
  3: [
    {
      subject: "Geography",
      task:
        "BBC Bitesize: Rivers / Coasts / Climate. Make a mini mind map or case study summary",
      resource: "BBC Bitesize Geography",
      minutes: 30,
      url: "https://www.bbc.co.uk/bitesize/subjects/zkw76sg",
    },
    {
      subject: "Biology",
      task:
        "Biology recap (cells / organs / health). Self-quiz 5 short-answer questions",
      resource: "BBC Bitesize / Seneca",
      minutes: 30,
      url: "https://www.bbc.co.uk/bitesize/examspecs/zpgcbk7",
    },
  ],
  4: [
    {
      subject: "Review + English Lang polish",
      task:
        "Pick weakest topic of the week and do 20 mins past questions. Then improve one paragraph from Monday",
      resource: "Past paper / own writing",
      minutes: 45,
      url: "https://www.bbc.co.uk/bitesize/examspecs/z8z8jty",
    },
  ],
  5: [
    {
      subject: "Maths Challenge / Sparks",
      task:
        "Sparks / DrFrost challenge mode. Aim top of school. Record score",
      resource: "Sparks / DrFrost",
      minutes: 30,
      url: "https://sparxmaths.com/",
    },
    {
      subject: "Art Portfolio",
      task:
        "Sketchbook development page: observational drawing OR refining an idea. Take photo when done",
      resource: "Your sketchbook / Pinterest ref",
      minutes: 45,
      url: "https://www.pinterest.com/search/pins/?q=art%20sketchbook%20ideas",
    },
  ],
  6: [
    {
      subject: "Catch-up / Rest",
      task:
        "If Mon–Sat done: REST ❤️ If not, finish 1 missed task. Max 45 mins total",
      resource: "",
      minutes: 45,
    },
  ],
};

interface DaySchedule {
  iso: string;
  label: string;
  weekNumber: number;
  tasks: Array<{
    subject: string;
    task: string;
    resource: string;
    minutes: number;
    url?: string;
  }>;
}

// Helper: build all calendar days between START_DATE and END_DATE
function buildSchedule(): DaySchedule[] {
  const days: DaySchedule[] = [];
  const start = new Date(START_DATE);
  const end = new Date(END_DATE);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayIdx = (d.getDay() + 6) % 7; // make Monday=0 ... Sunday=6
    const plan = PLAN_BY_DAY[dayIdx] || [];
    // Format date manually to avoid hydration mismatch
    const dateObj = new Date(d);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${dayNames[dateObj.getDay()]} ${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
    
    days.push({
      iso: d.toISOString().split("T")[0],
      label: label,
      weekNumber: getWeekNumber(new Date(d)),
      tasks: plan.map((t) => ({ ...t })),
    });
  }
  return days;
}

// Simple academic-style week number counter starting from START_DATE as Week 1
function getWeekNumber(date: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startCopy = new Date(START_DATE);
  const dateCopy = new Date(date);
  startCopy.setHours(0, 0, 0, 0);
  dateCopy.setHours(0, 0, 0, 0);
  const diff = dateCopy.getTime() - startCopy.getTime();
  return Math.floor(diff / msPerDay / 7) + 1;
}

export default function GCSEToJapanDashboard() {
  // doneLog: { [isoDate]: { [taskIndex]: true } }
  const [doneLog, setDoneLog] = useState<Record<string, Record<number, boolean>>>({});
  const [cumulativePoints, setCumulativePoints] = useState(0);
  const [activeWeek, setActiveWeek] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    const savedLog = localStorage.getItem("gcse-done-log");
    const savedPoints = localStorage.getItem("gcse-cumulative-points");
    if (savedLog) {
      try {
        setDoneLog(JSON.parse(savedLog));
      } catch (e) {
        console.error("Failed to parse saved log", e);
      }
    }
    if (savedPoints) {
      setCumulativePoints(Number(savedPoints));
    }
  }, []);

  // Save to localStorage whenever doneLog changes
  useEffect(() => {
    localStorage.setItem("gcse-done-log", JSON.stringify(doneLog));
  }, [doneLog]);

  // Save cumulative points
  useEffect(() => {
    localStorage.setItem("gcse-cumulative-points", String(cumulativePoints));
  }, [cumulativePoints]);

  const schedule = useMemo(() => buildSchedule(), []);

  const weeks = useMemo(() => {
    const grouped: Record<number, DaySchedule[]> = {};
    schedule.forEach((day) => {
      if (!grouped[day.weekNumber]) grouped[day.weekNumber] = [];
      grouped[day.weekNumber].push(day);
    });
    return grouped;
  }, [schedule]);

  const currentWeekDays = weeks[activeWeek] || [];

  // Calculate weekly stats
  const { totalTasks, completedTasks, points } = useMemo(() => {
    let t = 0;
    let c = 0;
    currentWeekDays.forEach((day) => {
      day.tasks.forEach((_, idx) => {
        t += 1;
        if (doneLog?.[day.iso]?.[idx]) {
          c += 1;
        }
      });
    });
    return {
      totalTasks: t,
      completedTasks: c,
      points: c, // 1 point per completed task
    };
  }, [currentWeekDays, doneLog]);

  // Japan progress
  const japanProgress = useMemo(() => {
    const target = 700; // arbitrary full bar number before "JAPAN!"
    const pct = Math.min(100, Math.round(((cumulativePoints + points) / target) * 100));
    return pct;
  }, [cumulativePoints, points]);

  // Countdown to 19 Dec 2025
  const daysLeft = useMemo(() => {
    const now = new Date();
    const diff = END_DATE.getTime() - now.getTime();
    const rawDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return rawDays < 0 ? 0 : rawDays;
  }, []);

  function toggleTaskDone(dayIso: string, taskIdx: number) {
    setDoneLog((prev) => {
      const dayLog = prev[dayIso] ? { ...prev[dayIso] } : {};
      dayLog[taskIdx] = !dayLog[taskIdx];
      return {
        ...prev,
        [dayIso]: dayLog,
      };
    });
  }

  function lockWeekAndAddPoints() {
    // parent click at end of week to "bank" points towards Japan
    setCumulativePoints((p) => p + points);
    alert(`Week ${activeWeek} locked! 🎉 ${points} points added to Japan fund!`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 text-slate-800 flex flex-col gap-6 p-4 md:p-8 relative overflow-hidden">
      {/* Anime Girl */}
      <motion.div
        className="absolute bottom-5 left-5 w-40 md:w-52 z-0"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img 
          src="/anime-girl-student.png" 
          alt="Study girl" 
          className="drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
        />
      </motion.div>
      
      {/* Floating anime decorations */}
      <motion.div
        className="absolute top-10 right-10 text-6xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌸
      </motion.div>
      
      <motion.div
        className="absolute top-40 left-20 text-5xl"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        ✨
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 right-32 text-5xl"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        🎀
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 left-10 text-4xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        💖
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 left-1/4 text-5xl"
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        🦋
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 right-20 text-4xl"
        animate={{
          x: [0, -20, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        🎨
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/4 text-6xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 20, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        🌟
      </motion.div>

      {/* HEADER / HERO */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
        <div>
          <motion.h1 
            className="text-2xl md:text-4xl font-bold flex items-center gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Katerina on her way to Japan
            </span>
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✈️
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🇯🇵
            </motion.span>
          </motion.h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium bg-gradient-to-r from-pink-200 to-purple-200 text-pink-700 px-3 py-1 rounded-full border-2 border-pink-300">
              Term Goal: 19 Dec 2025
            </span>
          </div>
          <p className="text-sm md:text-base text-purple-700 mt-2 font-medium">
            "Every study session is one step closer to ramen in Tokyo." 🍜
          </p>
        </div>
        <motion.div 
          className="flex flex-col items-start md:items-end"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm text-purple-600 font-medium">Days until 19 Dec 2025</div>
          <div className="text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {daysLeft}
          </div>
        </motion.div>
      </header>

      {/* DASHBOARD CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Weekly Score */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="rounded-2xl shadow-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="text-purple-600 text-xs uppercase tracking-wide font-bold">This Week</div>
              <div className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Week {activeWeek} ⭐
              </div>
              <div className="text-sm text-slate-700 font-medium">{completedTasks} / {totalTasks} tasks done</div>
              <div className="text-sm font-bold text-pink-600">Points this week: {points} 🎯</div>
              <div className="text-xs text-purple-500">1 task = 1 point</div>
              <Button 
                onClick={lockWeekAndAddPoints} 
                className="mt-2 w-full text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md"
              >
                Lock week & add to Japan total 🔒
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Japan Progress */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="rounded-2xl shadow-lg border-2 border-purple-200 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="text-purple-600 text-xs uppercase tracking-wide font-bold">Journey to Japan</div>
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {japanProgress}% 🗾
                </div>
                <div className="text-xs text-purple-500">Goal: Grade 7+ in all GCSEs</div>
              </div>
              <div className="relative">
                <Progress value={japanProgress} className="h-4 rounded-full bg-purple-100" />
                <motion.div
                  className="absolute top-0 left-0 h-4 rounded-full overflow-hidden"
                  style={{ width: `${japanProgress}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
                </motion.div>
              </div>
              <div className="text-[11px] text-purple-600 leading-snug font-medium">
                When the bar hits 100%, we book Japan 🇯🇵. Keep going! がんばって！
              </div>
            </CardContent>
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.15, y: 0 }}
              transition={{ duration: 1 }}
              src="/japan-torii-light.svg"
              alt="torii gate"
              className="absolute -bottom-2 right-2 w-24 pointer-events-none select-none"
            />
          </Card>
        </motion.div>

        {/* Motivation */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="rounded-2xl shadow-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 backdrop-blur relative overflow-hidden">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="text-pink-600 text-xs uppercase tracking-wide font-bold">This Week&apos;s Energy</div>
              <div className="text-lg font-semibold leading-snug bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                "Small consistent effort beats last-minute panic." 💪
              </div>
              <div className="text-xs text-purple-600 leading-snug font-medium">
                You don&apos;t need perfect. You just need today. ✨
              </div>
              <div className="text-[11px] text-pink-500 font-medium">
                Reward ideas this week: Boba 🧋 • Movie night 🎬 • £5 bonus 💰 • Pick dinner 🍕
              </div>
            </CardContent>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.18, scale: 1 }}
              transition={{ duration: 1 }}
              src="/japan-sakura-light.svg"
              alt="sakura"
              className="absolute -bottom-3 -right-3 w-28 pointer-events-none select-none"
            />
          </Card>
        </motion.div>
      </section>

      {/* WEEK SELECTOR */}
      <section className="flex flex-wrap items-center gap-2 relative z-10">
        <div className="text-sm font-semibold text-purple-700">Week:</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(weeks).map((w) => (
            <motion.div key={w} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant={Number(w) === activeWeek ? "default" : "outline"}
                className={`rounded-xl font-semibold ${
                  Number(w) === activeWeek
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "border-pink-300 text-purple-600 hover:bg-pink-50"
                }`}
                onClick={() => setActiveWeek(Number(w))}
              >
                {w}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="text-[11px] text-purple-500 font-medium">
          Each week is pre-filled from Mon 27 Oct → Fri 19 Dec 2025. ✨
        </div>
      </section>

      {/* WEEK VIEW TIMETABLE */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {currentWeekDays.map((day) => (
          <motion.div
            key={day.iso}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="rounded-2xl shadow-lg border-2 border-pink-200 flex flex-col bg-gradient-to-br from-white to-pink-50">
              <CardContent className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="text-base font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {day.label}
                  </div>
                  <div className="text-[11px] text-purple-500">{day.iso}</div>
                </div>

                {day.tasks.map((task, idx) => {
                  const done = !!doneLog?.[day.iso]?.[idx];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl border-2 p-3 flex flex-col gap-2 transition shadow-sm ${
                        done
                          ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-300"
                          : "bg-white border-purple-200 hover:border-pink-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-bold text-purple-700 flex-1">
                          {task.subject}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`text-[10px] px-2 py-1 rounded-full font-bold border-2 cursor-pointer ${
                            done
                              ? "bg-green-200 text-green-800 border-green-400"
                              : "bg-pink-100 text-pink-700 border-pink-300"
                          }`}
                          onClick={() => toggleTaskDone(day.iso, idx)}
                        >
                          {done ? "Done ✓" : task.minutes + "m ⏱️"}
                        </motion.div>
                      </div>

                      <div className="text-[13px] text-slate-700 leading-snug">
                        {task.task}
                      </div>
                      {task.resource && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] text-purple-600 italic leading-snug font-medium">
                            {task.resource}
                          </div>
                          {task.url && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={task.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-sm hover:shadow-md"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Start →
                            </motion.a>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
