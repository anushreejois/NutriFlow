/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Dumbbell, Calendar, X, Activity, Target, Trash2, Clock, Sparkles } from "lucide-react";
import axios from "axios";

const BioVault = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/plans/${user._id}`);
      setPlans(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if (user._id) fetchPlans(); }, [user._id]);

  const parseAI = (content: string) => {
    try {
      const cleanJson = content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) { return null; }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-sage-600 font-black tracking-widest text-xs uppercase">Syncing Records...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Bio-Vault</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Chronological archive of your biological protocols.</p>
        </header>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {plans.map((plan) => {
            const data = parseAI(plan.aiResponse);
            if (!data) return null;
            return (
              <motion.div 
                key={plan._id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPlan({ ...plan, parsed: data })}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black bg-sage-50 text-sage-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {user.gender === 'male' ? 'Performance' : (plan.formData.cyclePhase || 'General')}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(plan.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-black text-gray-800 dark:text-white leading-snug mb-4 line-clamp-2">{data.summary}</h3>
                <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                  <span className="flex items-center gap-1"><Utensils size={12}/> Meals</span>
                  <span className="flex items-center gap-1"><Dumbbell size={12}/> {data.workout.type}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DETAILED MODAL - CLEANER & SMALLER TEXT */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-8 md:p-10 relative custom-scrollbar shadow-2xl border border-gray-100 dark:border-gray-800">
              <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
              
              <div className="mb-8 pb-6 border-b border-gray-50 dark:border-gray-800">
                <span className="text-[10px] font-black text-sage-500 uppercase tracking-widest">Protocol ID: {selectedPlan._id.slice(-6)}</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1 leading-tight">{selectedPlan.parsed.summary}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-2"><Utensils size={14}/> Nutrition</h4>
                  {Object.entries(selectedPlan.parsed.meals).map(([key, meal]: any) => (
                    <div key={key} className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[9px] font-black text-sage-500 uppercase mb-1">{key}</p>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">{meal.item} • {meal.calories}kcal</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{meal.benefits}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-2"><Dumbbell size={14}/> Fitness</h4>
                  <div className="p-6 bg-rose-500 rounded-3xl text-white shadow-lg shadow-rose-500/20">
                    <p className="text-[9px] font-black text-rose-100 uppercase tracking-widest mb-1">{selectedPlan.parsed.workout.type}</p>
                    <p className="text-xl font-black mb-4">{selectedPlan.parsed.workout.duration}</p>
                    <p className="text-[11px] font-medium leading-relaxed bg-white/10 p-3 rounded-xl">{selectedPlan.parsed.workout.focus}</p>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Contextual Metrics</p>
                    <div className="flex justify-between">
                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">Weight</p><p className="text-sm font-black dark:text-white">{selectedPlan.formData.weight}kg</p></div>
                      <div className="text-right"><p className="text-[9px] font-bold text-gray-400 uppercase">Profile</p><p className="text-sm font-black text-rose-500 uppercase">{user.gender === 'male' ? 'Active Male' : selectedPlan.formData.cyclePhase}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BioVault;