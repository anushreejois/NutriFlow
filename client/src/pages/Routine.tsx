/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Dumbbell, Utensils, Trophy, CheckCircle2, CalendarDays, X, Sparkles, TrendingUp, Activity, BarChart3, Snowflake, Lock } from "lucide-react";
import { updateGymSplit, saveDailyLog, getDailyLog, getWeeklySummary } from "../services/api";

const MOTIVATION_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "You can't cheat the grind. It knows how much you've invested.",
  "Motivation gets you going, but discipline keeps you growing.",
  "Excuses don't burn calories. Habits do.",
  "Consistency outpaces intensity. Show up again tomorrow.",
  "Your body hears everything your mind says. Stay sharp.",
  "Suffer the pain of discipline or suffer the pain of regret.",
  "The only bad workout is the one that didn't happen.",
  "When you feel like quitting, think about why you started.",
  "Results happen over time, not overnight. Work hard, stay patient.",
  "Don't stop when you're tired. Stop when you're done.",
  "A one-hour workout is only 4% of your day. No excuses.",
  "Sweat is just fat crying. Keep going.",
  "Success starts with self-discipline.",
  "You don't have to be great to start, but you have to start to be great.",
  "The pain you feel today will be the strength you feel tomorrow."
];

const Routine = () => {
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  const [currentStreak, setCurrentStreak] = useState(user.currentStreak || 0);
  const [longestStreak, setLongestStreak] = useState(user.longestStreak || 0);
  const [availableFreezes, setAvailableFreezes] = useState(user.availableFreezes ?? 3);
  
  const [gymSplit, setGymSplit] = useState(user.gymRoutine || {
    monday: "Chest & Triceps", tuesday: "Back & Biceps", wednesday: "Active Recovery",
    thursday: "Legs & Core", friday: "Shoulders & Arms", saturday: "Cardio / Flexibility", sunday: "Rest"
  });

  const [isEditingSplit, setIsEditingSplit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayLog, setTodayLog] = useState({ mealStatus: "none", gymCompleted: false });
  
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [activeQuote, setActiveQuote] = useState(MOTIVATION_QUOTES[0]);
  const [summaryData, setSummaryData] = useState({
    workoutsCrushed: 0,
    workoutsTarget: 0,
    nutritionCompliance: 0,
    areasToImprove: ["Loading..."]
  });

  const today = new Date();
  const isSunday = today.getDay() === 0; 



  const getWeekDates = () => {
    const dates = [];
    const curr = new Date();
    const dayOfWeek = curr.getDay() || 7; 
    for (let i = 1; i <= 7; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() - dayOfWeek + i);
      dates.push(d);
    }
    return dates;
  };
  const currentWeek = getWeekDates();

  useEffect(() => {
    const fetchLogForDate = async () => {
      try {
        if (user._id) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          const log = await getDailyLog(user._id, dateStr);
          setTodayLog({ mealStatus: log?.mealStatus || "none", gymCompleted: log?.gymCompleted || false });
        }
      } catch (error) {
        console.error("Failed to fetch log");
      }
    };
    fetchLogForDate();
  }, [selectedDate, user._id]);

  const handleSplitChange = (day: string, value: string) => {
    setGymSplit({ ...gymSplit, [day]: value });
  };

  const handleSaveSplit = async () => {
    try {
      await updateGymSplit(user._id, gymSplit);
      const updatedUser = { ...user, gymRoutine: gymSplit };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsEditingSplit(false);
    } catch (error) {
      alert("Failed to save gym split.");
    }
  };

  const handleLogDay = async () => {
    setIsSaving(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await saveDailyLog({
        userId: user._id,
        date: dateStr,
        mealStatus: todayLog.mealStatus,
        gymCompleted: todayLog.gymCompleted
      });

      setCurrentStreak(response.currentStreak);
      setLongestStreak(response.longestStreak);
      setAvailableFreezes(response.availableFreezes);

      const updatedUser = { 
        ...user, 
        currentStreak: response.currentStreak, 
        longestStreak: response.longestStreak,
        availableFreezes: response.availableFreezes 
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      if (isSunday) handleOpenSummary(); 

    } catch (error) {
      alert("Failed to save log.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenSummary = async () => {
    if (!isSunday) return; 
    
    setActiveQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
    setShowWeeklySummary(true);
    try {
      const startDate = currentWeek[0].toISOString().split('T')[0];
      const endDate = currentWeek[6].toISOString().split('T')[0];
      const data = await getWeeklySummary(user._id, startDate, endDate);
      setSummaryData(data);
    } catch (error) {
      setSummaryData(prev => ({ ...prev, areasToImprove: ["Failed to load data"] }));
    }
  };

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const selectedDayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    /* CLEAN UP: Added 'relative' to ensure Framer Motion offset calculations work */
    <div className="relative min-h-screen bg-sage-50 dark:bg-gray-900 pt-32 pb-20 px-4 transition-colors duration-300">
      
      {/* CLEAN UP: Added unique key and simplified children for AnimatePresence */}
      <AnimatePresence mode="wait">
        {showWeeklySummary && (
          <motion.div 
            key="weekly-summary-modal"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }} 
              className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl max-w-lg w-full relative border border-sage-100 dark:border-gray-700"
            >
              <button onClick={() => setShowWeeklySummary(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
              
              <div className="text-center space-y-3 mb-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Weekly Debrief</h2>
              </div>

              <div className="bg-sage-50 dark:bg-gray-700/50 p-6 rounded-2xl space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-sage-200 dark:border-gray-600 pb-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Workouts Crushed</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{summaryData.workoutsCrushed} / {summaryData.workoutsTarget}</span>
                </div>
                <div className="flex justify-between items-center border-b border-sage-200 dark:border-gray-600 pb-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Nutrition Compliance</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">{summaryData.nutritionCompliance}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Areas to Improve</span>
                  <span className="text-sm font-bold text-rose-500 text-right">
                    {summaryData.areasToImprove.map((item, i) => <span key={i} className="block">{item}</span>)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 dark:bg-black p-6 rounded-2xl text-center relative overflow-hidden">
                <Sparkles className="absolute top-2 right-2 text-yellow-500/20" size={30} />
                <p className="text-sm md:text-base font-bold text-white italic relative z-10">"{activeQuote}"</p>
              </div>

              <button onClick={() => setShowWeeklySummary(false)} className="w-full mt-6 py-4 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-700 transition-colors">
                Let's Go
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-sage-900 dark:text-white mb-2 tracking-tight">Consistency Hub</h1>
          <p className="text-base text-sage-600 dark:text-sage-400">Track your meals, manage your gym split, and build unbreakable habits.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between overflow-hidden relative">
            <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-20" />
            <div className="relative z-10">
              <p className="text-orange-100 font-bold uppercase tracking-wider text-xs mb-1">Current Streak</p>
              <h2 className="text-4xl font-black">{currentStreak} <span className="text-lg font-bold opacity-80">Days</span></h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm relative z-10">
              <Flame size={28} className="text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-sage-200 dark:border-gray-700 rounded-3xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-sage-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Longest Streak</p>
              <h2 className="text-4xl font-black text-sage-900 dark:text-white">{longestStreak} <span className="text-lg font-bold opacity-50">Days</span></h2>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <Trophy size={28} className="text-amber-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between overflow-hidden relative">
            <Snowflake className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-20" />
            <div className="relative z-10">
              <p className="text-cyan-100 font-bold uppercase tracking-wider text-xs mb-1">Freezes Left</p>
              <h2 className="text-4xl font-black">{availableFreezes} <span className="text-lg font-bold opacity-80">Available</span></h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm relative z-10">
              <Snowflake size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* LOG JOURNAL */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-sage-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="text-sage-600" size={24} />
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Log Journal</h2>
          </div>

          <div className="flex justify-between items-center mb-8 bg-sage-50 dark:bg-gray-700/50 p-2 rounded-2xl border border-sage-100 dark:border-gray-600 overflow-x-auto">
            {currentWeek.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              const isFuture = date > new Date(); 
              return (
                <button
                  key={idx} disabled={isFuture} onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center py-2 px-3 md:px-4 rounded-xl transition-all ${
                    isSelected ? "bg-sage-600 text-white shadow-md scale-105" : isFuture ? "opacity-30 cursor-not-allowed text-gray-400" : "hover:bg-sage-200 dark:hover:bg-gray-600 text-sage-800 dark:text-sage-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-lg font-black">{date.getDate()}</span>
                  {isToday && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-sage-600"}`} />}
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Utensils size={18} /> Nutrition</h3>
              <div className="space-y-3">
                <button onClick={() => setTodayLog({...todayLog, mealStatus: "perfect"})} className={`w-full p-4 rounded-xl border-2 font-bold flex justify-between items-center transition-all ${todayLog.mealStatus === "perfect" ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-200"}`}>
                  <span>Perfectly on Plan</span> {todayLog.mealStatus === "perfect" && <CheckCircle2 size={18} />}
                </button>
                <button onClick={() => setTodayLog({...todayLog, mealStatus: "modified"})} className={`w-full p-4 rounded-xl border-2 font-bold flex justify-between items-center transition-all ${todayLog.mealStatus === "modified" ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-200"}`}>
                  <span>Slightly Modified</span> {todayLog.mealStatus === "modified" && <CheckCircle2 size={18} />}
                </button>
                <button onClick={() => setTodayLog({...todayLog, mealStatus: "cheat_day"})} className={`w-full p-4 rounded-xl border-2 font-bold flex justify-between items-center transition-all ${todayLog.mealStatus === "cheat_day" ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-rose-200"}`}>
                  <span>Cheat Day / Off Plan</span> {todayLog.mealStatus === "cheat_day" && <CheckCircle2 size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Dumbbell size={18} /> Gym</h3>
              <div className="bg-sage-50 dark:bg-gray-700/50 p-6 rounded-xl border border-sage-100 dark:border-gray-600 h-full flex flex-col justify-center items-center text-center space-y-3">
                <p className="text-xs font-bold text-sage-500 uppercase tracking-widest">{selectedDayName}'s Split</p>
                <p className="text-xl font-black text-sage-900 dark:text-white">
                  {gymSplit[selectedDayName as keyof typeof gymSplit]}
                </p>
                <button 
                  onClick={() => setTodayLog({...todayLog, gymCompleted: !todayLog.gymCompleted})}
                  className={`mt-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${todayLog.gymCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white dark:bg-gray-800 text-gray-500 border-2 border-gray-200 dark:border-gray-600 hover:border-sage-400"}`}
                >
                  {todayLog.gymCompleted ? <><CheckCircle2 size={16} /> Workout Crushed</> : "Mark as Completed"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-sage-100 dark:border-gray-700 flex justify-end">
             <button onClick={handleLogDay} disabled={isSaving || todayLog.mealStatus === "none"} className="bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
               {isSaving ? "Saving..." : "Save Log for " + selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}
             </button>
          </div>
        </div>

        {/* GYM SPLIT EDITOR */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-sage-100 dark:border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-3">
              <Activity className="text-sage-600" size={24} /> My Weekly Split
            </h2>
            <button onClick={() => isEditingSplit ? handleSaveSplit() : setIsEditingSplit(true)} className="text-sm text-sage-600 dark:text-sage-400 font-bold underline hover:text-sage-800">
              {isEditingSplit ? "Save Split" : "Edit Split"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-sage-50 dark:bg-gray-700/50 p-3 rounded-xl border border-sage-100 dark:border-gray-600">
                <p className="text-[10px] font-bold text-sage-500 dark:text-gray-400 uppercase tracking-widest mb-1">{day}</p>
                {isEditingSplit ? (
                  <input type="text" value={gymSplit[day as keyof typeof gymSplit]} onChange={(e) => handleSplitChange(day, e.target.value)} className="w-full p-1.5 rounded-md border border-sage-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-sage-500"/>
                ) : (
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{gymSplit[day as keyof typeof gymSplit]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY DEBRIEF BANNER */}
        <motion.div 
          whileHover={isSunday ? { scale: 1.01 } : {}} 
          className={`mt-8 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden transition-all duration-500 ${
            isSunday 
              ? "bg-gradient-to-r from-sage-900 to-sage-700 dark:from-sage-800 dark:to-gray-800" 
              : "bg-gray-200 dark:bg-gray-800 opacity-80 cursor-not-allowed grayscale-[0.5]"
          }`}
        >
           <BarChart3 className={`absolute -right-10 -top-10 opacity-5 w-64 h-64 pointer-events-none ${isSunday ? "text-white" : "text-black"}`} />
           
           <div className="text-center md:text-left mb-6 md:mb-0 relative z-10">
             <h3 className={`text-2xl font-black mb-2 ${isSunday ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
               {isSunday ? "Ready to Analyze Your Week?" : "Weekly Debrief Locked"}
             </h3>
             <p className={`${isSunday ? "text-sage-200" : "text-gray-400"} text-sm md:text-base`}>
               {isSunday 
                 ? "Review your compliance, gym consistency, and growth areas." 
                 : "This report unlocks every Sunday to recap your progress."}
             </p>
           </div>
           
           <button 
             onClick={handleOpenSummary} 
             disabled={!isSunday}
             className={`px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-all w-full md:w-auto justify-center shadow-lg relative z-10 ${
               isSunday 
                 ? "bg-white text-sage-900 hover:bg-sage-50" 
                 : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
             }`}
           >
             {isSunday ? <TrendingUp size={20} /> : <Lock size={20} />}
             {isSunday ? "Generate Weekly Debrief" : "Unlocks Sunday"}
           </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Routine;