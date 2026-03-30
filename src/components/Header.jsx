import React, { useState, useEffect } from 'react';
import { Hexagon, Globe, Sun, Moon, ShieldCheck, Activity } from 'lucide-react';

export const Header = ({ isDarkMode, toggleTheme, activeView, setActiveView }) => {
  const [statusState, setStatusState] = useState('ready'); // 'ready', 'checking', 'verified'

  const runDiagnostic = () => {
    if (statusState !== 'ready') return;
    setStatusState('checking');
    setTimeout(() => {
      setStatusState('verified');
      setTimeout(() => setStatusState('ready'), 3000);
    }, 1500);
  };

  return (
  <header className="flex justify-between items-center py-6 border-b border-border-subtle mb-8">
    <div 
      className="flex items-center gap-4 cursor-pointer group/logo"
      onClick={() => window.location.reload()}
    >
      {/* New Animated Logo Box */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-color-brand-cyan/20 group-hover/logo:bg-color-brand-cyan/40 animate-pulse rounded-xl rotate-45 transition-colors">
          <div className="absolute inset-[2px] bg-bg-deep rounded-xl flex items-center justify-center rotate-[-45deg]">
             <Hexagon className="w-8 h-8 text-color-brand-cyan animate-[spin_10s_linear_infinite]" />
             <Globe className="w-4 h-4 text-color-brand-violet absolute" />
          </div>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-[0.1em] text-color-brand-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] group-hover/logo:text-white transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          HASHVAULT
        </h1>
        <p className="text-xs text-text-muted tracking-widest uppercase mt-1">
          Advanced Threat Detection Platform
        </p>
      </div>
    </div>

    {/* Center Nav Links to fill vacant space */}
    <nav className="hidden md:flex items-center justify-center gap-8 flex-1 px-8">
      {['Dashboard', 'Threat Intelligence', 'Global Analytics', 'Cyber News'].map((item, idx) => (
        <button 
          key={idx} 
          onClick={() => setActiveView(item)}
          className={`text-xs font-bold uppercase tracking-widest transition-colors relative group
            ${activeView === item ? 'text-color-brand-cyan' : 'text-text-muted hover:text-color-brand-cyan'}
          `}
        >
          {item}
          <span className={`absolute -bottom-2 h-0.5 bg-color-brand-cyan transition-all duration-300 
            ${activeView === item ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}
          `}></span>
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-6">
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-color-brand-amber" />
        ) : (
          <Moon className="w-5 h-5 text-color-brand-violet" />
        )}
      </button>

      {/* Status Badge */}
      <button 
        onClick={runDiagnostic}
        disabled={statusState === 'checking'}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 relative overflow-hidden group
          ${statusState === 'ready' ? 'border-color-brand-green/30 bg-color-brand-green/10 hover:bg-color-brand-green/20' : 
            statusState === 'checking' ? 'border-color-brand-cyan/30 bg-color-brand-cyan/10 cursor-wait' : 
            'border-color-brand-amber/30 bg-color-brand-amber/10'}
        `}
      >
        {statusState === 'checking' && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        )}
        
        <div className={`w-2 h-2 rounded-full 
          ${statusState === 'ready' ? 'bg-color-brand-green animate-ping' : 
            statusState === 'checking' ? 'bg-color-brand-cyan animate-pulse' : 
            'bg-color-brand-amber animate-bounce'}
        `}></div>
        
        <span className={`text-xs font-bold tracking-wider uppercase flex items-center gap-2
          ${statusState === 'ready' ? 'text-color-brand-green' : 
            statusState === 'checking' ? 'text-color-brand-cyan' : 
            'text-color-brand-amber text-white'}
        `}>
          {statusState === 'ready' ? 'Live Scan Ready' : 
           statusState === 'checking' ? 'Diagnostic Run...' : 
           'Scanner API Online'}
          
          {statusState === 'verified' && <ShieldCheck className="w-3 h-3" />}
        </span>
      </button>
    </div>
  </header>
);
};
