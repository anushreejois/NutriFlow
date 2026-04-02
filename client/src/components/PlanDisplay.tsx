/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Utensils, Activity, Flame, Clock, CheckCircle, AlertCircle } from "lucide-react";

const PlanDisplay = ({ plan }: { plan: any }) => {
  
  // --- 1. PARSE THE AI DATA ---
  // The AI sends a string (JSON), so we need to convert it into an Object.
  let data = null;
  try {
    if (typeof plan === "string") {
      // Clean up if the AI wraps it in markdown code blocks (```json ... ```)
      const cleaned = plan.replace(/```json/g, "").replace(/```/g, "").trim();
      data = JSON.parse(cleaned);
    } else {
      data = plan;
    }
  } catch (error) {
    console.error("Failed to parse plan:", error);
  }

  // If parsing failed, show a fallback
  if (!data) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
        <AlertCircle /> Could not read the AI plan. Please try again.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* 1. HERO SUMMARY CARD */}
      <div className="bg-gradient-to-r from-sage-600 to-earth-500 p-8 rounded-3xl text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Your Personalized Protocol</h2>
        <p className="opacity-90 text-lg leading-relaxed">
          {data.summary || "Here is your optimized health plan based on your biometrics."}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <Badge icon={<Flame size={16}/>} text={`${data.meals?.breakfast?.calories || 500} - ${data.meals?.lunch?.calories || 800} kcal range`} />
          <Badge icon={<Activity size={16}/>} text={data.workout?.type || "General Fitness"} />
          <Badge icon={<CheckCircle size={16}/>} text="AI Optimized" />
        </div>
      </div>

      {/* 2. NUTRITION SECTION (REAL DATA) */}
      <div>
        <h3 className="text-xl font-bold text-sage-900 dark:text-white mb-4 flex items-center gap-2">
          <Utensils className="text-sage-600" /> Nutrition Plan
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Breakfast */}
          {data.meals?.breakfast && (
            <MealCard 
              title="Breakfast" 
              time="8:00 AM"
              icon={<Coffee size={24} className="text-orange-500"/>}
              content={data.meals.breakfast.item}
              calories={data.meals.breakfast.calories}
              benefit={data.meals.breakfast.benefits}
            />
          )}
          
          {/* Lunch */}
          {data.meals?.lunch && (
            <MealCard 
              title="Lunch" 
              time="1:00 PM"
              icon={<Sun size={24} className="text-yellow-500"/>}
              content={data.meals.lunch.item}
              calories={data.meals.lunch.calories}
              benefit={data.meals.lunch.benefits}
            />
          )}

          {/* Dinner */}
          {data.meals?.dinner && (
            <MealCard 
              title="Dinner" 
              time="7:30 PM"
              icon={<Moon size={24} className="text-indigo-500"/>}
              content={data.meals.dinner.item}
              calories={data.meals.dinner.calories}
              benefit={data.meals.dinner.benefits}
            />
          )}

          {/* Snacks (Optional - Checks if exists) */}
          <MealCard 
            title="Snack Option" 
            time="Anytime"
            icon={<Utensils size={24} className="text-pink-500"/>}
            content={data.meals?.snack ? data.meals.snack.item : "Green tea, handful of almonds, or a piece of fruit."}
            calories={data.meals?.snack?.calories || 150}
            benefit={data.meals?.snack?.benefits || "Keeps metabolism active between meals."}
          />
        </div>
      </div>

      {/* 3. WORKOUT SECTION (REAL DATA) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-sage-100 dark:border-sage-800 shadow-lg">
        <h3 className="text-xl font-bold text-sage-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="text-orange-500" /> Recommended Movement
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl">
              <Activity size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {data.workout?.type || "Daily Activity"}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Duration: <span className="font-bold text-sage-600 dark:text-sage-400">{data.workout?.duration || "30 mins"}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic border-l-4 border-sage-300 pl-3">
                "Focus on form and consistency. Listen to your body's energy levels."
              </p>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

// --- HELPER COMPONENTS ---

const Badge = ({ icon, text }: any) => (
  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
    {icon} {text}
  </div>
);

const MealCard = ({ title, time, content, icon, calories, benefit }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-sage-100 dark:border-sage-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sage-50 dark:bg-gray-700 rounded-full">{icon}</div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
          <span className="text-xs font-semibold text-sage-500 flex items-center gap-1">
            <Clock size={12} /> {time}
          </span>
        </div>
      </div>
      {calories && (
        <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
          ~{calories} kcal
        </span>
      )}
    </div>
    <p className="text-gray-800 dark:text-gray-200 text-md font-medium leading-relaxed mb-3 flex-grow">
      {content}
    </p>
    {benefit && (
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-sage-600 dark:text-sage-400 italic">
          <span className="font-bold">Why?</span> {benefit}
        </p>
      </div>
    )}
  </div>
);

export default PlanDisplay;