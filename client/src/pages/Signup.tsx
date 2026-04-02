import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-xl border border-sage-100 dark:border-sage-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-sage-900 dark:text-white mb-2">Join NutriFlow</h1>
          <p className="text-gray-500 dark:text-gray-400">Start your personalized health journey</p>
        </div>

        <form className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Jane Doe" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="hello@nutriflow.com" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Create a password" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-sage-700 hover:bg-sage-800 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-sage-200 dark:shadow-none transition-all flex items-center justify-center gap-2">
            Create Account <ArrowRight size={20} />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-sage-700 dark:text-sage-300 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;