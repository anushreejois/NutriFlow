/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Activity, User, Scale, Ruler, Target, Heart, Sparkles, Venus, Mars, Stethoscope, AlertTriangle } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Integrated Clerk context hook

interface HealthFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const HealthForm = ({ onSubmit, isLoading }: HealthFormProps) => {
  const { user } = useUser();

  // Initialize with values saved locally to ensure the user never faces blank inputs
  const [formData, setFormData] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const savedMetrics = JSON.parse(localStorage.getItem("nutriflow_user_metrics") || "{}");
    return {
      gender: userInfo.gender || savedMetrics.gender || "female", 
      age: userInfo.age || savedMetrics.age || "24", 
      weight: userInfo.weight || savedMetrics.weight || "68",
      height: userInfo.height || savedMetrics.height || "178",
      cyclePhase: savedMetrics.cyclePhase || "follicular", 
      activityLevel: userInfo.activityLevel || savedMetrics.activityLevel || "moderate",
      goal: userInfo.goal || savedMetrics.goal || "balance",
      dietary: userInfo.dietary || savedMetrics.dietary || "standard",
      condition: savedMetrics.condition || "none", 
    };
  });

  // Automatically monitor and persist input updates to keep states synchronous
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFields = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFields);
    localStorage.setItem("nutriflow_user_metrics", JSON.stringify(updatedFields));
  };

  const setGender = (gender: "female" | "male") => {
    const updatedFields = { ...formData, gender };
    setFormData(updatedFields);
    localStorage.setItem("nutriflow_user_metrics", JSON.stringify(updatedFields));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-sage-900 dark:text-white mb-2">Generate Your Daily Plan</h2>
        <p className="text-sage-600 dark:text-sage-400">
          {user ? `Welcome, ${user.firstName || "Anushree"}. Customize your current biometrics.` : "Tell AI about your body today."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* GENDER SELECTOR */}
        <div className="flex justify-center gap-4 mb-6">
          <button type="button" onClick={() => setGender("female")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all ${formData.gender === "female" ? "bg-pink-100 border-pink-500 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200" : "bg-white dark:bg-gray-800 border-transparent text-gray-500 hover:border-pink-200"}`}>
            <Venus size={20} /> Female
          </button>
          <button type="button" onClick={() => setGender("male")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all ${formData.gender === "male" ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200" : "bg-white dark:bg-gray-800 border-transparent text-gray-500 hover:border-blue-200"}`}>
            <Mars size={20} /> Male
          </button>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup icon={<User size={18} />} label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
          <InputGroup icon={<Scale size={18} />} label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} required />
          <InputGroup icon={<Ruler size={18} />} label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} required />
        </div>

        {/* Cycle & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <AnimatePresence>
            {formData.gender === "female" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <SelectGroup icon={<Sparkles size={18} />} label="Cycle Phase" name="cyclePhase" value={formData.cyclePhase} onChange={handleChange}
                  options={[
                    { value: "menstrual", label: "Menstrual (Bleeding)" },
                    { value: "follicular", label: "Follicular (Rising Energy)" },
                    { value: "ovulation", label: "Ovulation (Peak Energy)" },
                    { value: "luteal", label: "Luteal (PMS/Low Energy)" },
                    { value: "menopause", label: "Menopause" },
                  ]} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <SelectGroup icon={<Activity size={18} />} label="Activity Level" name="activityLevel" value={formData.activityLevel} onChange={handleChange}
            options={[
              { value: "sedentary", label: "Sedentary (Office Job)" },
              { value: "light", label: "Light (Walking/Yoga)" },
              { value: "moderate", label: "Moderate (Gym 3-4x)" },
              { value: "active", label: "Active (Athlete)" },
            ]} 
          />
        </div>

        {/* Goal & Diet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup icon={<Target size={18} />} label="Wellness Goal" name="goal" value={formData.goal} onChange={handleChange}
            options={[
              { value: "balance", label: "Hormonal Balance" },
              { value: "lose", label: "Sustainable Weight Loss" },
              { value: "gain", label: "Build Muscle / Gain Weight" },
              { value: "maintain", label: "Maintain & Balance" },
            ]} 
          />
          <SelectGroup icon={<Heart size={18} />} label="Dietary Preference" name="dietary" value={formData.dietary} onChange={handleChange}
            options={[
              { value: "standard", label: "Standard (No Restrictions)" },
              { value: "vegetarian", label: "Vegetarian" },
              { value: "vegan", label: "Vegan" },
              { value: "pescatarian", label: "Pescatarian" },
              { value: "keto", label: "Keto / Low Carb" },
            ]} 
          />
        </div>

        {/* --- OPTIONAL MEDICAL CONDITION --- */}
        <div className="pt-4 border-t border-sage-200 dark:border-gray-700">
          <SelectGroup icon={<Stethoscope size={18} />} label="Health Conditions (Optional)" name="condition" value={formData.condition} onChange={handleChange}
              options={[
                { value: "none", label: "None / Prefer not to say" },
                { value: "pcos", label: "PCOS (Polycystic Ovary Syndrome)" },
                { value: "hypothyroidism", label: "Hypothyroidism" },
                { value: "hypertension", label: "Hypertension (High BP)" },
                { value: "low_testosterone", label: "Low Testosterone" },
                { value: "insulin_resistance", label: "Insulin Resistance / Pre-diabetes" },
              ]} 
            />
        </div>

        {/* --- MEDICAL DISCLAIMER --- */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex items-start gap-3 border border-amber-200 dark:border-amber-800/50">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed font-medium">
            <strong>Disclaimer:</strong> NutriFlow AI provides basic lifestyle and nutritional recommendations to help support a healthy routine. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor or endocrinologist for clinical insights before making drastic changes.
          </p>
        </div>

        {/* SUBMIT */}
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-sage-600 to-earth-500 hover:from-sage-700 hover:to-earth-600"
          }`}
        >
          {isLoading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={20} /></motion.div> Analyzing Biometrics...</> : <>Generate Plan <Send size={20} /></>}
        </motion.button>
      </form>
    </motion.div>
  );
};

// HELPER COMPONENTS
const InputGroup = ({ icon, label, ...props }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-bold text-sage-700 dark:text-sage-300 flex items-center gap-2">{icon} {label}</label>
    <input {...props} className="w-full p-3 bg-sage-50 dark:bg-gray-700 border border-sage-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"/>
  </div>
);

const SelectGroup = ({ icon, label, options, ...props }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-bold text-sage-700 dark:text-sage-300 flex items-center gap-2">{icon} {label}</label>
    <div className="relative">
      <select {...props} className="w-full p-3 bg-sage-50 dark:bg-gray-700 border border-sage-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none transition-all appearance-none dark:text-white">
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-3 top-3.5 text-sage-400 pointer-events-none">▼</div>
    </div>
  </div>
);

export default HealthForm;