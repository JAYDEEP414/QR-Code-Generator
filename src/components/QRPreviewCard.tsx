import React, { useState } from 'react';
import { Download, Copy, Check, RefreshCw, FileCode, ExternalLink, Printer, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeCustomization } from '../types';
import {
  formatDisplayUrl,
  getSanitizedFileName,
  downloadPngFromDataUrl,
  downloadSvgFromString,
  copyToClipboard,
} from '../utils/qrUtils';

interface QRPreviewCardProps {
  url: string;
  pngDataUrl: string | null;
  svgString: string | null;
  customization: QRCodeCustomization;
  onReset: () => void;
}

export const QRPreviewCard: React.FC<QRPreviewCardProps> = ({
  url,
  pngDataUrl,
  svgString,
  customization,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const displayUrl = formatDisplayUrl(url, 42);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setCopyFeedback('Link copied!');
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback(null);
      }, 2000);
    } else {
      setCopyFeedback('Unable to copy the link. Please copy it manually.');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const handleDownloadPng = () => {
    if (!pngDataUrl) return;
    setDownloadingFormat('PNG');
    try {
      const filename = getSanitizedFileName(url, 'png');
      downloadPngFromDataUrl(pngDataUrl, filename);
    } catch {
      alert("Unable to download the QR code. Please try again.");
    } finally {
      setTimeout(() => setDownloadingFormat(null), 600);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    setDownloadingFormat('SVG');
    try {
      const filename = getSanitizedFileName(url, 'svg');
      downloadSvgFromString(svgString, filename);
    } catch {
      alert("Unable to download the QR code. Please try again.");
    } finally {
      setTimeout(() => setDownloadingFormat(null), 600);
    }
  };

  const handlePrint = () => {
    if (!pngDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code - ${url}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
                font-family: sans-serif;
                margin: 0;
                padding: 20px;
              }
              img {
                max-width: 400px;
                width: 100%;
                height: auto;
              }
              p {
                margin-top: 16px;
                font-size: 14px;
                color: #555;
                word-break: break-all;
                text-align: center;
                max-width: 500px;
              }
            </style>
          </head>
          <body>
            <img src="${pngDataUrl}" alt="QR Code" />
            <p>${url}</p>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <motion.div
      id="qr-preview-card"
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-black/30 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* QR Code Canvas Box */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className="p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-center"
              style={{ backgroundColor: customization.backgroundColor }}
            >
              {pngDataUrl ? (
                <img
                  src={pngDataUrl}
                  alt={`QR Code encoding ${url}`}
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center text-slate-400">
                  <span className="text-sm font-medium">Generating QR...</span>
                </div>
              )}
            </div>
            
            <span className="mt-2.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Scannable with any mobile camera
            </span>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 w-full flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Generated Result
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-800/40">
                  Ready to Download
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Your QR Code
              </h2>

              {/* Target URL with truncated visual string and direct open */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Encoded URL
                  </p>
                  <p
                    className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5"
                    title={url}
                  >
                    {displayUrl}
                  </p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-colors shrink-0"
                  title="Open link in new tab"
                  aria-label="Open destination URL in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Download PNG Button */}
                <button
                  type="button"
                  id="download-png-btn"
                  onClick={handleDownloadPng}
                  disabled={!pngDataUrl}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG ({customization.size}px)</span>
                </button>

                {/* Download SVG Button */}
                <button
                  type="button"
                  id="download-svg-btn"
                  onClick={handleDownloadSvg}
                  disabled={!svgString}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 text-slate-900 dark:text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Download SVG (Vector)</span>
                </button>
              </div>

              {/* Secondary actions: Copy link & Reset */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Copy Link Button */}
                <button
                  type="button"
                  id="copy-link-btn"
                  onClick={handleCopyLink}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    copied
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Print button */}
                <button
                  type="button"
                  id="print-qr-btn"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  title="Print QR code"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                {/* Reset / Create New Button */}
                <button
                  type="button"
                  id="reset-qr-btn"
                  onClick={onReset}
                  className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  title="Clear and start over"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Create New</span>
                </button>
              </div>

              {copyFeedback && !copied && (
                <p className="text-xs text-rose-500 dark:text-rose-400">{copyFeedback}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
