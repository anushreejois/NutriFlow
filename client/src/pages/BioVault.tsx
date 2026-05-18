/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Dumbbell, X, Trash2, Sparkles, Search, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useToast } from "../components/ToastContext";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BioVault = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { showToast } = useToast();

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/plans/${user._id}`);
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

  // Search/filter logic
  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return plans;
    const query = searchQuery.toLowerCase();
    return plans.filter((plan) => {
      const data = parseAI(plan.aiResponse);
      if (!data) return false;
      const summary = (data.summary || "").toLowerCase();
      const goal = (plan.formData?.goal || "").toLowerCase();
      const phase = (plan.formData?.cyclePhase || "").toLowerCase();
      const date = new Date(plan.date).toLocaleDateString().toLowerCase();
      return summary.includes(query) || goal.includes(query) || phase.includes(query) || date.includes(query);
    });
  }, [plans, searchQuery]);

  // Delete plan
  const handleDelete = async (planId: string) => {
    try {
      await axios.delete(`${API_URL}/plans/${planId}`);
      setPlans((prev) => prev.filter((p) => p._id !== planId));
      setConfirmDelete(null);
      setSelectedPlan(null);
      showToast("Protocol removed from vault.");
    } catch (error) {
      showToast("Failed to delete protocol.", "error");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-sage-600 font-black tracking-widest text-xs uppercase">Syncing Records...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Bio-Vault</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Chronological archive of your biological protocols.</p>
          
          {/* SEARCH BAR */}
          <div className="mt-6 relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by goal, phase, date..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-sage-500 transition-all text-sm font-medium dark:text-white"
            />
          </div>
        </header>

        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-sage-200 dark:border-gray-800">
            <Sparkles className="mx-auto mb-4 text-sage-200" size={48} />
            <h3 className="text-xl font-bold text-gray-400">
              {searchQuery ? "No matching protocols found" : "No protocols saved yet"}
            </h3>
            <p className="text-sage-500 text-sm mt-2">
              {searchQuery ? "Try a different search term." : "Generate your first AI plan from the Dashboard."}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {filteredPlans.map((plan) => {
            const data = parseAI(plan.aiResponse);
            if (!data) return null;
            return (
              <motion.div 
                key={plan._id}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer transition-all relative group"
              >
                {/* DELETE BUTTON (visible on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(plan._id);
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  aria-label="Delete plan"
                >
                  <Trash2 size={16} />
                </button>

                <div
                  onClick={() => setSelectedPlan({ ...plan, parsed: data })}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black bg-sage-50 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {user.gender === 'male' ? 'Performance' : (plan.formData.cyclePhase || 'General')}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(plan.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm font-black text-gray-800 dark:text-white leading-snug mb-4 line-clamp-2">{data.summary}</h3>
                  <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Utensils size={12}/> Meals</span>
                    <span className="flex items-center gap-1"><Dumbbell size={12}/> {data.workout?.type || "Workout"}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-800 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-500">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Protocol?</h3>
              <p className="text-gray-500 text-sm mb-8">This action cannot be undone. The protocol will be permanently removed from your vault.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED MODAL */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-8 md:p-10 relative custom-scrollbar shadow-2xl border border-gray-100 dark:border-gray-800">
              <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close modal"><X size={20}/></button>
              
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