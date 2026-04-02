import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, PlusCircle, Flame, CheckCircle2 } from "lucide-react";

const WorkoutTracker = () => {
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const gender = user.gender || "female";

  const [exercises, setExercises] = useState<{ id: number; name: string; sets: string; reps: string; weight: string }[]>([]);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", reps: "", weight: "" });

  // Custom recommendations based on gender!
  const recommendations = gender === "male" 
    ? ["Barbell Bench Press", "Deadlifts", "Overhead Press", "Pull-ups"]
    : ["Barbell Hip Thrusts", "Bulgarian Split Squats", "Dumbbell RDLs", "Pilates Core Routine"];

  const handleAddExercise = () => {
    if (!newExercise.name) return;
    setExercises([...exercises, { ...newExercise, id: Date.now() }]);
    setNewExercise({ name: "", sets: "", reps: "", weight: "" }); // Reset form
  };

  const handleFillRecommendation = (name: string) => {
    setNewExercise({ ...newExercise, name });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="text-sage-600" size={24} />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Gym & Lifts</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-sage-100 dark:border-sage-800 shadow-xl">
        
        {/* RECOMMENDATIONS */}
        <div className="mb-8">
          <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Flame size={14} className="text-orange-500" /> Recommended for your biology
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec, idx) => (
              <button 
                key={idx}
                onClick={() => handleFillRecommendation(rec)}
                className="bg-sage-50 hover:bg-sage-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-sage-700 dark:text-sage-300 text-sm font-bold py-2 px-4 rounded-full transition-colors border border-sage-200 dark:border-gray-600"
              >
                + {rec}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <input 
            type="text" placeholder="Exercise..." value={newExercise.name} onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
            className="col-span-2 p-3 rounded-xl border-none ring-1 ring-sage-200 focus:ring-2 focus:ring-sage-500 outline-none text-sm dark:bg-gray-900 dark:text-white"
          />
          <input 
            type="number" placeholder="Sets" value={newExercise.sets} onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
            className="p-3 rounded-xl border-none ring-1 ring-sage-200 focus:ring-2 focus:ring-sage-500 outline-none text-sm dark:bg-gray-900 dark:text-white"
          />
          <input 
            type="number" placeholder="Reps" value={newExercise.reps} onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
            className="p-3 rounded-xl border-none ring-1 ring-sage-200 focus:ring-2 focus:ring-sage-500 outline-none text-sm dark:bg-gray-900 dark:text-white"
          />
          <input 
            type="text" placeholder="Weight (kg)" value={newExercise.weight} onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
            className="p-3 rounded-xl border-none ring-1 ring-sage-200 focus:ring-2 focus:ring-sage-500 outline-none text-sm dark:bg-gray-900 dark:text-white"
          />
        </div>

        <button 
          onClick={handleAddExercise} disabled={!newExercise.name}
          className="w-full bg-sage-800 text-white font-bold py-3 rounded-xl hover:bg-sage-900 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <PlusCircle size={18} /> Log Exercise
        </button>

        {/* LOGGED EXERCISES LIST */}
        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {exercises.map((ex) => (
              <motion.div 
                key={ex.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-sage-50 dark:bg-gray-700 p-4 rounded-xl flex justify-between items-center border border-sage-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="font-bold text-gray-800 dark:text-white text-lg">{ex.name}</span>
                </div>
                <div className="text-sm font-bold text-sage-600 dark:text-sage-300 flex gap-4">
                  <span>{ex.sets || 0} Sets</span>
                  <span>{ex.reps || 0} Reps</span>
                  <span>{ex.weight ? `${ex.weight} kg` : "Bodyweight"}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default WorkoutTracker;