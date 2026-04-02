/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, HeartPulse, CheckCircle, BookOpen, PenTool, Heart, X, Loader2 } from "lucide-react";
import { getBlogs, createBlog, likeBlog } from "../services/api"; 

// --- DATA: The Medical Info (Untouched) ---
const healthData = {
  women: [
    {
      id: "pcos",
      title: "PCOS (Polycystic Ovary Syndrome)",
      what: "A hormonal disorder causing enlarged ovaries with small cysts on the outer edges. It creates an imbalance of reproductive hormones.",
      avoid: "Reduce processed sugars, refined carbs, and sedentary lifestyle. Avoid endocrine disruptors (plastics).",
      balance: "Seed cycling, consistent sleep schedule, and low-impact weighted workouts.",
      cure: "No absolute cure, but highly manageable. Metformin, inositol supplements, and strict lifestyle changes can reverse symptoms."
    },
    {
      id: "thyroid",
      title: "Hypothyroidism (Underactive Thyroid)",
      what: "The thyroid gland doesn't create enough thyroid hormone, leading to fatigue, weight gain, and cold sensitivity.",
      avoid: "Goitrogens (raw broccoli/kale) in excess, soy products, and chronic stress.",
      balance: "Selenium-rich foods (Brazil nuts), iodine intake, and regular exercise.",
      cure: "Thyroid hormone replacement therapy (Levothyroxine) and diet management."
    }
  ],
  men: [
    {
      id: "cardio",
      title: "Cardiovascular Health (Hypertension)",
      what: "High blood pressure forces the heart to work harder to pump blood, risking heart attack or stroke.",
      avoid: "High sodium diets, excessive alcohol, smoking, and high-stress environments.",
      balance: "Regular cardio (150 mins/week), potassium-rich foods, and stress management.",
      cure: "Lifestyle changes often reverse it. Medication (beta-blockers) may be needed."
    },
    {
      id: "testosterone",
      title: "Low Testosterone (Low T)",
      what: "A decrease in the male sex hormone, causing fatigue, muscle loss, and mood changes.",
      avoid: "Sleep deprivation, excessive plastic use (BPAs), and extreme calorie deficits.",
      balance: "Heavy compound lifting (squats/deadlifts), Vitamin D, and Zinc supplements.",
      cure: "Testosterone Replacement Therapy (TRT) if clinically low; otherwise lifestyle optimization."
    }
  ]
};

