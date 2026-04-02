/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Lock, Trophy, X, Droplet, Utensils, Moon, Coffee, Activity, Info, Zap } from "lucide-react";
import { updateResetProgress, getUserProfile } from "../services/api";

// --- CORE CHALLENGES (Days 1-21) ---
const coreChallenges = [
  // PHASE 1: DETOX
  { day: 1, phase: "Detox", title: "Hydration Flush", task: "Drink 3L water & Avoid added sugar", icon: <Droplet className="text-blue-500" />, benefit: "Flushes out retained water and lowers baseline cortisol." },
  { day: 2, phase: "Detox", title: "Plant Power", task: "Eat a fully plant-based dinner", icon: <Utensils className="text-green-500" />, benefit: "Reduces digestive inflammation and improves gut motility." },
  { day: 3, phase: "Detox", title: "Mental Reset", task: "10 min morning meditation", icon: <Moon className="text-purple-500" />, benefit: "Lowers morning adrenaline spikes for calmer energy." },
  { day: 4, phase: "Detox", title: "Caffeine Cutoff", task: "No caffeine after 12 PM", icon: <Coffee className="text-amber-700" />, benefit: "Ensures deep REM sleep for hormonal repair." },
  { day: 5, phase: "Detox", title: "Sleep Sync", task: "Sleep before 10:30 PM", icon: <Moon className="text-indigo-500" />, benefit: "Maximizes growth hormone release which happens at 11 PM." },
  { day: 6, phase: "Detox", title: "Movement Medicine", task: "30 min brisk walk outdoors", icon: <Activity className="text-orange-500" />, benefit: "Vitamin D + Movement sensitizes insulin receptors." },
  { day: 7, phase: "Detox", title: "Energy Journal", task: "Journal your energy levels", icon: <Info className="text-gray-500" />, benefit: "Builds awareness of your body's peak performance hours." },
  
  // PHASE 2: RESTORE
  { day: 8, phase: "Restore", title: "Gut Guardian", task: "Add fermented food (yogurt/kimchi)", icon: <Zap className="text-yellow-500" />, benefit: "Introduces probiotics to balance estrobolome." },
  { day: 9, phase: "Restore", title: "Seed Cycling A", task: "Add flax/pumpkin seeds to breakfast", icon: <Activity className="text-orange-600" />, benefit: "Phytoestrogens help modulate estrogen levels." },
  { day: 10, phase: "Restore", title: "Tech Detox", task: "No screens 1 hour before bed", icon: <Moon className="text-indigo-400" />, benefit: "Reduces blue light exposure to boost melatonin." },
  { day: 11, phase: "Restore", title: "Protein Prioritization", task: "30g protein at breakfast", icon: <Utensils className="text-red-500" />, benefit: "Stabilizes blood sugar for the entire day." },
  { day: 12, phase: "Restore", title: "Magnesium Boost", task: "Eat dark chocolate or spinach", icon: <Zap className="text-amber-500" />, benefit: "Essential mineral for reducing period cramps and anxiety." },
  { day: 13, phase: "Restore", title: "Slow Flow", task: "20 min yoga or stretching", icon: <Activity className="text-pink-500" />, benefit: "Lowers cortisol to allow progesterone production." },
  { day: 14, phase: "Restore", title: "Self-Care Sunday", task: "Take a warm bath or read a book", icon: <Info className="text-teal-500" />, benefit: "Active relaxation signals safety to your nervous system." },

  // PHASE 3: THRIVE
  { day: 15, phase: "Thrive", title: "Seed Cycling B", task: "Switch to sesame/sunflower seeds", icon: <Activity className="text-yellow-600" />, benefit: "Supports progesterone production in the luteal phase." },
  { day: 16, phase: "Thrive", title: "Heavy Lifting", task: "Strength training workout", icon: <Activity className="text-gray-700" />, benefit: "Building muscle improves insulin sensitivity significantly." },
  { day: 17, phase: "Thrive", title: "Sugar Slasher", task: "No dessert today (fruit only)", icon: <Utensils className="text-green-600" />, benefit: "Resets taste buds and lowers insulin baseline." },
  { day: 18, phase: "Thrive", title: "Cold Exposure", task: "End shower with 30s cold water", icon: <Droplet className="text-blue-400" />, benefit: "Boosts dopamine and activates brown fat metabolism." },
  { day: 19, phase: "Thrive", title: "Fast Flow", task: "13-hour overnight fast", icon: <Moon className="text-purple-400" />, benefit: "Gives digestion a break to focus on cellular repair." },
  { day: 20, phase: "Thrive", title: "Gratitude", task: "Write down 3 things you're grateful for", icon: <Info className="text-yellow-400" />, benefit: "Positive mindset shifts hormonal profile towards growth." },
  { day: 21, phase: "Thrive", title: "Celebration", task: "Plan a healthy treat meal!", icon: <Zap className="text-pink-600" />, benefit: "Celebrating wins releases serotonin and reinforces habits." },
];

