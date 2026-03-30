import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { ScanPanel } from './components/ScanPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { CleanOverlay, DangerOverlay, SuspiciousOverlay } from './components/Overlays';
import { scanFile, scanUrl } from './services/api';
import { ThreatIntelView, AnalyticsView, CyberNewsView } from './components/Views';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('hashvault_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [overlayState, setOverlayState] = useState(null);
  const [flashColor, setFlashColor] = useState(null);
  const [toastError, setToastError] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('hashvault_history', JSON.stringify(history));
  }, [history]);

  const stats = {
    total: history.length,
    clean: history.filter(h => h.verdict === 'clean').length,
    suspicious: history.filter(h => h.verdict === 'suspicious').length,
    malicious: history.filter(h => h.verdict === 'malicious').length,
  };

  const handleScanEngine = async (type, payload) => {
    setIsScanning(true);
    setScanResult(null);
    setToastError(null);
    try {
      const result = type === 'file' ? await scanFile(payload) : await scanUrl(payload);
      
      if (result.error) {
        setToastError(result.error || 'Failed to scan');
        return;
      }

      const verdict = result.virustotal?.verdict || 'unknown';
      setScanResult(result);
      
      const newScan = {
        id: Date.now().toString(),
        type: type,
        filename: type === 'file' ? (result.filename || payload.name) : payload, // Store URL in filename if it's a URL
        hashes: result.hashes || null,
        verdict: verdict,
        timestamp: Date.now()
      };

      setHistory(prev => [newScan, ...prev].slice(0, 100)); // Keep last 100 scans

      // Trigger flash effect
      setTimeout(() => {
        if (verdict === 'clean') setFlashColor('rgba(0,240,255,0.3)');
        else if (verdict === 'malicious') setFlashColor('rgba(255,51,102,0.3)');
        else if (verdict === 'suspicious') setFlashColor('rgba(255,176,0,0.3)');
        
        setTimeout(() => {
          setFlashColor(null);
          // Open overlay
          setOverlayState({
            verdict: verdict,
            engines: {
              flagged: result.virustotal?.flagged_count || 0,
              total: result.virustotal?.total_engines || 0
            }
          });
        }, 150);
      }, 350);

    } catch (error) {
      setToastError(error.message || 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanFile = (file) => handleScanEngine('file', file);
  const handleScanUrl = (url) => handleScanEngine('url', url);

  return (
    <div className="min-h-screen relative font-sans text-text-main overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating Blur Orbs */}
      <div className="fixed absolute top-[-100px] left-[-100px] w-96 h-96 bg-color-brand-violet/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="fixed absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-color-brand-cyan/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="fixed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-color-brand-pink/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 min-h-screen flex flex-col">
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        {activeView === 'Dashboard' && (
          <>
            <StatCards stats={stats} />
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-5">
                <ScanPanel 
                  onScanFile={handleScanFile} 
                  onScanUrl={handleScanUrl}
                  isScanning={isScanning} 
                  scanResult={scanResult} 
                />
              </div>
              <div className="lg:col-span-7">
                <HistoryPanel history={history} />
              </div>
            </div>
          </>
        )}

        {activeView === 'Threat Intelligence' && <ThreatIntelView />}
        {activeView === 'Global Analytics' && <AnalyticsView />}
        {activeView === 'Cyber News' && <CyberNewsView />}
      </div>

      {/* Screen Flash */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{ backgroundColor: flashColor }}
          />
        )}
      </AnimatePresence>

      {/* Result Overlays */}
      <AnimatePresence>
        {overlayState && overlayState.verdict === 'clean' && (
          <CleanOverlay engines={overlayState.engines} onDismiss={() => setOverlayState(null)} />
        )}
        {overlayState && overlayState.verdict === 'malicious' && (
          <DangerOverlay engines={overlayState.engines} onDismiss={() => setOverlayState(null)} />
        )}
        {overlayState && overlayState.verdict === 'suspicious' && (
          <SuspiciousOverlay engines={overlayState.engines} onDismiss={() => setOverlayState(null)} />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastError && (
          <motion.div
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 32, opacity: 1 }}
            exit={{ bottom: -100, opacity: 0 }}
            className="fixed right-8 z-[70] bg-color-brand-rose/10 border border-color-brand-rose text-color-brand-rose px-6 py-4 rounded-lg shadow-lg flex items-center"
          >
            <span>{toastError}</span>
            <button 
              onClick={() => setToastError(null)}
              className="ml-4 text-color-brand-rose hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
