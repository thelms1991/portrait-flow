import { ShotSection, WeddingData } from '@/types/app';

export interface PrintablePdfOptions {
  weddingData: WeddingData;
  sections: ShotSection[];
  title?: string;
}

export function generatePrintablePdf(options: PrintablePdfOptions): string {
  const { weddingData, sections, title = 'Wedding Portrait Shot List' } = options;

  const brideFullName = `${weddingData.brideFirstName} ${weddingData.brideLastName}`;
  const groomFullName = `${weddingData.groomFirstName} ${weddingData.groomLastName}`;
  const formattedDate = new Date(weddingData.weddingDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build sections HTML
  const sectionsHtml = sections
    .map((section) => {
      const shotsHtml = section.shots
        .map((shot) => {
          return `
        <div class="shot-row">
          <div class="checkbox">☐</div>
          <div class="shot-text">${escapeHtml(shot.description)}</div>
        </div>
      `;
        })
        .join('');

      return `
      <div class="section">
        <h2 class="section-title">${escapeHtml(section.title)}</h2>
        <div class="shots-container">
          ${shotsHtml}
        </div>
      </div>
    `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: 8.5in 11in;
          margin: 0.5in;
        }

        @media print {
          body {
            background: white;
          }
          .page-break {
            page-break-after: always;
          }
        }

        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #faf6f0;
          color: #2a2420;
          line-height: 1.6;
        }

        .container {
          max-width: 8.5in;
          background: white;
          margin: 0 auto;
          padding: 0.5in;
        }

        .header {
          text-align: center;
          border-bottom: 3px solid #c4837a;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .header h1 {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 32px;
          font-weight: 300;
          color: #2a2420;
          margin-bottom: 15px;
        }

        .wedding-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .info-row {
          display: flex;
          gap: 8px;
        }

        .info-label {
          font-weight: 600;
          color: #c4837a;
          min-width: 60px;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
        }

        .info-value {
          color: #2a2420;
          flex: 1;
          word-break: break-word;
        }

        .section {
          margin-bottom: 22px;
          break-inside: avoid;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #c4837a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f0eae4;
        }

        .shots-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shot-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 12px;
          padding: 6px 0;
          border-bottom: 1px solid #f5f0eb;
          line-height: 1.5;
        }

        .shot-row:last-child {
          border-bottom: none;
        }

        .checkbox {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border: 2px solid #c9a96e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #c9a96e;
          margin-top: 2px;
        }

        .shot-text {
          flex: 1;
          color: #2a2420;
          font-family: 'Space Grotesk', monospace;
          word-break: break-word;
        }

        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #f0eae4;
          text-align: center;
          font-size: 10px;
          color: #9b8d82;
        }

        @media print {
          .container {
            max-width: 100%;
            padding: 0.5in;
          }
          body {
            background: white;
            padding: 0;
          }
        }

        /* Print-specific optimizations */
        @media print {
          .shot-row {
            page-break-inside: avoid;
          }
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${escapeHtml(title)}</h1>
          
          <div class="wedding-info">
            <div class="info-row">
              <span class="info-label">Bride</span>
              <span class="info-value">${escapeHtml(brideFullName)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Groom</span>
              <span class="info-value">${escapeHtml(groomFullName)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date</span>
              <span class="info-value">${escapeHtml(formattedDate)}</span>
            </div>
            ${weddingData.ceremonyLocation ? `
            <div class="info-row">
              <span class="info-label">Venue</span>
              <span class="info-value">${escapeHtml(weddingData.ceremonyLocation)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        ${sectionsHtml}

        <div class="footer">
          <p>This shot list was generated using the Wedding Portrait Shotlist Builder</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export function downloadPrintablePdf(html: string, filename: string = 'wedding-portrait-shotlist.html'): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printPrintablePdf(html: string): void {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function generatePdfDataUrl(html: string): string {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
}
