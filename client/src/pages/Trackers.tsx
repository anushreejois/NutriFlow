/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import CycleTracker from "../components/CycleTracker";
import HabitTracker from "../components/HabitTracker"; 
import WeeklyProgress from "../components/WeeklyProgress"; 
import WorkoutTracker from "../components/WorkoutTracker";
import ResetProgram from "../components/ResetProgram";
import { Target, BarChart3, Flame } from "lucide-react";
import { getWeeklyStats } from "../services/api";

const Trackers = () => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]); 
  
  // --- FIXED GENDER LOGIC ---
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userGender = user.gender?.toLowerCase() || "female"; // Forces lowercase for strict checking

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user._id) {
          const stats = await getWeeklyStats(user._id);
          setWeeklyData(stats || []);
        }
      } catch (error) {
        console.error("Failed to load weekly stats");
      }
    };
    loadStats();
  }, [user._id]);

  const handleHabitUpdate = (newWater: number) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    setWeeklyData((prev: any[]) => {
      const newData = [...prev];
      const dayIndex = newData.findIndex((d) => d.date === today);
      if (dayIndex !== -1) {
        newData[dayIndex] = { ...newData[dayIndex], water: newWater };
        return newData;
      } else {
        return [...newData, { date: today, water: newWater }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 pt-32 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-sage-900 dark:text-white mb-4 tracking-tight">My Trackers</h1>
          <p className="text-lg text-sage-600 dark:text-sage-400">Log your progress, track your biology, and view your growth.</p>
        </div>

        {/* CYCLE TRACKER (CONDITIONAL LOGIC - FIXED) */}
        {userGender !== "male" && (
          <section>
            <CycleTracker />
          </section>
        )}

        {/* NEW GYM TRACKER */}
        <section>
          <WorkoutTracker />
        </section>

        {/* HABITS */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-sage-100 dark:border-sage-800 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-sage-600" size={24} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Discipline</h2>
          </div>
          <HabitTracker onUpdate={handleHabitUpdate} />
        </section>

        {/* CHARTS */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 border border-sage-100 dark:border-sage-800 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <BarChart3 className="text-sage-600" size={24} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Growth Insights</h2>
          </div>
          <div className="flex-grow">
            <WeeklyProgress data={weeklyData} />
          </div>
        </section>

        {/* RESET CHALLENGE PROGRAM */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 border border-sage-100 dark:border-sage-800 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-orange-500" size={24} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Reset Challenge</h2>
          </div>
          <ResetProgram />
        </section>

      </div>
    </div>
  );
};

export default Trackers;