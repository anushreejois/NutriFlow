/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { CheckCircle2, Droplets, Trophy, Plus, Trash2, Droplet } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";

// Added onUpdate prop to refresh the rings instantly
const HabitTracker = ({ onUpdate }: { onUpdate: (water: number) => void }) => {
  const [water, setWater] = useState(0);
  const [habits, setHabits] = useState<{ name: string; completed: boolean }[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/habits/${user._id}`);
        if (res.data) {
          setWater(res.data.waterIntake || 0);
          setHabits(res.data.customHabits || []);
        }
      } catch (e) { console.log("New user or fetch failed."); }
    };
    if (user._id) fetchHabits();
  }, [user._id]);

  const saveToDB = async (updatedHabits: any, updatedWater: number) => {
    try {
      await axios.post(`${API_BASE_URL}/habits/update`, {
        userId: user._id,
        waterIntake: updatedWater,
        customHabits: updatedHabits
      });
      // Trigger the ring animation in the parent component
      onUpdate(updatedWater);
    } catch (e) { console.error("Save failed"); }
  };

  const addHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (!newHabit.trim()) return;
    
    const updated = [...habits, { name: newHabit, completed: false }];
    setHabits(updated);
    setNewHabit("");
    saveToDB(updated, water);
  };

  const toggleHabit = (index: number) => {
    const updated = [...habits];
    updated[index].completed = !updated[index].completed;
    setHabits(updated);
    saveToDB(updated, water);
  };

  const deleteHabit = (index: number) => {
    const updated = habits.filter((_, i) => i !== index);
    setHabits(updated);
    saveToDB(updated, water);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      
      {/* WATER TRACKER */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-blue-900 dark:text-blue-200 text-xl flex items-center gap-2">
            <Droplets className="text-blue-500" /> Hydration
          </h3>
          <div className="text-right">
            <span className="text-3xl font-black text-blue-600 leading-none">{water * 250}</span>
            <span className="text-blue-400 font-bold ml-1 uppercase text-sm">ml</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
            <button
              key={glass}
              onClick={() => { setWater(glass); saveToDB(habits, glass); }}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${
                glass <= water 
                ? "bg-blue-500 text-white shadow-lg scale-105" 
                : "bg-white dark:bg-gray-800 border-2 border-blue-50 dark:border-gray-700 hover:border-blue-200"
              }`}
            >
              {/* REPLACED EMOJI WITH MODERN ICON */}
              <Droplet 
                size={22} 
                fill={glass <= water ? "currentColor" : "none"} 
                className={glass <= water ? "text-white" : "text-blue-200"} 
              />
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs font-bold text-blue-400/80 text-center uppercase tracking-widest">Goal: 8 Glasses</p>
      </div>

      {/* DYNAMIC HABIT CHECKLIST */}
      <div className="bg-sage-50/50 dark:bg-sage-900/10 p-8 rounded-[2.5rem] border border-sage-100 dark:border-sage-800 shadow-sm transition-all hover:shadow-md">
        <h3 className="font-black text-sage-900 dark:text-sage-200 text-xl mb-8 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> My Daily Goals
        </h3>
        
        <form onSubmit={addHabit} className="flex gap-3 mb-8">
          <input 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a custom habit..." 
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-sage-50 dark:bg-gray-800 dark:border-gray-700 outline-none focus:border-sage-400 transition-all"
          />
          <button 
            type="submit" 
            className="w-14 h-14 bg-sage-600 text-white rounded-2xl hover:bg-sage-700 transition-all shadow-lg flex items-center justify-center active:scale-95"
          >
            <Plus size={28} />
          </button>
        </form>

        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {habits.length === 0 && <p className="text-sage-400 text-center py-4 italic">No goals set for today.</p>}
          {habits.map((habit, i) => (
            <div key={i} className="flex items-center justify-between group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-sage-50 dark:border-gray-700 shadow-sm hover:border-sage-200 transition-all">
              <div onClick={() => toggleHabit(i)} className="flex items-center gap-4 cursor-pointer">
                <CheckCircle2 className={`transition-colors ${habit.completed ? "text-sage-600" : "text-gray-200 group-hover:text-sage-300"}`} />
                <span className={`font-bold transition-all ${habit.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {habit.name}
                </span>
              </div>
              <button 
                onClick={() => deleteHabit(i)} 
                className="p-2 text-red-200 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;