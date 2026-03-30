import React from 'react';
import { Shield, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

const StatCard = ({ title, count, color, borderColor, Icon }) => (
  <div className="relative group bg-bg-surface/50 border border-border-subtle p-5 rounded-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-[3px]">
    <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-lg bg-gradient-to-r ${borderColor}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-muted text-sm font-medium tracking-wider uppercase">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{count}</p>
      </div>
      <div className={`p-3 rounded-md bg-bg-surface bg-opacity-50 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export const StatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Scanned" 
        count={stats.total} 
        color="text-color-brand-violet" 
        borderColor="from-color-brand-violet/0 via-color-brand-violet to-color-brand-violet/0"
        Icon={Activity}
      />
      <StatCard 
        title="Verified Clean" 
        count={stats.clean} 
        color="text-color-brand-cyan" 
        borderColor="from-color-brand-cyan/0 via-color-brand-cyan to-color-brand-cyan/0"
        Icon={Shield}
      />
      <StatCard 
        title="Suspicious" 
        count={stats.suspicious} 
        color="text-color-brand-amber" 
        borderColor="from-color-brand-amber/0 via-color-brand-amber to-color-brand-amber/0"
        Icon={AlertTriangle}
      />
      <StatCard 
        title="Malicious" 
        count={stats.malicious} 
        color="text-color-brand-rose" 
        borderColor="from-color-brand-rose/0 via-color-brand-rose to-color-brand-rose/0"
        Icon={ShieldAlert}
      />
    </div>
  );
};
