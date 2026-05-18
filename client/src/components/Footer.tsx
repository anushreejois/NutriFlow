/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { Heart, Github, Linkedin, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-sage-950 dark:bg-gray-950 text-white overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-sage-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 pt-20 pb-10">
        {/* TOP SECTION: Brand + Links */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🌿</span>
              <span className="text-2xl font-black tracking-tighter">NutriFlow</span>
            </Link>
            <p className="text-sage-400 text-sm leading-relaxed font-medium">
              AI-powered nutrition and wellness platform that syncs with your biological rhythm.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sage-500 mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link></li>
              <li><Link to="/vault" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Bio-Vault</Link></li>
              <li><Link to="/trackers" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Trackers</Link></li>
              <li><Link to="/routine" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Routine</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sage-500 mb-5">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/library" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Health Library</Link></li>
              <li><Link to="/about" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link to="/profile" className="text-sage-300 hover:text-white transition-colors text-sm font-medium">Profile</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER CTA */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sage-500 mb-5">Stay Updated</h4>
            <p className="text-sage-400 text-sm mb-4 font-medium">Get the latest wellness tips and platform updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-sage-800 rounded-xl text-sm text-white placeholder:text-sage-600 outline-none focus:border-sage-500 transition-colors"
              />
              <button className="p-3 bg-sage-600 hover:bg-sage-500 rounded-xl transition-colors shadow-lg shadow-sage-900/50">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-[1px] bg-sage-800/50 mb-8" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sage-500 text-sm font-medium">
            <span>© {currentYear} NutriFlow AI.</span>
            <span className="hidden md:inline">·</span>
            <span className="flex items-center gap-1">
              Built with <Heart size={12} className="text-rose-500 fill-current" /> by Anushree
            </span>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-sage-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-sage-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:hello@nutriflow.ai" className="p-2 text-sage-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
