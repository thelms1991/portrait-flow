import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Printer, Smartphone, Clock, Download } from 'lucide-react';
import { ShotSection, WeddingData } from '@/types/app';
import {
  generatePrintablePdf,
  downloadPrintablePdf,
  printPrintablePdf,
} from '@/lib/printablePdfExport';

interface ExportPanelProps {
  sections: ShotSection[];
  weddingData?: WeddingData;
  onClose: () => void;
}

function exportAsText(sections: ShotSection[]): string {
  const lines: string[] = ['WEDDING PORTRAIT SHOT LIST', '='.repeat(40), ''];
  sections.forEach((s) => {
    lines.push(`\n${s.title.toUpperCase()}`);
    lines.push('-'.repeat(s.title.length));
    s.shots.forEach((sh, i) => {
      lines.push(`${i + 1}. ${sh.description}`);
    });
  });
  return lines.join('\n');
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPrint(sections: ShotSection[]) {
  const html = `
    <html>
    <head>
      <title>Wedding Shot List</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; color: #2A2420; }
        h1 { font-size: 28px; font-style: italic; font-weight: 300; border-bottom: 2px solid #C4837A; padding-bottom: 8px; }
        h2 { font-size: 16px; font-weight: 600; margin-top: 28px; color: #C4837A; letter-spacing: 0.05em; text-transform: uppercase; }
        p { font-family: 'Space Grotesk', monospace; font-size: 13px; margin: 4px 0; padding: 5px 0; border-bottom: 1px solid #F0EAE4; }
        .count { font-size: 11px; color: #C9A96E; margin-left: 8px; }
      </style>
    </head>
    <body>
      <h1>Wedding Portrait Shot List</h1>
      ${sections.map((s) => `
        <h2>${s.title} <span class="count">${s.shots.length} shots</span></h2>
        ${s.shots.map((sh, i) => `<p>${i + 1}. ${sh.description}</p>`).join('')}
      `).join('')}
    </body>
    </html>
  `;
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    w.print();
  }
}

function exportChecklist(sections: ShotSection[]) {
  const html = `
    <html>
    <head>
      <title>Wedding Shot Checklist</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: system-ui, sans-serif; background: #2A2420; color: #FAF6F0; padding: 20px; max-width: 500px; margin: 0 auto; }
        h1 { font-size: 22px; font-style: italic; font-weight: 300; color: #C9A96E; }
        h2 { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A96E; opacity: 0.6; margin-top: 24px; }
        label { display: flex; align-items: center; gap: 14px; padding: 12px; background: #332D29; border-radius: 12px; margin: 6px 0; font-size: 14px; cursor: pointer; }
        input[type=checkbox] { width: 22px; height: 22px; accent-color: #C4837A; }
      </style>
    </head>
    <body>
      <h1>Shot Checklist</h1>
      ${sections.map((s) => `
        <h2>${s.title}</h2>
        ${s.shots.map((sh) => `<label><input type="checkbox" /> ${sh.description}</label>`).join('')}
      `).join('')}
    </body>
    </html>
  `;
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

const EXPORT_OPTIONS = [
  {
    id: 'printable-pdf',
    icon: Download,
    title: 'Printable PDF',
    desc: 'Professional portrait list with checkboxes',
    color: '#C4837A',
    action: (sections: ShotSection[], weddingData?: WeddingData) => {
      if (weddingData) {
        const html = generatePrintablePdf({
          weddingData,
          sections,
          title: 'Wedding Portrait Shot List',
        });
        const filename = `wedding-portrait-shotlist-${new Date().toISOString().split('T')[0]}.html`;
        downloadPrintablePdf(html, filename);
      }
    },
  },
  {
    id: 'pdf',
    icon: FileText,
    title: 'PDF Export',
    desc: 'Print-ready formatted document',
    color: '#C4837A',
    action: (sections: ShotSection[]) => exportPrint(sections),
  },
  {
    id: 'print',
    icon: Printer,
    title: 'Printable List',
    desc: 'Clean portrait list for printing',
    color: '#C9A96E',
    action: (sections: ShotSection[]) => exportPrint(sections),
  },
  {
    id: 'checklist',
    icon: Smartphone,
    title: 'Mobile Checklist',
    desc: 'On-the-day phone-friendly view',
    color: '#8B9DB5',
    action: (sections: ShotSection[]) => exportChecklist(sections),
  },
  {
    id: 'text',
    icon: Clock,
    title: 'Text Export',
    desc: 'Plain text file download',
    color: '#B89BB0',
    action: (sections: ShotSection[]) =>
      downloadText(exportAsText(sections), 'shot-list.txt'),
  },
];

export default function ExportPanel({ sections, weddingData, onClose }: ExportPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(42,36,32,0.6)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <motion.div
          className="relative w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-6 z-10"
          style={{ backgroundColor: '#FAF6F0' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Handle */}
          <div className="w-10 h-1 rounded-full mx-auto mb-6 md:hidden" style={{ backgroundColor: '#D5C8BF' }} />

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-2xl italic font-light" style={{ color: '#2A2420' }}>
              Export Shot List
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
            >
              <X size={16} style={{ color: '#2A2420', opacity: 0.5 }} />
            </button>
          </div>

          <div className="space-y-3">
            {EXPORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              // Hide printable-pdf if no wedding data
              if (opt.id === 'printable-pdf' && !weddingData) {
                return null;
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    opt.action(sections, weddingData);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ borderColor: '#E8DDD6', backgroundColor: '#FFFFFF' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${opt.color}15` }}
                  >
                    <Icon size={18} style={{ color: opt.color }} />
                  </div>
                  <div>
                    <p className="font-jakarta text-sm font-semibold" style={{ color: '#2A2420' }}>
                      {opt.title}
                    </p>
                    <p className="font-jakarta text-xs" style={{ color: '#2A2420', opacity: 0.45 }}>
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="font-jakarta text-xs text-center mt-5" style={{ color: '#2A2420', opacity: 0.35 }}>
            {sections.reduce((s, sec) => s + sec.shots.length, 0)} shots across {sections.length} sections
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