// --- GENERATE EXTENDED CHALLENGES (Days 22-108) ---
// We cycle through 7 key habits to create the extended program
const masteryHabits = [
  { title: "Deep Hydration", task: "Drink 3L water today", icon: <Droplet className="text-blue-500" />, benefit: "Maintains cellular hydration." },
  { title: "Active Movement", task: "45 min exercise of choice", icon: <Activity className="text-orange-500" />, benefit: "Keeps metabolism active." },
  { title: "Mindful Minutes", task: "15 min meditation", icon: <Moon className="text-purple-500" />, benefit: "Reduces chronic stress." },
  { title: "Green Fuel", task: "Eat 2 servings of greens", icon: <Utensils className="text-green-500" />, benefit: "Micronutrient density." },
  { title: "Sleep Priority", task: "In bed by 10 PM", icon: <Moon className="text-indigo-500" />, benefit: "Circadian rhythm sync." },
  { title: "Skill Builder", task: "Read/Learn for 20 mins", icon: <Info className="text-teal-500" />, benefit: "Neuroplasticity." },
  { title: "Gratitude Log", task: "Journal 3 wins", icon: <Zap className="text-yellow-500" />, benefit: "Positive psychology." },
];

const generateExtendedChallenges = () => {
  const extended = [];
  for (let i = 22; i <= 108; i++) {
    const habitIndex = (i - 22) % masteryHabits.length;
    const habit = masteryHabits[habitIndex];
    
    let phaseName = "Mandala";
    if (i > 48) phaseName = "Mastery";

    extended.push({
      day: i,
      phase: phaseName,
      title: habit.title,
      task: habit.task,
      icon: habit.icon,
      benefit: habit.benefit
    });
  }
  return extended;
};

const allChallenges = [...coreChallenges, ...generateExtendedChallenges()];

