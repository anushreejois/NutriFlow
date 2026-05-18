import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { syncClerkToDB } from "./services/api";
import OneSignal from 'react-onesignal';

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import NutriBot from "./components/NutriBot";
import IntroLoader from "./components/IntroLoader";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// --- PAGES ---
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import HealthLibrary from "./pages/HealthLibrary";
import Profile from "./pages/Profile"; 
import Trackers from './pages/Trackers';
import Routine from './pages/Routine';
import BioVault from "./pages/BioVault";

declare global {
  interface Window {
    OneSignalInitialized?: boolean;
  }
}

// --- REUSABLE PROTECTED WRAPPER ---
const Protected = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
);

// --- 404 PAGE ---
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-sage-50 dark:bg-gray-900 px-6 text-center">
    <h1 className="text-[8rem] font-black text-sage-200 dark:text-gray-800 leading-none">404</h1>
    <h2 className="text-2xl font-black text-sage-900 dark:text-white mb-4 tracking-tight">Page Not Found</h2>
    <p className="text-sage-600 dark:text-sage-400 mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved. Let's get you back on track.
    </p>
    <Link
      to="/"
      className="px-8 py-4 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg"
    >
      Go Home
    </Link>
  </div>
);

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [showIntro, setShowIntro] = useState(() => {
    // Skip intro for returning users
    if (localStorage.getItem("nutriflow_visited")) return false;
    return true;
  });

  // --- THE SYNC BRIDGE (Clerk to MongoDB) ---
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          const dbUser = await syncClerkToDB({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || "NutriFlow User",
          });
          
          localStorage.setItem("userInfo", JSON.stringify(dbUser));
        } catch (error) {
          console.error("Failed to sync user to database:", error);
        }
      } else if (isLoaded && !isSignedIn) {
        localStorage.removeItem("userInfo");
      }
    };

    syncUser();
  }, [isSignedIn, user, isLoaded]);

  // --- ONESIGNAL INIT ---
  useEffect(() => {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    if (appId && !window.OneSignalInitialized) {
      OneSignal.init({ 
        appId, 
        allowLocalhostAsSecureOrigin: true 
      }).then(() => {
        window.OneSignalInitialized = true;
      });
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("nutriflow_visited", "true");
    setShowIntro(false);
  };

  return (
    <Router>
      {/* 1. INTRO SPLASH SCREEN */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroLoader key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div className="font-sans antialiased text-gray-900 dark:text-gray-100 min-h-screen bg-sage-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/library" element={<HealthLibrary />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route path="/dashboard" element={<Protected><ErrorBoundary><Dashboard /></ErrorBoundary></Protected>} />
          <Route path="/vault" element={<Protected><ErrorBoundary><BioVault /></ErrorBoundary></Protected>} />
          <Route path="/profile" element={<Protected><ErrorBoundary><Profile /></ErrorBoundary></Protected>} />
          <Route path="/trackers" element={<Protected><ErrorBoundary><Trackers /></ErrorBoundary></Protected>} />
          <Route path="/routine" element={<Protected><ErrorBoundary><Routine /></ErrorBoundary></Protected>} />

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>

      {/* 2. FLOATING AI ASSISTANT */}
      <NutriBot /> 
    </Router>
  );
}

export default App;