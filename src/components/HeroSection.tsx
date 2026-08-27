import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="text-center pt-8 pb-4 sm:pt-12 sm:pb-6 px-4 max-w-3xl mx-auto">
      {/* Privacy & Speed pill badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/50 mb-4 shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>100% Client-Side & Private • Instant Browser Processing</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Turn Any Link Into a QR Code
      </h1>

      {/* Subheading */}
      <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
        Generate a high-quality QR code from any website link instantly. Free, fast, and fully customizable.
      </p>
    </section>
  );
};
