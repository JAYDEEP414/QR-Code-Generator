import React, { useState, useEffect, useRef } from 'react';
import { Link2, ArrowRight, Clipboard, X, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratorCardProps {
  initialUrl?: string;
  onGenerate: (url: string) => void;
  errorMessage: string | null;
  onClearError: () => void;
  isGenerating?: boolean;
}

const SAMPLE_LINKS = [
  { label: 'Google', url: 'google.com' },
  { label: 'YouTube', url: 'youtube.com/watch?v=dQw4w9WgXcQ' },
  { label: 'GitHub', url: 'github.com' },
  { label: 'Maps Link', url: 'maps.google.com' },
];

export const GeneratorCard: React.FC<GeneratorCardProps> = ({
  initialUrl = '',
  onGenerate,
  errorMessage,
  onClearError,
  isGenerating = false,
}) => {
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl) {
      setInputUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onGenerate(inputUrl);
  };

  const handleClear = () => {
    setInputUrl('');
    onClearError();
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text.trim());
          onClearError();
        }
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  const handleSampleClick = (sample: string) => {
    setInputUrl(sample);
    onClearError();
    onGenerate(sample);
  };

  return (
    <div id="generator-section" className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-7 shadow-lg shadow-slate-900/5 dark:shadow-black/30 border border-slate-200 dark:border-slate-800 transition-all duration-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="qr-url-input"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Enter Website URL or Link
            </label>
            
            {/* Input bar */}
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Link2 className="w-5 h-5" />
                </div>
                
                <input
                  id="qr-url-input"
                  ref={inputRef}
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMessage) onClearError();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                  placeholder="Paste your link here, e.g. https://example.com"
                  className={`w-full pl-11 pr-20 py-3.5 text-base sm:text-lg bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border ${
                    errorMessage
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-500/20'
                  } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-150 font-normal`}
                  autoComplete="off"
                  spellCheck="false"
                />

                {/* Right quick actions inside input */}
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
                  {inputUrl ? (
                    <button
                      type="button"
                      id="clear-url-input-btn"
                      onClick={handleClear}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
                      title="Clear input"
                      aria-label="Clear URL"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="paste-url-btn"
                      onClick={handlePaste}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      Paste
                    </button>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                id="generate-qr-btn"
                disabled={isGenerating}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
              >
                <span>Generate QR Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                id="url-error-message"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper sample links */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium mr-1">Quick examples:</span>
            {SAMPLE_LINKS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleSampleClick(sample.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
