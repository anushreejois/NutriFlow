import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Droplets, AlertCircle } from "lucide-react";

const PeriodTracker = () => {
  // We put the math directly inside useState! 
  // This is called "Lazy Initialization" and it fixes the ESLint error perfectly.
  const [cycleData] = useState(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    // Fallback data just in case they haven't set it up yet
    const lastPeriod = user.lastPeriodDate ? new Date(user.lastPeriodDate) : new Date();
    const cycleLength = user.cycleLength || 28;

    // 1. Calculate EXACT next expected date
    const nextExpected = new Date(lastPeriod);
    nextExpected.setDate(lastPeriod.getDate() + cycleLength);

    // 2. Calculate the -5 / +5 Window
    const start = new Date(nextExpected);
    start.setDate(nextExpected.getDate() - 5);
    
    const end = new Date(nextExpected);
    end.setDate(nextExpected.getDate() + 5);

    // 3. Calculate how many days away the exact date is from TODAY
    const today = new Date();
    const differenceInTime = nextExpected.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // Format the dates to look nice (e.g., "Oct 12")
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    return {
      exactDate: nextExpected.toLocaleDateString(undefined, options),
      windowStart: start.toLocaleDateString(undefined, options),
      windowEnd: end.toLocaleDateString(undefined, options),
      daysAway: differenceInDays,
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-900/20 p-6 rounded-3xl border border-rose-200 dark:border-rose-800 shadow-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <Droplets className="absolute -bottom-4 -right-4 text-rose-200 dark:text-rose-900/40 w-32 h-32 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-rose-100 dark:bg-rose-900 p-2 rounded-full text-rose-600 dark:text-rose-300">
            <Calendar size={20} />
          </div>
          <h3 className="font-black text-rose-900 dark:text-rose-100 text-lg">Cycle Predictor</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-rose-700/70 dark:text-rose-300/70 uppercase tracking-widest mb-1">Expected Window</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{cycleData.windowStart}</span>
            <span className="text-xl font-bold text-rose-400">—</span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{cycleData.windowEnd}</span>
          </div>
          <p className="text-sm font-medium text-rose-800 dark:text-rose-200 mt-2 flex items-center gap-1.5">
            <AlertCircle size={14} /> ± 5 days variance accounted for
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-rose-100 dark:border-rose-800/50">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Target Date</p>
            <p className="font-black text-gray-800 dark:text-gray-100">{cycleData.exactDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Status</p>
            <p className="font-black text-rose-600 dark:text-rose-400">
              {cycleData.daysAway !== null && cycleData.daysAway > 0 ? `In ${cycleData.daysAway} Days` : "Expected Soon"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PeriodTracker;