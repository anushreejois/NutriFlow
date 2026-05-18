/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Persist dark mode preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nutriflow_dark");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [hidden, setHidden] = useState(false);
  
  const location = useLocation();
  const { user } = useUser();
  const { scrollY } = useScroll();

  // --- SMART HIDE LOGIC ---
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Dark Mode Toggle Logic — now persists to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem("nutriflow_dark", String(isDark));
  }, [isDark]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setTimeout(() => setIsOpen(false), 0);
  }, [location.pathname]);

  const linkStyle = (path: string) => {
    const active = location.pathname === path;
    return `text-lg font-bold transition-all duration-200 py-2 px-1 relative ${
      active 
        ? "text-sage-900 dark:text-white" 
        : "text-gray-400 dark:text-gray-500 hover:text-sage-700 dark:hover:text-sage-200"
    }`;
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed w-full z-[100] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-sage-100 dark:border-gray-800 transition-all duration-300"
    >
      <div className="max-w-[1600px] mx-auto px-8"> 
        
        {/* DESKTOP LAYOUT (3-Column Grid) */}
        <div className="hidden lg:grid grid-cols-3 items-center h-24">
          
          {/* COLUMN 1: FAR LEFT (Logo) */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🌿</span>
              <span className="text-2xl font-black tracking-tighter text-sage-900 dark:text-white">
                NutriFlow
              </span>
            </Link>
          </div>

          {/* COLUMN 2: CENTER (Navigation) */}
          <div className="flex justify-center items-center gap-8">
            <div className="relative">
              <Link to="/" className={linkStyle("/")}>Home</Link>
              {location.pathname === "/" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
            </div>
            
            <div className="relative">
              <Link to="/about" className={linkStyle("/about")}>About</Link>
              {location.pathname === "/about" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
            </div>

            <div className="relative">
              <Link to="/library" className={linkStyle("/library")}>Library</Link>
              {location.pathname === "/library" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
            </div>

            <SignedIn>
              <div className="relative">
                <Link to="/dashboard" className={linkStyle("/dashboard")}>Dashboard</Link>
                {location.pathname === "/dashboard" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
              </div>
              
              <div className="relative">
                <Link to="/vault" className={linkStyle("/vault")}>Vault</Link>
                {location.pathname === "/vault" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
              </div>

              <div className="relative">
                <Link to="/trackers" className={linkStyle("/trackers")}>Trackers</Link>
                {location.pathname === "/trackers" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
              </div>

              <div className="relative">
                <Link to="/routine" className={linkStyle("/routine")}>Routine</Link>
                {location.pathname === "/routine" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
              </div>

              <div className="relative">
                <Link to="/profile" className={linkStyle("/profile")}>Profile</Link>
                {location.pathname === "/profile" && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-600 rounded-full" />}
              </div>
            </SignedIn>
          </div>

          {/* COLUMN 3: FAR RIGHT (Tools & Auth) */}
          <div className="flex justify-end items-center gap-6">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="p-3 rounded-xl bg-sage-50 dark:bg-gray-800 text-gray-800 dark:text-yellow-300 hover:scale-110 transition-all shadow-inner"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-8 w-[1px] bg-sage-100 dark:bg-gray-800 mx-2" /> 

            <SignedIn>
              <div className="flex flex-col text-right mr-3">
                <span className="text-[10px] text-sage-500 font-bold uppercase tracking-widest leading-tight">Pro Member</span>
                <span className="text-sm font-black text-sage-900 dark:text-white leading-none">
                  {user?.firstName || "User"}
                </span>
              </div>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-11 h-11 border-2 border-sage-100 dark:border-sage-800 shadow-sm" } }} />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-3 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 rounded-2xl font-black text-sm hover:translate-y-[-2px] transition shadow-lg shadow-sage-900/20">
                  Join NutriFlow
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <span className="text-xl font-black text-sage-900 dark:text-white">NutriFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Dark mode toggle for mobile */}
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="p-2.5 rounded-xl bg-sage-50 dark:bg-gray-800 text-gray-800 dark:text-yellow-300 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
            <button onClick={() => setIsOpen(!isOpen)} className="text-sage-900 dark:text-white" aria-label="Open menu"><Menu size={30} /></button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full bg-white dark:bg-gray-900 z-[110] p-10 flex flex-col items-center gap-8 shadow-2xl"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-sage-900 dark:text-white" aria-label="Close menu"><X size={35} /></button>
            <div className="mt-20 flex flex-col items-center gap-8 text-center">
              <Link to="/" className="text-3xl font-bold text-sage-900 dark:text-white">Home</Link>
              <Link to="/about" className="text-3xl font-bold text-sage-900 dark:text-white">About</Link>
              <Link to="/library" className="text-3xl font-bold text-sage-900 dark:text-white">Library</Link>
              <SignedIn>
                <Link to="/dashboard" className="text-3xl font-bold text-sage-900 dark:text-white">Dashboard</Link>
                <Link to="/vault" className="text-3xl font-bold text-sage-900 dark:text-white">Bio-Vault</Link>
                <Link to="/trackers" className="text-3xl font-bold text-sage-900 dark:text-white">Trackers</Link>
                <Link to="/routine" className="text-3xl font-bold text-sage-900 dark:text-white">Routine</Link>
                <Link to="/profile" className="text-3xl font-bold text-sage-900 dark:text-white">Profile</Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="mt-4 px-12 py-5 bg-sage-900 text-white rounded-3xl font-black text-xl">Get Started</button>
                </SignInButton>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;