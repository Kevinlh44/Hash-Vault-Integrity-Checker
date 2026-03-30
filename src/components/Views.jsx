import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Database, Server, Globe, ExternalLink, Zap } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Helpers for Threat Generation
const THREAT_TYPES = ['MALWARE', 'PHISHING URL', 'RANSOMWARE', 'BOTNET C&C', 'SUSPICIOUS FILE', 'SQL INJECTION', 'ZERO-DAY EXPLOIT', 'CRYPTOJACKER'];
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM'];
const randomIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
const randomHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const ThreatIntelView = () => {
  const [threats, setThreats] = useState([
    { id: Date.now().toString(), type: 'RANSOMWARE', detail: randomHash(), severity: 'CRITICAL', time: 'Just now' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => {
        const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
        const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
        const detail = type.includes('FILE') || type.includes('RANSOMWARE') || type.includes('MALWARE') ? randomHash() : randomIP();
        
        const newThreat = {
          id: Date.now().toString(),
          type,
          detail,
          severity,
          time: 'Just now'
        };
        // Keep only top 10 recent threats
        return [newThreat, ...prev].slice(0, 10);
      });
    }, 3000); // 3 seconds spawn rate

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface/30 border border-border-subtle rounded-xl p-8 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] h-full overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Activity className="w-8 h-8 text-color-brand-rose animate-pulse" />
          <h2 className="text-2xl font-bold tracking-widest uppercase text-text-main">Global Threat Stream</h2>
        </div>
        <div className="flex items-center gap-2 border border-color-brand-rose/50 bg-color-brand-rose/10 px-3 py-1 rounded text-color-brand-rose animate-pulse">
           <Zap className="w-4 h-4" /> <span className="text-xs font-bold tracking-wider">LIVE RECORDING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 relative">
        <AnimatePresence>
          {threats.map((t) => (
            <motion.div 
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              key={t.id}
              className="flex items-center justify-between p-4 border border-border-subtle rounded bg-bg-deep/50 hover:bg-bg-deep transition-colors group relative overflow-hidden shrink-0"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-color-brand-rose to-color-brand-amber animate-pulse"></div>
              <div className="flex items-center gap-6 pl-2">
                <ShieldAlert className="w-5 h-5 text-color-brand-rose" />
                <div>
                  <p className="font-bold text-text-main tracking-wider">{t.type}</p>
                  <p className="text-xs text-text-muted font-mono mt-1">{t.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded 
                  ${t.severity === 'CRITICAL' ? 'bg-color-brand-rose/20 text-color-brand-rose border border-color-brand-rose/50' : 
                    t.severity === 'HIGH' ? 'bg-color-brand-amber/20 text-color-brand-amber border border-color-brand-amber/50' : 
                    'bg-color-brand-violet/20 text-color-brand-violet border border-color-brand-violet/50'}`}
                >
                  {t.severity}
                </span>
                <span className="text-xs text-text-muted w-16 text-right whitespace-nowrap">{new Date(parseInt(t.id)).toLocaleTimeString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const AnalyticsView = () => {
  const [dataPoints, setDataPoints] = useState([120, 190, 300, 500, 200, 300, 450]);
  const [blockedPoints, setBlockedPoints] = useState([12, 19, 30, 80, 20, 45, 60]);
  const [signatures, setSignatures] = useState(1204550);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate rolling charts
      setDataPoints(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * (600 - 100) + 100)];
        return next;
      });
      setBlockedPoints(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * (100 - 10) + 10)];
        return next;
      });
      
      // Simulate signatures incrementing
      setSignatures(prev => prev + Math.floor(Math.random() * 5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#9ca3af', font: {family: 'system-ui', size: 10} } } },
    scales: {
      y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
      x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
    },
    animation: {
        duration: 800,
        easing: 'linear'
    }
  };

  const lineData = {
    labels: ['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now'],
    datasets: [
      {
        label: 'Global Network Scans',
        data: dataPoints,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Active Threats Neutralized',
        data: blockedPoints,
        borderColor: '#ff3366',
        backgroundColor: 'rgba(255, 51, 102, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const barData = {
    labels: ['Trojan', 'Ransomware', 'Adware', 'Spyware', 'Rootkit', 'Worm'],
    datasets: [
      {
        label: 'Detected Malware Families (Live)',
        data: [65 + Math.random()*5, 59 + Math.random()*10, 80 + Math.random()*2, 81 + Math.random()*5, 56 + Math.random()*2, 55 + Math.random()*2],
        backgroundColor: 'rgba(176, 38, 255, 0.8)',
      }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 w-full h-[80vh]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-surface/30 border border-border-subtle rounded-xl p-6 flex flex-col justify-center items-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-color-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Database className="w-8 h-8 text-color-brand-cyan mb-2" />
          <h3 className="text-3xl font-mono text-text-main font-bold">{signatures.toLocaleString()}</h3>
          <p className="text-xs text-text-muted uppercase tracking-widest">Signatures Indexed</p>
        </div>
        <div className="bg-bg-surface/30 border border-border-subtle rounded-xl p-6 flex flex-col justify-center items-center gap-2 relative overflow-hidden">
          <Globe className="w-8 h-8 text-color-brand-violet mb-2" />
          <h3 className="text-3xl font-mono text-text-main font-bold">74</h3>
          <p className="text-xs text-text-muted uppercase tracking-widest">Global Engines Active</p>
        </div>
        <div className="bg-bg-surface/30 border border-border-subtle rounded-xl p-6 flex flex-col justify-center items-center gap-2 relative overflow-hidden">
          <Server className="w-8 h-8 text-color-brand-rose mb-2 animate-pulse" />
          <h3 className="text-3xl font-mono text-text-main font-bold">{(Math.random() * (4.5 - 2.8) + 2.8).toFixed(1)} ms</h3>
          <p className="text-xs text-text-muted uppercase tracking-widest">Live Node Latency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        <div className="bg-bg-surface/30 border border-border-subtle p-6 rounded-xl flex flex-col">
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-text-muted">Live Network Traffic Node</h4>
          <div className="flex-1 relative">
            <Line options={lineOptions} data={lineData} />
          </div>
        </div>
        <div className="bg-bg-surface/30 border border-border-subtle p-6 rounded-xl flex flex-col">
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-text-muted">Malware Genetic Distribution</h4>
          <div className="flex-1 relative">
            <Bar options={{ ...lineOptions, indexAxis: 'y' }} data={barData} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CyberNewsView = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Leveraging RSS2JSON API to fetch The Hacker News Feed without CORS boundaries
    const fetchNews = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
        const data = await res.json();
        if (data.status === 'ok') {
          setArticles(data.items.slice(0, 10));
        }
      } catch (e) {
        console.error("Failed to fetch news", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface/30 border border-border-subtle rounded-xl p-8 max-w-5xl mx-auto backdrop-blur-sm h-[80vh] flex flex-col"
    >
      <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-color-brand-cyan animate-[spin_15s_linear_infinite]" />
            <div>
              <h2 className="text-2xl font-bold tracking-widest uppercase text-text-main">Global Cyber Feed</h2>
              <p className="text-xs text-color-brand-cyan tracking-widest uppercase mt-1">Sourced from The Hacker News</p>
            </div>
        </div>
        {loading && <Activity className="w-5 h-5 text-text-muted animate-spin" />}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
        {loading ? (
           <div className="flex justify-center items-center h-full">
             <div className="text-color-brand-cyan animate-pulse tracking-widest uppercase text-sm font-bold">Decrypting Feed...</div>
           </div>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
             <motion.a 
               href={article.link}
               target="_blank"
               rel="noopener noreferrer"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               key={index}
               className="block bg-bg-deep/50 border border-border-subtle rounded-lg p-5 hover:bg-bg-deep hover:border-color-brand-cyan/50 transition-all group"
             >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-text-main group-hover:text-color-brand-cyan transition-colors mb-2 leading-relaxed">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                       {/* The Hacker news RSS desc contains tiny images, so we strip HTML basic tags for pure text preview */}
                      {article.description.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-text-muted group-hover:text-color-brand-cyan shrink-0 transition-colors" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs font-bold tracking-widest text-text-muted uppercase">
                   <span className="text-color-brand-violet">{article.author || 'THN Staff'}</span>
                   <span>|</span>
                   <span>{new Date(article.pubDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
                </div>
             </motion.a>
          ))
        ) : (
           <p className="text-text-muted text-center pt-10">Intelligence link severed. Unable to parse feed.</p>
        )}
      </div>
    </motion.div>
  );
};
