/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, FileText, Loader2, Utensils, Dumbbell } from "lucide-react";
import { getPlanHistory } from "../services/api";
import { useUser } from "@clerk/clerk-react"; // Integrated Clerk context

const PlanHistory = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { user } = useUser(); // Real-time safe session access

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          const data = await getPlanHistory(user.id);
          setPlans(data);
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  // --- SAFE PARSING UTILITY ---
  const parsePlan = (aiString: string) => {
    try {
      const cleanJson = aiString.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      return null;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-sage-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Syncing Bio-History...</p>
    </div>
  );

  if (plans.length === 0) return (
    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-sage-200 dark:border-gray-700">
      <FileText className="mx-auto mb-4 text-sage-200" size={48} />
      <h3 className="text-xl font-bold text-gray-400">No records found</h3>
      <p className="text-sage-500 text-sm">Your AI-generated journey starts here.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-sage-900 dark:text-white mb-6 uppercase tracking-tight">Past AI Recommendations</h2>
      
      <div className="grid gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="space-y-2">
            <motion.div
              whileHover={{ x: 5 }}
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${
                selectedPlan?._id === plan._id 
                ? "bg-sage-900 border-sage-900 text-white shadow-xl" 
                : "bg-white dark:bg-gray-800 border-sage-100 dark:border-gray-700 hover:border-sage-400"
              }`}
              onClick={() => setSelectedPlan(selectedPlan?._id === plan._id ? null : plan)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${selectedPlan?._id === plan._id ? "bg-white/10" : "bg-sage-50 dark:bg-sage-900/30 text-sage-600"}`}>
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide">
                    {new Date(plan.date || plan.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedPlan?._id === plan._id ? "text-sage-300" : "text-sage-500"}`}>
                    Goal: {plan.formData?.goal || "N/A"}
                  </p>
                </div>
              </div>
              <ChevronRight className={`transition-transform ${selectedPlan?._id === plan._id ? 'rotate-90 text-white' : 'text-sage-300'}`} />
            </motion.div>

            {/* EXPANDED VIEW - NO MORE RAW JSON */}
            <AnimatePresence>
              {selectedPlan?._id === plan._id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] mt-2 border border-sage-100 dark:border-gray-800 space-y-8">
                    {(() => {
                      const data = parsePlan(plan.aiResponse);
                      if (!data) return <p className="text-rose-500 font-bold text-center">Protocol data corrupted.</p>;
                      
                      return (
                        <>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-sage-500 uppercase tracking-widest">Summary</p>
                            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{data.summary}"</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* MEALS SNEAK PEEK */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2"><Utensils size={14}/> Nutrition</h5>
                              <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-sage-100 dark:border-gray-700">
                                <p className="text-[10px] font-bold text-sage-400 uppercase">Lunch Highlight</p>
                                <p className="font-black text-gray-900 dark:text-white">{data.meals?.lunch?.item || "Custom Balance"}</p>
                              </div>
                            </div>

                            {/* WORKOUT SNEAK PEEK */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2"><Dumbbell size={14}/> Fitness</h5>
                              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                                <p className="text-[10px] font-bold text-rose-400 uppercase">Focus</p>
                                <p className="font-black text-gray-900 dark:text-white">{data.workout?.type || "Custom Sync Training"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 flex justify-center">
                             <p className="text-[10px] font-black text-gray-400 uppercase">Check Bio-Vault for the full protocol breakdown</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanHistory;