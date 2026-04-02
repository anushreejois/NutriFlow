import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { syncClerkToDB } from "./services/api";
import OneSignal from 'react-onesignal';

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import NutriBot from "./components/NutriBot";
import IntroLoader from "./components/IntroLoader";

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

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [showIntro, setShowIntro] = useState(true);

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
    if (!window.OneSignalInitialized) {
      OneSignal.init({ 
        appId: "47f8363e-5d71-4623-a0c4-e16f843f6c91", 
        allowLocalhostAsSecureOrigin: true 
      }).then(() => {
        window.OneSignalInitialized = true;
      });
    }
  }, []);

  return (
    <Router>
      {/* 1. INTRO SPLASH SCREEN */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroLoader key="intro" onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <div className="font-sans antialiased text-gray-900 dark:text-gray-100 min-h-screen bg-sage-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/library" element={<HealthLibrary />} />

          {/* --- PROTECTED ROUTES (LOCKED) --- */}
          <Route 
            path="/dashboard" 
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            } 
          />
          <Route 
            path="/vault" 
            element={
              <>
                <SignedIn><BioVault /></SignedIn>
                <SignedOut><RedirectToSignIn /></SignedOut>
              </>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <SignedIn>
                <Profile />
              </SignedIn>
            } 
          />
          <Route 
            path="/trackers" 
            element={
              <SignedIn>
                <Trackers />
              </SignedIn>
            } 
          />
          <Route 
            path="/routine" 
            element={
              <SignedIn>
                <Routine />
              </SignedIn>
            } 
          />

          {/* CATCH-ALL REDIRECT */}
          <Route 
            path="*" 
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            } 
          />
        </Routes>
      </div>

      {/* 2. FLOATING AI ASSISTANT */}
      <NutriBot /> 
    </Router>
  );
}

export default App;