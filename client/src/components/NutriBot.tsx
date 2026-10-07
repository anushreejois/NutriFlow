/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, RefreshCcw } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";

const NutriBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 1. Initial State includes history for context-aware conversations
  const [messages, setMessages] = useState<any[]>([
    { role: "bot", content: "Hi! I'm NutriBot. I've synced with your bio-profile. Ask me anything about your biological rhythm, nutrition, or follow up on your plan!" }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Smooth scroll to latest message whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  // PHASE CALCULATION LOGIC (Passing this to Grok so it knows your current state)
  const getCurrentPhase = () => {
    if (!user.lastPeriodDate) return "General Balance";
    const start = new Date(user.lastPeriodDate);
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) % (user.cycleLength || 28);

    if (diffDays <= 5) return "Menstrual";
    if (diffDays <= 12) return "Follicular";
    if (diffDays <= 16) return "Ovulatory";
    return "Luteal";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const newUserMessage = { role: "user", content: input };

    // Maintain a local history to send to the backend
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/nutri-bot/chat`, {
        message: input,
        history: updatedHistory, // Sending the context for follow-up questions
        userData: {
          name: user.name || "User",
          gender: user.gender || "male",
          goal: user.goal || "maintain",
          dietary: user.dietary || "standard",
          currentPhaseName: getCurrentPhase()
        }
      });

      setMessages((prev) => [...prev, { role: "bot", content: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", content: "My biological sensors are flickering. Please check if the server is running!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "bot", content: "Context cleared. How can I help you fresh?" }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {/* TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, y: 40, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* HEADER */}
            <div className="p-6 bg-sage-900 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-sage-400 to-sage-200 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sparkles size={20} className="text-sage-900" />
                </div>
                <div>
                  <h3 className="font-black text-lg flex items-center gap-2">
                    NutriBot
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Grok 2.0</span>
                  </h3>
                  <p className="text-[10px] text-sage-300 font-bold uppercase tracking-widest">Bio-Intelligence</p>
                </div>
              </div>
              <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <RefreshCcw size={18} className="text-sage-400" />
              </button>
            </div>

            {/* MESSAGE AREA */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center mb-1 shrink-0">
                      <Bot size={16} className="text-sage-600" />
                    </div>
                  )}

                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-sage-900 text-white rounded-br-none shadow-sage-900/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                    }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-sage-500 flex items-center justify-center mb-1 text-[10px] font-bold text-white uppercase shrink-0">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-sage-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none border border-gray-200 dark:border-gray-700 flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* INPUT FIELD */}
            <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2 pl-5 rounded-[2rem] border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-sage-500 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2 dark:text-white placeholder:text-gray-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="p-3 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 rounded-full disabled:opacity-30 disabled:scale-100 transition-all shadow-lg"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutriBot;