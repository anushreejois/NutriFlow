/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, Sparkles, ShieldCheck, Zap, MessageSquare, Activity } from "lucide-react";
import { useRef } from "react";

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const btnClasses = "w-full sm:w-auto group relative px-10 py-5 md:px-12 md:py-6 bg-sage-950 dark:bg-white text-white dark:text-sage-950 rounded-2xl font-bold text-lg md:text-xl overflow-hidden transition-shadow hover:shadow-[0_15px_40px_rgba(50,70,50,0.3)] dark:hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)]";

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#fdfdfb] dark:bg-gray-950 transition-colors duration-700">
      
      {/* --- 1. DYNAMIC BACKGROUND ENGINE --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-sage-200/40 dark:bg-sage-800/30 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-earth-200/30 dark:bg-earth-800/20 blur-[120px] rounded-full" 
        />
      </div>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 z-10">
        <motion.div style={{ y, opacity }} className="max-w-6xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/60 dark:bg-gray-900/60 border border-sage-300 dark:border-sage-700 mb-8 md:mb-10 backdrop-blur-md shadow-sm"
          >
            <Sparkles size={16} className="text-sage-600 dark:text-sage-400 animate-pulse" />
            <span className="text-sage-950 dark:text-sage-50 text-[11px] font-black uppercase tracking-[0.2em]">
              NutriFlow v3.0: Biological Intelligence
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-black text-sage-950 dark:text-white leading-[0.9] tracking-tighter mb-8 md:mb-12"
          >
            Sync Your <br className="hidden md:block" />
            <span className="italic font-serif text-sage-700 dark:text-sage-300">Biological</span> Rhythm.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.1 }}
            className="text-xl md:text-2xl text-sage-900 dark:text-sage-50 max-w-3xl mx-auto mb-12 md:mb-16 font-medium leading-relaxed"
          >
            Your body isn't linear, so your health tech shouldn't be either. NutriFlow uses Llama-3 AI to adapt to your hormone phases in real-time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5"
          >
            <SignedIn>
              <Link to="/dashboard" className={btnClasses}>
                <div className="absolute inset-0 bg-sage-700 dark:bg-sage-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-3 uppercase text-xs tracking-widest font-black">
                  Go to Dashboard <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className={btnClasses}>
                  <div className="absolute inset-0 bg-sage-700 dark:bg-sage-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-3 uppercase text-xs tracking-widest font-black">
                    Get Started Free <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </SignInButton>
            </SignedOut>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 3. PREMIUM SERVICES GRID --- */}
      <section className="relative z-10 py-24 px-6 bg-white/40 dark:bg-black/20 backdrop-blur-lg border-t border-sage-200 dark:border-sage-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-sage-950 dark:text-white tracking-tighter mb-4 md:mb-6 leading-tight uppercase">
                Designed for your <br className="hidden md:block"/> chemistry.
              </h2>
            </div>
            <p className="text-sage-800 dark:text-sage-200 text-lg md:text-xl max-w-md font-medium italic">
              "We move beyond calorie counting to deliver precision nutrition synced to your metabolic clock."
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Heart size={24} />}
              title="Phase-Match AI"
              subtitle="[Llama-3 Powered]"
              desc="Our engine rebuilds your protocol based on estrogen and progesterone peaks. Sync meals to your chemistry."
              linkText="Explore AI Plans"
              themeColor="text-rose-600 dark:text-rose-400"
              bgHex="#e11d48"
              delay={0.1}
              linkTo="/dashboard" 
            />
            <FeatureCard 
              icon={<ShieldCheck size={24} />}
              title="The Bio-Vault"
              subtitle="[Secure Archive]"
              desc="A permanent, chronological record of your biological journey and every optimized protocol ever generated."
              linkText="Access Vault"
              themeColor="text-sage-600 dark:text-sage-400"
              bgHex="#4d7c0f"
              delay={0.2}
              linkTo="/vault" 
            />
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="NutriBot AI"
              subtitle="[Real-Time Adjust]"
              desc="Don't like a meal? NutriBot swaps it instantly while keeping your macros and bio-phase perfect."
              linkText="Chat with AI"
              themeColor="text-blue-600 dark:text-blue-400"
              bgHex="#2563eb"
              delay={0.3}
              linkTo="/dashboard" 
            />
            <FeatureCard 
              icon={<Activity size={24} />}
              title="Adaptive Fitness"
              subtitle="[Dynamic Training]"
              desc="Workout protocols that scale based on your recovery data, energy levels, and current metabolic phase."
              linkText="View Workouts"
              themeColor="text-emerald-600 dark:text-emerald-400"
              bgHex="#10b981"
              delay={0.4}
              linkTo="/routine" 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- CLICKABLE PREMIUM FEATURE CARD ---
const FeatureCard = ({ icon, title, subtitle, desc, linkText, themeColor, bgHex, delay, linkTo }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: "spring", stiffness: 50, damping: 15, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative group cursor-pointer"
  >
    <Link to={linkTo} className="block relative overflow-hidden p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-sage-100 dark:border-gray-800 shadow-lg transition-all h-full">
      <div 
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: bgHex }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md" style={{ backgroundColor: bgHex }}>
          {icon}
        </div>
        <h3 className="text-xl font-black text-sage-950 dark:text-white mb-1 tracking-tight uppercase leading-tight">{title}</h3>
        <p className={`text-[10px] font-black mb-5 tracking-widest uppercase ${themeColor}`}>{subtitle}</p>
        <p className="text-sage-800 dark:text-sage-400 text-sm leading-relaxed font-medium mb-10 flex-grow">
          {desc}
        </p>
        <div className={`text-[10px] font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest ${themeColor}`}>
          {linkText} <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default LandingPage;