const HealthLibrary = () => {
  const [mainTab, setMainTab] = useState<"guides" | "blogs">("guides");
  const [activeGenderTab, setActiveGenderTab] = useState<"women" | "men">("women");
  
  // Blog State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Modals
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null); 
  
  // New Blog Form State
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Lifestyle");
  const [newBlogContent, setNewBlogContent] = useState("");

  const localUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setIsLoadingBlogs(true);
        const fetchedBlogs = await getBlogs();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching blogs from database:", error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };
    fetchAllBlogs();
  }, []);

  const handlePostBlog = async () => {
    if (!newBlogTitle || !newBlogContent) return;
    setIsPublishing(true);
    
    try {
      const newBlogData = {
        title: newBlogTitle,
        author: localUser.name ? localUser.name.split(" ")[0] : "Anonymous", 
        userId: localUser._id,
        category: newBlogCategory,
        content: newBlogContent,
        excerpt: newBlogContent.substring(0, 120) + "..."
      };

      const savedBlog = await createBlog(newBlogData);
      setBlogs([savedBlog, ...blogs]); 
      
      setNewBlogTitle("");
      setNewBlogContent("");
      setShowWriteModal(false);
    } catch (error) {
      alert("Failed to publish your story. Is the backend running?");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAppreciate = async () => {
    if (!selectedBlog) return;
    try {
      const updatedBlog = await likeBlog(selectedBlog._id);
      setSelectedBlog(updatedBlog);
      setBlogs(blogs.map(b => b._id === updatedBlog._id ? updatedBlog : b));
    } catch (error) {
      console.error("Failed to appreciate the story", error);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 pt-32 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-sage-900 dark:text-white mb-4 tracking-tight">Health Library</h1>
          <p className="text-lg text-sage-600 dark:text-sage-400">Understand your biology, read community stories, or share your own.</p>
        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 border-b-2 border-sage-200 dark:border-gray-800 pb-2">
          <button 
            onClick={() => setMainTab("guides")} 
            className={`text-xl font-bold pb-4 px-4 transition-colors ${mainTab === "guides" ? "text-sage-900 dark:text-white border-b-4 border-sage-600 dark:border-sage-400 translate-y-[6px]" : "text-sage-400 dark:text-gray-500 hover:text-sage-600"}`}
          >
            Clinical Guides
          </button>
          <button 
            onClick={() => setMainTab("blogs")} 
            className={`text-xl font-bold pb-4 px-4 transition-colors ${mainTab === "blogs" ? "text-sage-900 dark:text-white border-b-4 border-sage-600 dark:border-sage-400 translate-y-[6px]" : "text-sage-400 dark:text-gray-500 hover:text-sage-600"}`}
          >
            Community Stories
          </button>
        </div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
          
          {/* --- VIEW 1: MEDICAL GUIDES --- */}
          {mainTab === "guides" && (
            <motion.div key="guides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
              <div className="flex justify-center gap-4 mb-10">
                <TabButton label="Women's Health" isActive={activeGenderTab === "women"} onClick={() => setActiveGenderTab("women")} />
                <TabButton label="Men's Health" isActive={activeGenderTab === "men"} onClick={() => setActiveGenderTab("men")} />
              </div>

              <motion.div layout className="space-y-6">
                <AnimatePresence mode="wait">
                  {healthData[activeGenderTab].map((item) => (
                    <ExpandableCard key={item.id} data={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* --- VIEW 2: COMMUNITY BLOGS --- */}
          {mainTab === "blogs" && (
            <motion.div key="blogs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-sage-900 dark:text-white">Latest from the Community</h2>
                <button 
                  onClick={() => setShowWriteModal(true)}
                  className="flex items-center gap-2 bg-sage-800 hover:bg-sage-900 dark:bg-sage-200 dark:hover:bg-white text-white dark:text-sage-900 px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
                >
                  <PenTool size={18} /> Write a Blog
                </button>
              </div>

              {isLoadingBlogs ? (
                <div className="flex flex-col items-center justify-center py-20 text-sage-500">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold">Loading community stories...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-sage-100 dark:border-gray-700">
                  <BookOpen className="mx-auto text-sage-300 dark:text-gray-600 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-sage-900 dark:text-white mb-2">It's quiet in here...</h3>
                  <p className="text-sage-500">Be the first to share your health journey with the community!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map((blog, i) => (
                    <motion.div 
                      key={blog._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedBlog(blog)}
                      className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-sage-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-sage-500 dark:text-sage-400 bg-sage-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <BookOpen className="text-sage-300 dark:text-gray-600 group-hover:text-sage-500 transition-colors" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-sage-900 dark:text-white mb-3 leading-tight group-hover:text-sage-600 dark:group-hover:text-sage-300 transition-colors">{blog.title}</h3>
                      <p className="text-sage-600 dark:text-sage-400 text-sm mb-6 leading-relaxed line-clamp-3 flex-grow">{blog.excerpt}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-sage-50 dark:border-gray-700">
                        <span className="text-sm font-bold text-sage-800 dark:text-sage-200">By {blog.author}</span>
                        <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
                          <Heart size={16} className="fill-current" /> {blog.likes || 0}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* --- READ BLOG MODAL (FIXED: z-index 110 + Close Button) --- */}
        <AnimatePresence>
          {selectedBlog && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative scrollbar-hide"
              >
                {/* CLOSE BUTTON ADDED HERE */}
                <button 
                  onClick={() => setSelectedBlog(null)} 
                  className="absolute top-6 right-6 text-sage-400 hover:text-sage-900 dark:hover:text-white transition-colors bg-sage-100 dark:bg-gray-800 p-2 rounded-full"
                >
                  <X size={20} />
                </button>
                
                <span className="inline-block text-xs font-black uppercase tracking-widest text-sage-600 dark:text-sage-300 bg-sage-100 dark:bg-sage-900 border border-sage-200 dark:border-sage-700 px-4 py-1.5 rounded-full mb-6">
                  {selectedBlog.category}
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black text-sage-900 dark:text-white mb-6 leading-tight">{selectedBlog.title}</h2>
                
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-sage-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-sage-200 dark:bg-sage-800 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 font-bold text-lg">
                    {selectedBlog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sage-900 dark:text-white">Written by {selectedBlog.author}</p>
                    <p className="text-sm text-sage-500">Community Member</p>
                  </div>
                </div>
                
                <div className="text-lg text-sage-800 dark:text-sage-200 leading-relaxed whitespace-pre-wrap font-medium pb-8">
                  {selectedBlog.content}
                </div>

                <div className="mt-8 pt-8 border-t border-sage-100 dark:border-gray-800 flex justify-center">
                   <button 
                     onClick={handleAppreciate}
                     className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-transform active:scale-95"
                   >
                      <Heart size={20} className="fill-current" /> Appreciate Story ({selectedBlog.likes || 0})
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- WRITE A BLOG MODAL --- */}
        <AnimatePresence>
          {showWriteModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-sage-950/40 dark:bg-black/60 backdrop-blur-sm px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative"
              >
                <button onClick={() => setShowWriteModal(false)} className="absolute top-6 right-6 text-sage-400 hover:text-sage-900 dark:hover:text-white transition-colors bg-sage-100 dark:bg-gray-800 p-2 rounded-full">
                  <X size={20} />
                </button>
                <h2 className="text-3xl font-black text-sage-900 dark:text-white mb-2">Share Your Story</h2>
                <p className="text-sage-600 dark:text-sage-400 mb-8 font-medium">Write about your lifestyle, health struggles, or wins to inspire others.</p>
                
                <div className="space-y-4 mb-8">
                  <input 
                    type="text" 
                    placeholder="Story Title..."
                    className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-bold text-lg dark:text-white"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                  />
                  <select 
                    className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium text-sage-700 dark:text-sage-200"
                    value={newBlogCategory}
                    onChange={(e) => setNewBlogCategory(e.target.value)}
                  >
                    <option value="Lifestyle">Lifestyle & Habits</option>
                    <option value="Women's Health">Women's Health & Challenges</option>
                    <option value="Men's Health">Men's Health & Challenges</option>
                    <option value="Mental Health">Mental Health & Stress</option>
                  </select>
                  <textarea 
                    rows={8}
                    placeholder="Start writing your experience here..."
                    className="w-full p-4 rounded-2xl bg-sage-50 dark:bg-gray-800 border-none ring-1 ring-sage-200 dark:ring-gray-700 focus:ring-2 focus:ring-sage-600 outline-none font-medium resize-none dark:text-white"
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={handlePostBlog}
                  disabled={isPublishing || !newBlogTitle || !newBlogContent}
                  className="w-full py-4 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-950 font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isPublishing ? <><Loader2 className="animate-spin" size={20} /> Publishing...</> : "Publish to Community"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (UNTOUCHED) ---
const TabButton = ({ label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
      isActive 
        ? "bg-sage-600 text-white shadow-lg scale-105" 
        : "bg-white dark:bg-gray-800 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-gray-700"
    }`}
  >
    {label}
  </button>
);

const ExpandableCard = ({ data }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-3xl border border-sage-100 dark:border-sage-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
      >
        <h3 className="text-xl font-bold text-sage-800 dark:text-white flex items-center gap-3">
          <Activity className="text-sage-500" />
          {data.title}
        </h3>
        <span className={`text-sage-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-8 border-t border-sage-50 dark:border-gray-700"
          >
            <div className="pt-4 space-y-6">
              <InfoSection icon={<ShieldAlert className="text-red-500"/>} title="What is it?" text={data.what} />
              <InfoSection icon={<ShieldAlert className="text-orange-500"/>} title="How to Avoid?" text={data.avoid} />
              <InfoSection icon={<HeartPulse className="text-blue-500"/>} title="How to Balance?" text={data.balance} />
              <InfoSection icon={<CheckCircle className="text-green-500"/>} title="Treatment / Cure" text={data.cure} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoSection = ({ icon, title, text }: any) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-900 dark:text-gray-200 text-sm uppercase tracking-wide mb-1">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default HealthLibrary;