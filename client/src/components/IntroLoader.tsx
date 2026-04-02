import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Seed", "Pulse", "Bloom", "NutriFlow"];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const isLastWord = index === words.length - 1;

    if (!isLastWord) {
      // Build-up rhythm (900ms per word)
      const timeout = setTimeout(() => setIndex(index + 1), 900);
      return () => clearTimeout(timeout);
    } else {
      // Final brand visibility (3000ms)
      const timeout = setTimeout(() => onComplete(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[500] bg-[#fdfdfb] dark:bg-gray-950 flex items-center justify-center overflow-hidden"
    >
      {/* --- 1. THE LIQUID BIOME --- */}
      <div className="absolute inset-0 flex items-center justify-center filter blur-3xl opacity-30">
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-96 h-96 bg-sage-400 rounded-full mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 50, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.8, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-80 h-80 bg-earth-300 rounded-full mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* --- 2. THE FLOATING TEXT ENGINE --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={words[index]}
            initial={{ opacity: 0, letterSpacing: "-0.5em", filter: "blur(12px)" }}
            animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)" }}
            exit={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Reverted to your original font sizes */}
            <h1 className={`text-4xl md:text-6xl font-serif italic text-sage-900 dark:text-white text-center`}>
              {words[index]}
            </h1>
            
            {/* --- 3. SUBTLE PHASE INDICATOR --- */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="mt-4 text-[9px] font-black uppercase tracking-[0.4em] text-sage-600"
            >
              Phase 0{index + 1}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* --- 4. ORGANIC PROGRESS CIRCLE --- */}
        <div className="absolute -inset-16 md:-inset-24">
          <svg className="w-full h-full rotate-[-90deg]">
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-sage-200 dark:text-gray-800"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              // Duration synced to total animation time (approx 5.7s)
              transition={{ duration: 5.7, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      {/* --- 5. MINIMAL BRAND MARK --- */}
      <div className="absolute bottom-12 overflow-hidden">
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.6em]"
        >
          Biological Harmony
        </motion.p>
      </div>
    </motion.div>
  );
};

export default IntroLoader;