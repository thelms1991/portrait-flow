import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Eye } from 'lucide-react';
import { ShotSection, WeddingData } from '@/types/app';
import {
  generatePrintablePdf,
  downloadPrintablePdf,
  printPrintablePdf,
} from '@/lib/printablePdfExport';

interface PrintablePdfExportProps {
  weddingData: WeddingData;
  sections: ShotSection[];
}

export default function PrintablePdfExport({
  weddingData,
  sections,
}: PrintablePdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    try {
      const html = generatePrintablePdf({
        weddingData,
        sections,
        title: 'Wedding Portrait Shot List',
      });

      // Store for later use
      sessionStorage.setItem('printablePdfHtml', html);
      setIsGenerating(false);
      return html;
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      return null;
    }
  };

  const handleDownload = async () => {
    const html = handleGeneratePdf();
    if (html) {
      const filename = `wedding-portrait-shotlist-${new Date().toISOString().split('T')[0]}.html`;
      downloadPrintablePdf(html, filename);
    }
  };

  const handlePrint = async () => {
    const html = handleGeneratePdf();
    if (html) {
      printPrintablePdf(html);
    }
  };

  const handlePreview = async () => {
    const html = handleGeneratePdf();
    if (html) {
      const previewWindow = window.open('', '', 'height=800,width=1000');
      if (previewWindow) {
        previewWindow.document.write(html);
        previewWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-3">
      <motion.button
        onClick={handleDownload}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-dusty-rose text-cream rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ backgroundColor: '#C4837A', color: '#FAF6F0' }}
      >
        <Download size={18} />
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </motion.button>

      <motion.button
        onClick={handlePrint}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-gold text-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ backgroundColor: '#C9A96E', color: '#2A2420' }}
      >
        <Printer size={18} />
        Print
      </motion.button>

      <motion.button
        onClick={handlePreview}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-gray-200 text-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Eye size={18} />
        Preview
      </motion.button>
    </div>
  );
}
