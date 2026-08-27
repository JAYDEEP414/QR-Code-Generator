import React from 'react';
import { Link2, Cpu, Download, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Paste Your Link',
    description: 'Paste any website URL into the input field. Works with full links, shortened URLs, or custom tracking parameters.',
    icon: Link2,
  },
  {
    number: '02',
    title: 'Generate QR Code',
    description: 'Click the Generate QR Code button to instantly compute high-density, error-corrected QR matrices right in your browser.',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Download & Share',
    description: 'Download your QR code in high-resolution PNG or vector SVG format, ready for print, social media, or packaging.',
    icon: Download,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
          Simple 3-Step Process
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How It Works
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Everything happens client-side in milliseconds without requiring sign-up or servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono">
                    {step.number}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
