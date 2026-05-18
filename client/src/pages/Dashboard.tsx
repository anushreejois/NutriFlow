/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HealthForm from "../components/HealthForm";
import PlanDisplay from "../components/PlanDisplay";
import PlanHistory from "../components/PlanHistory"; 
import { Utensils, History as HistoryIcon, Sparkles } from "lucide-react";
import { generatePlan, adjustPlan } from "../services/api";
import axios from "axios";
import { useToast } from "../components/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [lastUsedData, setLastUsedData] = useState<any>(null);
  const { showToast } = useToast();
  
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // --- BIO-VAULT SAVE LOGIC (FIXED ENDPOINT) ---
  const saveToVault = async (aiResponse: any, formData: any) => {
    try {
      // Endpoint changed from /api/ai/save to /api/plans/save to match your server index.ts
      await axios.post(`${API_URL}/plans/save`, {
        userId: user._id,
        formData: formData,
        // Ensure aiResponse is a string to match your IPlan model
        aiResponse: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse)
      });
      console.log("📁 Bio-Vault synchronized successfully.");
    } catch (error) {
      console.error("Failed to archive plan to vault:", error);
    }
  };

  const handleGenerate = async (data: any) => {
    setLoading(true);
    setLastUsedData(data); // Capture the Age, Weight, Goal, etc.
    try {
      const result = await generatePlan(data);
      setPlan(result);
      
      // AUTO-SAVE: Send the new plan to the database
      await saveToVault(result, data);
      showToast("Bio-Protocol generated & saved!");
    } catch (error) {
      showToast("Error generating plan. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleAdjust = async () => {
    if (!adjustment || !plan) return;
    setIsAdjusting(true);
    try {
      const updatedPlan = await adjustPlan(plan, adjustment);
      setPlan(updatedPlan); 
      
      // AUTO-SAVE: Save the updated/adjusted version too
      await saveToVault(updatedPlan, lastUsedData);

      setAdjustment("");
      showToast("Bio-Vault Updated!");
    } catch (error) {
      showToast("Failed to adjust plan. Please try again.", "error");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 pt-32 pb-20 px-4 transition-colors duration-300 relative">
      
      <div className="max-w-6xl mx-auto space-y-8"> 
        
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-sage-900 dark:text-white mb-2">
            Welcome back, <span className="text-sage-600 dark:text-sage-400">{user.name ? user.name.split(" ")[0] : "Friend"}</span>!
          </h1>
          <p className="text-sage-600 dark:text-sage-400 font-medium italic">"Your only limit is you."</p>
        </div>

        {/* AI PLAN SECTION */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-sage-100 dark:border-sage-800">
          
          {/* TABS */}
          <div className="flex justify-center gap-4 mb-10">
            <TabButton label="AI Generator" icon={<Utensils size={18}/>} active={activeTab === "daily"} onClick={() => setActiveTab("daily")} />
            <TabButton label="Saved Plans" icon={<HistoryIcon size={18}/>} active={activeTab === "history"} onClick={() => setActiveTab("history")} />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "daily" && (
              <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {!plan ? (
                    <HealthForm onSubmit={handleGenerate} isLoading={loading} />
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-2">
                        <button onClick={() => setPlan(null)} className="text-sage-600 font-bold hover:underline transition-all">← New Search</button>
                        <div className="flex items-center gap-2 text-[10px] bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                          <Sparkles size={12} /> Active Bio-Protocol
                        </div>
                      </div>
                      
                      {/* The component that renders the actual meals/workouts */}
                      <PlanDisplay key={JSON.stringify(plan)} plan={plan} />

                      {/* ADJUSTMENT INPUT */}
                      <div className="mt-8 p-6 bg-sage-50 dark:bg-gray-700/30 rounded-[2rem] border-2 border-dashed border-sage-200 dark:border-gray-600">
                        <p className="text-sm font-bold text-sage-800 dark:text-sage-200 mb-3 flex items-center gap-2 uppercase tracking-wide">✨ Refine this protocol</p>
                        <div className="flex flex-col md:flex-row gap-3">
                          <input 
                            type="text" 
                            placeholder="e.g. 'I'm allergic to nuts' or 'Make the workout shorter'..." 
                            className="flex-1 p-4 rounded-2xl border-none ring-1 ring-sage-200 dark:ring-gray-600 focus:ring-2 focus:ring-sage-500 outline-none text-sm dark:bg-gray-800 dark:text-white transition-all"
                            value={adjustment}
                            onChange={(e) => setAdjustment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdjust()} 
                          />
                          <button 
                            onClick={handleAdjust} disabled={isAdjusting || !adjustment}
                            className="bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                          >
                            {isAdjusting ? "Syncing..." : "Adjust Plan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PlanHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

const TabButton = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
      active 
        ? "bg-sage-900 text-white shadow-xl scale-105" 
        : "bg-white dark:bg-gray-800 text-sage-400 dark:text-gray-500 hover:bg-sage-50 dark:hover:bg-gray-700"
    }`}
  >
    {icon} {label}
  </button>
);

export default Dashboard;