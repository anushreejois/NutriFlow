/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Settings2, CheckCircle2, Sparkles } from "lucide-react";

const CycleTracker = () => {
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [lastPeriod, setLastPeriod] = useState(user.lastPeriodDate ? new Date(user.lastPeriodDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(user.cycleLength || 28);
  const [variance, setVariance] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  const [cycleData, setCycleData] = useState({ 
    exactDate: "", 
    windowStart: "", 
    windowEnd: "", 
    daysAway: 0,
    currentPhase: { name: "", advice: "", color: "" }
  });

  useEffect(() => {
    const lastDate = new Date(lastPeriod);
    const today = new Date();
    
    // 1. Prediction Math
    const nextExpected = new Date(lastDate);
    nextExpected.setDate(lastDate.getDate() + Number(cycleLength));

    const start = new Date(nextExpected);
    start.setDate(nextExpected.getDate() - Number(variance));
    const end = new Date(nextExpected);
    end.setDate(nextExpected.getDate() + Number(variance));

    const differenceInTime = nextExpected.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // 2. Personal Phase Calculation (Day X of Cycle)
    const diffFromStart = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    const dayOfCycle = (diffFromStart % Number(cycleLength)) + 1;

    let phase = { name: "Luteal", advice: "Metabolism speeds up. Focus on slow-burn carbs.", color: "text-indigo-500" };
    if (dayOfCycle <= 5) phase = { name: "Menstrual", advice: "Focus on iron-rich foods and sleep.", color: "text-rose-500" };
    else if (dayOfCycle <= 12) phase = { name: "Follicular", advice: "Energy rising. Great for HIIT and social tasks.", color: "text-emerald-500" };
    else if (dayOfCycle <= 16) phase = { name: "Ovulatory", advice: "Peak energy! Metabolism is at its highest.", color: "text-amber-500" };

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    setCycleData({
      exactDate: nextExpected.toLocaleDateString(undefined, options),
      windowStart: start.toLocaleDateString(undefined, options),
      windowEnd: end.toLocaleDateString(undefined, options),
      daysAway: differenceInDays,
      currentPhase: phase
    });
  }, [lastPeriod, cycleLength, variance]);

  const handleSave = () => {
    const updatedUser = { ...user, lastPeriodDate: lastPeriod, cycleLength: Number(cycleLength) };
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden"
    >
      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-50 dark:border-gray-700 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-2xl text-rose-500">
              <Droplets size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-xl">Biological Sync</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalized for you</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400">
            <Settings2 size={20} />
          </button>
        </div>

        {/* EDIT PANEL */}
        <AnimatePresence>
          {isEditing && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Start Date</label>
                    <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-rose-500 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Cycle (Days)</label>
                    <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-rose-500 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Variance (±)</label>
                    <input type="number" value={variance} onChange={(e) => setVariance(Number(e.target.value))} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-rose-500 font-bold" />
                  </div>
               </div>
               <button onClick={handleSave} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm flex justify-center items-center gap-2">
                 <CheckCircle2 size={16} /> Update Biology
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* PREDICTION WINDOW */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Expected Window</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{cycleData.windowStart}</span>
                <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{cycleData.windowEnd}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="bg-gray-50 dark:bg-gray-900 flex-1 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Target Date</p>
                <p className="font-black text-gray-800 dark:text-gray-100">{cycleData.exactDate}</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 flex-1 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 text-center">
                <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Status</p>
                <p className="font-black text-rose-600 dark:text-rose-400">{cycleData.daysAway > 0 ? `${cycleData.daysAway} Days Left` : "Active / Near"}</p>
              </div>
            </div>
          </div>

          {/* DYNAMIC ADVICE CARD (THE "NEXT" FEATURE) */}
          <div className={`p-8 rounded-[2rem] border-2 flex flex-col justify-center relative overflow-hidden transition-colors duration-500 ${cycleData.currentPhase.name === 'Menstrual' ? 'bg-rose-50/50 border-rose-100' : 'bg-sage-50/50 border-sage-100 dark:bg-gray-900/50 dark:border-gray-700'}`}>
            <Sparkles className="absolute top-4 right-4 text-gray-200" size={40} />
            <div className="relative z-10">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm ${cycleData.currentPhase.color}`}>
                {cycleData.currentPhase.name} Phase
              </span>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">Today's Bio-Insight</h4>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {cycleData.currentPhase.advice}
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CycleTracker;