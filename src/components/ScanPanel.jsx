import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, Check, Copy, Link as LinkIcon, Globe } from 'lucide-react';

export const ScanPanel = ({ onScanFile, onScanUrl, isScanning, scanResult }) => {
  const [mode, setMode] = useState('file'); // 'file' or 'url'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      onScanFile(acceptedFiles[0]);
    }
  }, [onScanFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false
  });

  const handleInitiateScan = () => {
    if (mode === 'file' && file && !isScanning) {
      onScanFile(file);
    } else if (mode === 'url' && url && !isScanning) {
      onScanUrl(url);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Switcher */}
      <div className="flex rounded-lg overflow-hidden border border-border-subtle bg-bg-surface/30 p-1 backdrop-blur-sm">
        <button
          onClick={() => { setMode('file'); setScanResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold tracking-widest text-xs uppercase transition-colors
            ${mode === 'file' ? 'bg-color-brand-violet/20 text-color-brand-violet shadow-[0_0_10px_rgba(176,38,255,0.2)]' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <FileIcon className="w-4 h-4" /> File Scan
        </button>
        <button
          onClick={() => { setMode('url'); setScanResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold tracking-widest text-xs uppercase transition-colors
            ${mode === 'url' ? 'bg-color-brand-cyan/20 text-color-brand-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <Globe className="w-4 h-4" /> URL Scan
        </button>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {mode === 'file' ? (
            <motion.div 
              key="file"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden
                  ${isDragActive ? 'border-color-brand-cyan bg-color-brand-cyan/10' : 'border-border-subtle bg-bg-surface/30 hover:bg-bg-surface/50 hover:border-color-brand-violet/50'}
                `}
              >
                <input {...getInputProps()} />
                {isDragActive && (
                  <div className="absolute inset-0 bg-color-brand-cyan/10 animate-pulse"></div>
                )}
                <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-color-brand-cyan' : 'text-text-muted'}`} />
                <p className="text-lg font-medium tracking-wide">
                  {isDragActive ? "DROP SEQUENCE INITIATED..." : "DRAG & DROP FILE HERE"}
                </p>
                <p className="text-sm text-text-muted mt-2 uppercase tracking-widest">
                  or click to select from local storage
                </p>
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-bg-surface/50 border border-border-subtle rounded-lg p-4 backdrop-blur-sm mt-4">
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-6 h-6 text-color-brand-violet" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="url"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 bg-bg-surface/30 border border-border-subtle rounded-xl p-8">
                <p className="text-sm text-center text-text-muted tracking-wide animate-pulse mb-2">
                  ENTER A SUSPICIOUS URL TO ANALYZE
                </p>
                <div className="relative group">
                  <div className="absolute inset-0 bg-color-brand-cyan/20 rounded-lg blur group-focus-within:bg-color-brand-cyan/40 transition-all duration-500"></div>
                  <div className="relative flex items-center bg-bg-deep border border-border-subtle group-focus-within:border-color-brand-cyan rounded-lg overflow-hidden">
                    <div className="pl-4 text-text-muted">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-transparent border-none outline-none py-4 px-4 text-text-main placeholder-text-muted"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shared Progress Bar */}
      {isScanning && (
        <div className="mt-2 bg-bg-surface/50 border border-border-subtle rounded-lg p-4 backdrop-blur-sm">
          <div className="flex justify-between text-xs mb-1 text-color-brand-cyan uppercase tracking-widest">
            <span>ANALYZING THREAT INTELLIGENCE...</span>
            <span className="animate-pulse">CONNECTING TO DB</span>
          </div>
          <div className="h-2 bg-bg-deep rounded-full overflow-hidden mt-2">
            <motion.div 
              className={`h-full bg-gradient-to-r ${mode === 'file' ? 'from-color-brand-violet via-color-brand-cyan' : 'from-color-brand-cyan via-color-brand-amber'} to-color-brand-pink`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleInitiateScan}
        disabled={(mode === 'file' && !file) || (mode === 'url' && !url) || isScanning}
        className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all duration-300
          ${((mode === 'file' && !file) || (mode === 'url' && !url) || isScanning) 
            ? 'bg-bg-surface text-text-muted cursor-not-allowed border border-border-subtle'
            : mode === 'file' 
              ? 'bg-color-brand-violet/10 text-color-brand-violet border border-color-brand-violet hover:bg-color-brand-violet/30 hover:shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-color-brand-cyan/10 text-color-brand-cyan border border-color-brand-cyan hover:bg-color-brand-cyan/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-[0.98]'}
        `}
      >
        {isScanning ? 'Scan in Progress...' : 'Initiate Scan'}
      </button>

      {/* Scan Outputs */}
      {scanResult && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Show hashes only for files */}
          {mode === 'file' && scanResult.hashes && ['MD5', 'SHA1', 'SHA256'].map((type, index) => (
            <motion.div 
              key={type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-surface/30 border border-border-subtle rounded-lg p-3 relative group"
            >
              <p className="text-xs text-text-muted font-bold tracking-wider mb-1">{type}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm text-color-brand-cyan break-all">
                  {scanResult.hashes[type]}
                </code>
                <button 
                  onClick={() => copyToClipboard(scanResult.hashes[type], type)}
                  className="p-1.5 rounded bg-bg-deep text-text-muted hover:text-color-brand-cyan transition-colors"
                  title="Copy to clipboard"
                >
                  {copied === type ? <Check className="w-4 h-4 text-color-brand-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: mode==='file' ? 0.4 : 0 }}
            className="mt-2 flex justify-center"
          >
            <div className={`px-6 py-2 rounded-full border text-sm font-bold tracking-widest uppercase
              ${scanResult.virustotal?.verdict === 'clean' ? 'border-color-brand-cyan text-color-brand-cyan bg-color-brand-cyan/10' :
                scanResult.virustotal?.verdict === 'suspicious' ? 'border-color-brand-amber text-color-brand-amber bg-color-brand-amber/10' :
                scanResult.virustotal?.verdict === 'malicious' ? 'border-color-brand-rose text-color-brand-rose bg-color-brand-rose/10' :
                'border-text-muted text-text-muted bg-bg-surface/50'}
            `}>
              Verdict: {scanResult.virustotal?.verdict || 'Unknown'}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
