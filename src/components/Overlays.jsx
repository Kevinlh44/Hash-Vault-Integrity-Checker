import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export const CleanOverlay = ({ engines, onDismiss }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/90 backdrop-blur-md">
    <div className="relative">
      <div className="absolute inset-0 animate-ping opacity-20 rounded-full border-4 border-color-brand-cyan"></div>
      <div className="absolute inset-[-20px] animate-ping opacity-10 rounded-full border-2 border-color-brand-cyan delay-150"></div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-32 h-32 bg-color-brand-cyan/20 rounded-full flex items-center justify-center border border-color-brand-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)]"
      >
        <CheckCircle className="w-16 h-16 text-color-brand-cyan" />
      </motion.div>
    </div>
    <motion.h2 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-8 text-4xl font-bold text-color-brand-cyan tracking-widest"
    >
      THREAT-FREE
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-2 text-text-muted"
    >
      {engines.flagged} / {engines.total} engines flagged
    </motion.p>
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      onClick={onDismiss}
      className="mt-12 px-8 py-3 bg-color-brand-cyan/10 border border-color-brand-cyan text-color-brand-cyan transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 font-bold tracking-wider rounded uppercase"
    >
      Continue to Dashboard
    </motion.button>
  </div>
);

export const DangerOverlay = ({ engines, onDismiss }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/95 backdrop-blur-md">
    <div className="relative w-40 h-40 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-color-brand-rose rounded-xl animate-[spin_4s_linear_infinite] opacity-50"></div>
      <div className="absolute inset-4 border border-color-brand-rose rotate-45 rounded-xl animate-[spin_3s_linear_infinite_reverse] opacity-30"></div>
      <motion.div
        animate={{
          boxShadow: ['0 0 20px rgba(255,51,102,0.4)', '0 0 60px rgba(255,51,102,0.8)', '0 0 20px rgba(255,51,102,0.4)']
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative z-10 w-24 h-24 bg-color-brand-rose/20 rounded-full flex items-center justify-center border border-color-brand-rose"
      >
        <ShieldAlert className="w-12 h-12 text-color-brand-rose" />
      </motion.div>
    </div>
    
    <motion.h2
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-8 text-4xl font-bold text-color-brand-rose tracking-widest uppercase"
    >
      Threat Detected
    </motion.h2>
    <p className="mt-2 text-text-muted">
      {engines.flagged} / {engines.total} engines flagged
    </p>

    <div className="flex gap-2 mt-8 h-12 items-end">
      {[1,2,3,4,5,6,7].map(i => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: Math.random() * 40 + 10 }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            repeatType: 'reverse',
            delay: i * 0.1 
          }}
          className="w-2 bg-color-brand-rose"
        />
      ))}
    </div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      onClick={onDismiss}
      className="mt-12 px-8 py-3 bg-color-brand-rose/10 border border-color-brand-rose text-color-brand-rose transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,51,102,0.8)] hover:bg-color-brand-rose/20 hover:scale-105 active:scale-95 font-bold tracking-wider rounded uppercase"
    >
      ACKNOWLEDGE THREAT
    </motion.button>
  </div>
);

export const SuspiciousOverlay = ({ engines, onDismiss }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/95 backdrop-blur-md">
    <div className="relative">
      <div className="absolute inset-[-40px] border border-color-brand-amber rounded-full animate-[wiggle_0.5s_ease-in-out_infinite] opacity-50">
        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
        `}</style>
      </div>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="w-32 h-32 bg-color-brand-amber/20 rounded-full flex items-center justify-center border border-color-brand-amber shadow-[0_0_30px_rgba(255,176,0,0.4)]"
      >
        <AlertTriangle className="w-16 h-16 text-color-brand-amber" />
      </motion.div>
    </div>

    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-12 text-4xl font-bold text-color-brand-amber tracking-widest uppercase"
    >
      Suspicious File
    </motion.h2>
    <p className="mt-2 text-text-muted">
      {engines.flagged} / {engines.total} engines flagged
    </p>

    <div className="flex gap-4 mt-8">
      {[1,2,3,4,5].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-3 h-3 rounded-full bg-color-brand-amber shadow-[0_0_10px_rgba(255,176,0,0.8)]"
        />
      ))}
    </div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      onClick={onDismiss}
      className="mt-12 px-8 py-3 bg-color-brand-amber/10 border border-color-brand-amber text-color-brand-amber transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,176,0,0.6)] hover:bg-color-brand-amber/20 hover:scale-105 active:scale-95 font-bold tracking-wider rounded uppercase"
    >
      PROCEED WITH CAUTION
    </motion.button>
  </div>
);
