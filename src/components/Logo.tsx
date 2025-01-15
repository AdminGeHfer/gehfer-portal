import { motion } from 'framer-motion';
import * as React from "react";

const Logo = () => {
  return (
    <motion.div 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center justify-center gap-2"
    >
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-full opacity-20 blur-xl" />
        <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-white">T4</span>
        </div>
      </div>
      <span className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        The Four
      </span>
    </motion.div>
  );
};

export default Logo;