const ResetProgram = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [targetGoal, setTargetGoal] = useState<21 | 48 | 108>(21); // DEFAULT GOAL

  const userInfo = localStorage.getItem("userInfo");
  const userId = userInfo ? JSON.parse(userInfo)._id : null;

  // 1. LOAD PROGRESS
  useEffect(() => {
    const loadProgress = async () => {
      if (userId) {
        try {
          const profile = await getUserProfile(userId);
          const done = profile.resetDaysCompleted || [];
          setCompletedDays(done);
          
          // Auto-adjust goal based on progress
          const maxDay = Math.max(...done, 0);
          if (maxDay > 48) setTargetGoal(108);
          else if (maxDay > 21) setTargetGoal(48);
        } catch (error) {
          console.error("Failed to load progress", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadProgress();
  }, [userId]);

  // 2. SAVE PROGRESS
  const handleCompleteTask = async () => {
    if (!selectedTask || !userId) return;
    const day = selectedTask.day;
    if (!completedDays.includes(day)) {
      setCompletedDays([...completedDays, day]);
      try {
        await updateResetProgress(userId, day);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    }
    setSelectedTask(null);
  };

  // Filter challenges based on selected goal
  const visibleChallenges = useMemo(() => {
    return allChallenges.filter(c => c.day <= targetGoal);
  }, [targetGoal]);

  const progress = Math.min((completedDays.length / targetGoal) * 100, 100);

  // Grouping Logic for Grid
  const renderPhases = () => {
    const phases = [];
    
    // Core Phases
    phases.push({ title: "Phase 1: Detox (Days 1-7)", range: [1, 7], color: "from-green-400 to-emerald-600" });
    phases.push({ title: "Phase 2: Restore (Days 8-14)", range: [8, 14], color: "from-blue-400 to-indigo-600" });
    phases.push({ title: "Phase 3: Thrive (Days 15-21)", range: [15, 21], color: "from-purple-400 to-pink-600" });

    // Extended Phases
    if (targetGoal >= 48) {
      phases.push({ title: "The Mandala (Days 22-48)", range: [22, 48], color: "from-orange-400 to-red-600" });
    }
    if (targetGoal >= 108) {
      phases.push({ title: "The Mastery (Days 49-108)", range: [49, 108], color: "from-teal-400 to-cyan-600" });
    }

    return phases.map((phase, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-sage-100 dark:border-sage-800">
        <h3 className={`text-lg font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10`}>
          {phase.title}
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {visibleChallenges
            .filter(c => c.day >= phase.range[0] && c.day <= phase.range[1])
            .map((challenge) => {
              const isCompleted = completedDays.includes(challenge.day);
              // Unlock logic: Day 1 open, others need prev day done
              const isLocked = !isCompleted && challenge.day > 1 && !completedDays.includes(challenge.day - 1);

              return (
                <motion.button
                  key={challenge.day}
                  whileHover={!isLocked ? { scale: 1.1 } : {}}
                  whileTap={!isLocked ? { scale: 0.9 } : {}}
                  onClick={() => !isLocked && setSelectedTask(challenge)}
                  disabled={isLocked}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all relative
                    ${isCompleted 
                      ? `bg-gradient-to-br ${phase.color} text-white shadow-md` 
                      : isLocked 
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 border-2 border-sage-100 dark:border-sage-600 text-sage-600 hover:border-sage-400"
                    }
                  `}
                >
                  {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : challenge.day}
                </motion.button>
              );
          })}
        </div>
      </div>
    ));
  };

  if (loading) return <div className="p-10 text-center">Loading your journey...</div>;

  return (
    <div className="space-y-8">
      
      {/* GOAL SELECTOR & HEADER */}
      <div className="bg-sage-100 dark:bg-sage-900/50 p-6 rounded-3xl border border-sage-200 dark:border-sage-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-sage-900 dark:text-white mb-1">Your Habit Streak</h2>
            <p className="text-sage-600 dark:text-sage-400">Consistency compounds. Choose your horizon.</p>
          </div>
          
          {/* GOAL SWITCHER */}
          <div className="bg-white dark:bg-gray-800 p-1 rounded-xl flex gap-1 shadow-sm">
            {[21, 48, 108].map((goal) => (
              <button
                key={goal}
                onClick={() => setTargetGoal(goal as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  targetGoal === goal 
                    ? "bg-sage-600 text-white shadow-md" 
                    : "text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-gray-700"
                }`}
              >
                {goal} Days
              </button>
            ))}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold text-sage-700 dark:text-sage-300">
            <span>{completedDays.length} Days Completed</span>
            <span>Target: {targetGoal} Days</span>
          </div>
          <div className="w-full h-4 bg-white dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className={`h-full bg-gradient-to-r ${
                targetGoal === 21 ? "from-green-400 to-emerald-600" :
                targetGoal === 48 ? "from-orange-400 to-red-600" :
                "from-teal-400 to-cyan-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* RENDER PHASES */}
      <div className="space-y-6">
        {renderPhases()}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full relative border border-sage-100 dark:border-sage-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300"/>
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-4 bg-sage-50 dark:bg-gray-700 rounded-full mb-4 text-sage-600 dark:text-sage-300">
                  <div className="scale-150">{selectedTask.icon}</div>
                </div>
                <h2 className="text-2xl font-black text-sage-900 dark:text-white mb-1">
                  Day {selectedTask.day}: {selectedTask.title}
                </h2>
                <span className="text-xs font-bold uppercase tracking-widest text-sage-500">
                  {selectedTask.phase} Phase
                </span>
              </div>

              <div className="space-y-6">
                <div className="bg-sage-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Activity size={16} className="text-sage-500"/> Your Task
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedTask.task}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-1 flex items-center gap-2">
                    <Info size={16}/> The Benefit
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">{selectedTask.benefit}</p>
                </div>
              </div>

              <button 
                onClick={handleCompleteTask}
                disabled={completedDays.includes(selectedTask.day)}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  completedDays.includes(selectedTask.day)
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-sage-600 hover:bg-sage-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {completedDays.includes(selectedTask.day) ? (
                  <> <CheckCircle size={20} /> Completed </>
                ) : (
                  "Mark as Completed"
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL TROPHY */}
      {completedDays.length >= targetGoal && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl text-center border border-yellow-200"
        >
          <Trophy className="mx-auto text-yellow-600 mb-4" size={48} />
          <h3 className="text-2xl font-black text-yellow-800 dark:text-yellow-200">
            {targetGoal} Days Completed!
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">You have achieved true consistency.</p>
        </motion.div>
      )}

    </div>
  );
};

export default ResetProgram;