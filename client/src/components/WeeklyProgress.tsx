import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface DayProgress {
  date: string;
  water: number;
}

const WeeklyProgress = ({ data }: { data: DayProgress[] }) => {
  // Ensure we always show 7 days, even if DB only has 1
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Map your DB data to the correct day
  const getProgressForDay = (dayName: string) => {
    const dayData = data.find(d => d.date === dayName);
    return dayData ? dayData.water : 0;
  };

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
        {days.map((day) => {
          const waterCount = getProgressForDay(day);
          const percentage = Math.min((waterCount / 8) * 100, 100);
          const isGoalMet = waterCount >= 8;

          return (
            <div key={day} className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Background Track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="transparent"
                    className="text-gray-100 dark:text-gray-700"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={isGoalMet ? "#10b981" : "#3b82f6"}
                    strokeWidth="5"
                    strokeDasharray={176}
                    initial={{ strokeDashoffset: 176 }}
                    animate={{ strokeDashoffset: 176 - (176 * percentage) / 100 }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                
                {/* Center Icon/Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGoalMet ? (
                    <Check className="text-emerald-500" size={20} />
                  ) : (
                    <span className="text-xs font-bold text-gray-500">{waterCount}</span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isGoalMet ? 'text-emerald-500' : 'text-gray-400'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-300">
           {getProgressForDay(new Date().toLocaleDateString('en-US', {weekday:'short'})) >= 8 
             ? "🎉 Daily Goal Smashed!" 
             : "💧 Keep sipping, you're doing great!"}
        </p>
      </div>
    </div>
  );
};

export default WeeklyProgress;