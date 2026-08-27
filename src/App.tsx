import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GeneratorCard } from './components/GeneratorCard';
import { QRPreviewCard } from './components/QRPreviewCard';
import { CustomizationPanel } from './components/CustomizationPanel';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { RecentHistory } from './components/RecentHistory';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import {
  QRCodeCustomization,
  QRHistoryItem,
  DEFAULT_CUSTOMIZATION,
} from './types';
import {
  validateAndNormalizeUrl,
  generateQrPngDataUrl,
  generateQrSvgString,
  formatDisplayUrl,
} from './utils/qrUtils';

const STORAGE_KEY_HISTORY = 'linkqr_recent_history_v1';
const STORAGE_KEY_THEME = 'linkqr_theme_preference_v1';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // URL & QR generation state
  const [rawUrlInput, setRawUrlInput] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customization, setCustomization] = useState<QRCodeCustomization>(DEFAULT_CUSTOMIZATION);

  // Generated assets
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // About modal
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Apply dark mode class to html/document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore storage error
    }
  }, [history]);

  // Generate QR code for current active URL & customization
  const generateQRCode = useCallback(
    async (urlToEncode: string, customConfig: QRCodeCustomization) => {
      setIsGenerating(true);
      try {
        const [pngUrl, svg] = await Promise.all([
          generateQrPngDataUrl(urlToEncode, customConfig),
          generateQrSvgString(urlToEncode, customConfig),
        ]);
        setPngDataUrl(pngUrl);
        setSvgString(svg);
      } catch (err) {
        console.error('QR generation error:', err);
        setErrorMessage("We couldn't generate the QR code. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  // Re-generate if customization changes and active URL exists
  useEffect(() => {
    if (activeUrl) {
      generateQRCode(activeUrl, customization);
    }
  }, [activeUrl, customization, generateQRCode]);

  // Handle URL submission from input
  const handleGenerate = async (inputStr: string) => {
    setErrorMessage(null);
    const { isValid, normalizedUrl, errorMessage: valError } = validateAndNormalizeUrl(inputStr);

    if (!isValid || !normalizedUrl) {
      setErrorMessage(valError || 'Please enter a valid URL.');
      return;
    }

    setRawUrlInput(inputStr);
    setActiveUrl(normalizedUrl);

    // Generate QR
    await generateQRCode(normalizedUrl, customization);

    // Save to history (keep top 5 most recent unique URLs)
    const newItem: QRHistoryItem = {
      id: Date.now().toString(),
      url: normalizedUrl,
      shortDisplayUrl: formatDisplayUrl(normalizedUrl, 38),
      createdAt: Date.now(),
      customization: { ...customization },
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.url.toLowerCase() !== normalizedUrl.toLowerCase());
      return [newItem, ...filtered].slice(0, 5);
    });

    // Smooth scroll to preview if needed on smaller screens
    setTimeout(() => {
      const previewEl = document.getElementById('qr-preview-card');
      if (previewEl && window.innerWidth < 768) {
        previewEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  // Reset all generator states
  const handleReset = () => {
    setRawUrlInput('');
    setActiveUrl(null);
    setPngDataUrl(null);
    setSvgString(null);
    setErrorMessage(null);
    setCustomization(DEFAULT_CUSTOMIZATION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load from history
  const handleSelectHistoryItem = (item: QRHistoryItem) => {
    setRawUrlInput(item.url);
    setActiveUrl(item.url);
    if (item.customization) {
      setCustomization(item.customization);
    }
    setErrorMessage(null);
    generateQRCode(item.url, item.customization || customization);

    // Scroll to generator
    const genEl = document.getElementById('generator-section');
    if (genEl) {
      genEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenAbout={() => setIsAboutOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content */}
      <main className="flex-1 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <HeroSection />

        {/* URL Input Generator Card */}
        <GeneratorCard
          initialUrl={rawUrlInput}
          onGenerate={handleGenerate}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
          isGenerating={isGenerating}
        />

        {/* QR Preview Card (Shown after generation) */}
        {activeUrl && (
          <div className="space-y-6">
            <QRPreviewCard
              url={activeUrl}
              pngDataUrl={pngDataUrl}
              svgString={svgString}
              customization={customization}
              onReset={handleReset}
            />

            {/* Customization Options */}
            <div className="max-w-3xl mx-auto px-4">
              <CustomizationPanel
                customization={customization}
                onChange={setCustomization}
                onReset={() => setCustomization(DEFAULT_CUSTOMIZATION)}
              />
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <HowItWorks />

        {/* Use Cases Section */}
        <UseCases />

        {/* Recent History Section */}
        <RecentHistory
          history={history}
          onSelect={handleSelectHistoryItem}
          onDelete={handleDeleteHistoryItem}
          onClearAll={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <Footer onOpenAbout={() => setIsAboutOpen(true)} />

      {/* About & Guide Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
