import React from 'react';
import { motion } from 'framer-motion';

export const LoginBackground = () => {
  return (
    <>
      {/* Steel-themed animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-[#112240] dark:via-[#0A192F] dark:to-[#233554] animate-gradient opacity-80" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 dark:opacity-10" />
      
      {/* Steel reflection effect */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-1 bg-white/10 dark:bg-blue-400/20"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{
              x: '100%',
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>
    </>
  );
};