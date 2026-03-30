import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import { Download, Link as LinkIcon, File } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const HistoryPanel = ({ history }) => {
  const chartData = {
    labels: ['Verified Clean', 'Suspicious', 'Malicious'],
    datasets: [
      {
        data: [
          history.filter(h => h.verdict === 'clean').length,
          history.filter(h => h.verdict === 'suspicious').length,
          history.filter(h => h.verdict === 'malicious').length
        ],
        backgroundColor: [
          'rgba(0, 240, 255, 0.8)',
          'rgba(255, 176, 0, 0.8)',
          'rgba(255, 51, 102, 0.8)'
        ],
        borderColor: [
          '#00f0ff',
          '#ffb000',
          '#ff3366'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9ca3af',
          font: { family: 'system-ui', size: 12 }
        }
      }
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("HashVault Scan History Report", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

    let y = 45;
    history.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setTextColor(40);
      doc.setFontSize(12);
      doc.text(`${index + 1}. [${item.type?.toUpperCase() || 'FILE'}] ${item.filename}`, 14, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(100);
      if (item.hashes) {
        doc.text(`SHA256: ${item.hashes.SHA256}`, 20, y);
        y += 6;
      }
      doc.text(`Verdict: ${item.verdict.toUpperCase()} | Date: ${new Date(item.timestamp).toLocaleString()}`, 20, y);
      y += 10;
    });

    doc.save('hashvault_scan_report.pdf');
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface/30 border border-border-subtle rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold tracking-widest uppercase">Scan History</h3>
        <button
          onClick={exportPDF}
          disabled={history.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 bg-bg-deep border border-border-subtle rounded text-sm text-text-muted hover:text-color-brand-cyan hover:border-color-brand-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          EXPORT PDF
        </button>
      </div>

      <div className="flex-1 overflow-hidden min-h-[300px]">
        <table className="w-full text-left text-sm">
          <thead className="text-text-muted border-b border-border-subtle uppercase tracking-wider text-xs bg-bg-deep/50">
            <tr>
              <th className="pb-3 pt-3 pl-4 font-medium">Target</th>
              <th className="pb-3 pt-3 font-medium">Fingerprint</th>
              <th className="pb-3 pt-3 font-medium">Time</th>
              <th className="pb-3 pt-3 pr-4 font-medium text-right">Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50 relative">
            <AnimatePresence initial={false}>
              {history.map((scan) => (
                <motion.tr
                  key={scan.id || scan.timestamp}
                  initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(0, 240, 255, 0.2)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group hover:bg-bg-surface/50 transition-colors"
                >
                  <td className="py-3 pl-4 max-w-[160px] truncate text-text-main flex items-center gap-2" title={scan.filename}>
                    {scan.type === 'url' ? <LinkIcon className="w-3 h-3 text-color-brand-cyan shrink-0"/> : <File className="w-3 h-3 text-color-brand-violet shrink-0"/>}
                    <span className="truncate">{scan.filename}</span>
                  </td>
                  <td className="py-3 font-mono text-xs text-text-muted max-w-[100px] truncate">
                    {scan.type === 'url' ? (
                      <span className="text-color-brand-amber">URL Address</span>
                    ) : (
                      <span className="text-color-brand-cyan">{scan.hashes?.SHA256?.substring(0, 8)}...</span>
                    )}
                  </td>
                  <td className="py-3 text-xs text-text-muted">
                    {new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase
                      ${scan.verdict === 'clean' ? 'bg-color-brand-cyan/20 text-color-brand-cyan' :
                        scan.verdict === 'suspicious' ? 'bg-color-brand-amber/20 text-color-brand-amber' :
                        scan.verdict === 'malicious' ? 'bg-color-brand-rose/20 text-color-brand-rose' :
                        'bg-bg-deep text-text-muted'}
                    `}>
                      {scan.verdict}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-muted italic">
                  No scans performed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <h4 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-4">
          Threat Distribution
        </h4>
        <div className="h-48 relative">
          {history.length > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-border-subtle rounded-full mx-auto w-40 h-40">
              <span className="text-xs text-text-muted">NO DATA</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
