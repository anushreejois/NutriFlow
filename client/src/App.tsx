import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { syncClerkToDB } from "./services/api";
import OneSignal from 'react-onesignal';
import axios from "axios";
import { API_BASE_URL } from "./services/apiConfig";

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
const Protected = ({
  children,
  profileStatus,
}: {
  children: React.ReactNode;
  profileStatus: "syncing" | "ready" | "error" | "signed-out";
}) => (
  <>
    <SignedIn>
      {profileStatus === "ready" ? children : (
        <div className="min-h-screen flex items-center justify-center px-6 text-center">
          <p className="max-w-md text-sage-700 dark:text-sage-300">
            {profileStatus === "error"
              ? "We couldn't load your account profile. Please refresh and try again."
              : "Securing your account…"}
          </p>
        </div>
      )}
    </SignedIn>
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
  const { getToken } = useAuth();
  const [profileStatus, setProfileStatus] = useState<
    "syncing" | "ready" | "error" | "signed-out"
  >("syncing");
  const [showIntro, setShowIntro] = useState(() => {
    // Skip intro for returning users
    if (localStorage.getItem("nutriflow_visited")) return false;
    return true;
  });

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(async (config) => {
      if (config.url?.startsWith(API_BASE_URL)) {
        const token = await getToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

  // --- THE SYNC BRIDGE (Clerk to MongoDB) ---
  useEffect(() => {
    let cancelled = false;
    const syncUser = async () => {
      if (isSignedIn && user) {
        setProfileStatus("syncing");
        try {
          const dbUser = await syncClerkToDB({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || "NutriFlow User",
          });
          if (cancelled) return;
          localStorage.setItem("userInfo", JSON.stringify(dbUser));
          setProfileStatus("ready");
        } catch (error) {
          if (cancelled) return;
          console.error("Failed to sync user to database:", error);
          setProfileStatus("error");
        }
      } else if (isLoaded && !isSignedIn) {
        localStorage.removeItem("userInfo");
        setProfileStatus("signed-out");
      }
    };

    syncUser();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, user, isLoaded]);

  // --- ONESIGNAL INIT ---
  useEffect(() => {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    if (appId && !window.OneSignalInitialized) {
      window.OneSignalInitialized = true;
      OneSignal.init({ 
        appId, 
        allowLocalhostAsSecureOrigin: true 
      }).catch((e) => {
        console.error("OneSignal init error:", e);
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
          <Route path="/dashboard" element={<Protected profileStatus={profileStatus}><ErrorBoundary><Dashboard /></ErrorBoundary></Protected>} />
          <Route path="/vault" element={<Protected profileStatus={profileStatus}><ErrorBoundary><BioVault /></ErrorBoundary></Protected>} />
          <Route path="/profile" element={<Protected profileStatus={profileStatus}><ErrorBoundary><Profile /></ErrorBoundary></Protected>} />
          <Route path="/trackers" element={<Protected profileStatus={profileStatus}><ErrorBoundary><Trackers /></ErrorBoundary></Protected>} />
          <Route path="/routine" element={<Protected profileStatus={profileStatus}><ErrorBoundary><Routine /></ErrorBoundary></Protected>} />

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>

      {/* 2. FLOATING AI ASSISTANT */}
      {profileStatus === "ready" && isSignedIn && <NutriBot />}
    </Router>
  );
}

export default App;