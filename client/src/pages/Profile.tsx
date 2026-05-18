/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Scale, Ruler, Target, Leaf, Activity, Save } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { useToast } from "../components/ToastContext";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "female", // Starts as female, but now we can actually change it!
    goal: "maintain",
    dietary: "standard"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const localUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (localUser._id) {
          const data = await getUserProfile(localUser._id);
          setFormData({
            name: data.name || "",
            age: data.age || "",
            weight: data.weight || "",
            height: data.height || "",
            gender: data.gender?.toLowerCase() || "female", // Forces lowercase
            goal: data.goal || "maintain",
            dietary: data.dietary || "standard"
          });
        }
      } catch (error) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [localUser._id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateUserProfile({ ...formData, userId: localUser._id });
      
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      
      showToast("Biological Profile Updated!");
    } catch (error) {
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sage-600 font-bold">Loading your biology...</div>;
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-950 pt-32 pb-20 px-4 transition-colors relative">


      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-sage-200 dark:bg-sage-800 rounded-full mx-auto mb-6 flex items-center justify-center text-sage-600 dark:text-sage-300 shadow-inner">
            <User size={40} />
          </div>
          <h1 className="text-4xl font-black text-sage-950 dark:text-white mb-2 tracking-tight">Your Bio-Profile</h1>
          <p className="text-sage-600 dark:text-sage-400 font-medium">Keep your metrics updated so our AI can provide the most accurate nutrition plans.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-sage-100 dark:border-gray-800"
        >
          {/* Made this a 2-column grid but it will wrap nicely */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <User size={16} /> Name
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white" />
            </div>

            {/* --- NEW GENDER DROPDOWN --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <User size={16} /> Gender
              </label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white appearance-none">
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> Age
              </label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white" />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <Scale size={16} /> Weight (kg)
              </label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white" />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <Ruler size={16} /> Height (cm)
              </label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white" />
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 border-t border-sage-100 dark:border-gray-800 pt-8">
            
            {/* Goal */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <Target size={16} /> Primary Goal
              </label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white appearance-none">
                <option value="lose">Lose Body Fat</option>
                <option value="maintain">Maintain & Balance Hormones</option>
                <option value="gain">Build Muscle / Gain Weight</option>
              </select>
            </div>

            {/* Dietary */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider flex items-center gap-2">
                <Leaf size={16} /> Dietary Preference
              </label>
              <select name="dietary" value={formData.dietary} onChange={handleChange} className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium dark:text-white appearance-none">
                <option value="standard">Standard (No Restrictions)</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="keto">Keto / Low Carb</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-5 bg-sage-950 dark:bg-sage-200 text-white dark:text-sage-950 font-black text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-sage-900/20 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? "Syncing DNA..." : <><Save size={20} /> Update Bio-Profile</>}
          </button>
        </motion.form>

      </div>
    </div>
  );
};

export default Profile;