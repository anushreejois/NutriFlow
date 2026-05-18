/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck, Github, Linkedin, Cpu, Globe, ArrowRight, Database, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 transition-colors duration-300 pt-32 pb-20 px-6">
      
      {/* 1. Header with Fade In */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-black text-sage-900 dark:text-white mb-6">
          Empowering Health Through <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-earth-500">
            Hormonal Harmony.
          </span>
        </h1>
        <p className="text-xl text-sage-700 dark:text-sage-300 leading-relaxed max-w-2xl mx-auto">
          NutriFlow isn't just a diet app. It's an AI-powered companion that understands your biology, 
          syncing your nutrition and movement with your unique hormonal cycle.
        </p>
      </motion.div>

      {/* --- OUR MISSION SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-white dark:bg-sage-900/30 p-10 md:p-12 rounded-[2.5rem] border border-sage-100 dark:border-sage-800 shadow-sm mb-24 text-center"
      >
        <h2 className="text-2xl font-bold text-sage-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-lg text-sage-600 dark:text-sage-400 leading-relaxed">
          For too long, the fitness industry has ignored biological reality. Generic 30-day diets fail because they expect your body to be the same every day. We built NutriFlow to change the narrative—using cutting-edge AI to adapt to your specific phases, offering grace and precision when you need it most.
        </p>
      </motion.div>

      {/* 2. Values Grid with Staggered Animation */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-24">
        <ValueCard 
          icon={<Heart size={32} />}
          title="Holistic Approach"
          desc="We believe true health isn't just about weight loss. It's about energy, mood, and long-term vitality."
          delay={0.2}
        />
        <ValueCard 
          icon={<ShieldCheck size={32} />}
          title="Science-Backed"
          desc="Our AI recommendations are grounded in nutritional science and endocrinology principles."
          delay={0.4}
        />
        <ValueCard 
          icon={<Users size={32} />}
          title="Inclusive Design"
          desc="Whether managing PCOS, building muscle, or seeking balance, NutriFlow adapts to your unique chemistry."
          delay={0.6}
        />
      </div>

      {/* --- NEW: CORE SYSTEM CAPABILITIES --- */}
      <div className="max-w-6xl mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-sage-900 dark:text-white">Smart Ecosystem</h2>
          <p className="text-sage-600 dark:text-sage-400 mt-2">Advanced tools designed for real-time biological tracking.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <ValueCard 
            icon={<Database size={32} />}
            title="The Bio-Vault"
            desc="A chronological archive of your biological journey. Every protocol generated is securely stored for you to track your long-term evolution."
            delay={0.2}
          />
          <ValueCard 
            icon={<MessageSquare size={32} />}
            title="NutriBot Assistant"
            desc="Our AI assistant allows for real-time plan adjustments. Don't like a meal? Swap it instantly while staying within your bio-parameters."
            delay={0.4}
          />
        </div>
      </div>

      {/* 3. Team Section */}
      <div className="max-w-5xl mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-sage-900 dark:text-white">Meet The Team</h2>
          <p className="text-sage-600 dark:text-sage-400 mt-2">The minds building the future of wellness.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <TeamCard 
            name="Anushree H S Jois" 
            role="Lead Developer & Founder" 
            image="https://ui-avatars.com/api/?name=Anushree+Jois&background=7fa99b&color=fff"
            delay={0.2}
          />
          <TeamCard 
            name="Project Team" 
            role="Engineering & Design" 
            image="https://ui-avatars.com/api/?name=Team+Member&background=8d7b68&color=fff"
            delay={0.4}
          />
        </div>
      </div>

      {/* --- TECHNOLOGY STACK SECTION --- */}
      <div className="max-w-6xl mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-sage-900 dark:text-white">Powered by 2026 Tech</h2>
          <p className="text-sage-600 dark:text-sage-400 mt-2">Built for speed, accuracy, and absolute privacy.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <ValueCard 
            icon={<Cpu size={32} />}
            title="Groq Llama-3 Engine"
            desc="Generating bio-individual meal plans in milliseconds using the world's fastest inference engine, ensuring your data is processed instantly."
            delay={0.2}
          />
          <ValueCard 
            icon={<Globe size={32} />}
            title="Secure Data Vault"
            desc="Your health and data belong to you. We use modern encryption to ensure your metrics remain entirely private and accessible only to you."
            delay={0.4}
          />
        </div>
      </div>
{/* BOTTOM CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center p-12 bg-sage-950 dark:bg-gray-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Sparkles size={80} />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Collaborate with us.</h2>
        <p className="text-sage-200/60 mb-8 max-w-lg mx-auto font-medium">
          We are constantly refining the NutriFlow engine. If you're a developer or health professional, let's build the future of biology together.
        </p>
        <Link to="/library" className="inline-flex items-center gap-3 bg-white text-sage-950 font-black px-10 py-5 rounded-2xl hover:bg-sage-50 transition-all uppercase text-xs tracking-widest">
          The Bio-Library <ArrowRight size={16} />
        </Link>
      </motion.div>

    </div>
  );
};

// --- Animated Helper Components ---

const ValueCard = ({ icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
    className="p-8 bg-white dark:bg-sage-900/50 rounded-3xl border border-sage-100 dark:border-sage-800 shadow-sm hover:shadow-xl hover:border-sage-300 dark:hover:border-sage-600 transition-all cursor-default h-full"
  >
    <div className="w-14 h-14 bg-sage-100 dark:bg-sage-800 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-200 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-sage-900 dark:text-white mb-3">{title}</h3>
    <p className="text-sage-600 dark:text-sage-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const TeamCard = ({ name, role, image, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-sage-100 dark:border-gray-700 hover:border-sage-400 dark:hover:border-sage-500 hover:shadow-lg transition-all"
  >
    <img src={image} alt={name} className="w-20 h-20 rounded-full shadow-md" />
    <div>
      <h3 className="text-xl font-bold text-sage-900 dark:text-white">{name}</h3>
      <p className="text-sage-600 dark:text-sage-400 font-medium">{role}</p>
      <div className="flex gap-3 mt-3">
        <Github size={18} className="text-gray-400 hover:text-sage-600 cursor-pointer transition-colors" />
        <Linkedin size={18} className="text-gray-400 hover:text-sage-600 cursor-pointer transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default About;