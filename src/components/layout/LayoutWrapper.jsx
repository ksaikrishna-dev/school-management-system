import React from 'react';
import { Topbar } from './Topbar';
import { motion } from 'framer-motion';

export const LayoutWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Topbar />
      <main className="flex-1 w-full p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1400px] mx-auto h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
