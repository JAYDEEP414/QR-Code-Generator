import React from 'react';
import { Palette, Maximize2, ShieldAlert, Sliders, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { QRCodeCustomization, QRSize, ErrorCorrectionLevel, DEFAULT_CUSTOMIZATION } from '../types';
import { calculateContrastRatio } from '../utils/qrUtils';

interface CustomizationPanelProps {
  customization: QRCodeCustomization;
  onChange: (updated: QRCodeCustomization) => void;
  onReset: () => void;
}

const FG_COLOR_PRESETS = [
  { name: 'Black', color: '#000000' },
  { name: 'Charcoal', color: '#1e293b' },
  { name: 'Navy', color: '#0f172a' },
  { name: 'Indigo', color: '#3730a3' },
  { name: 'Emerald', color: '#065f46' },
  { name: 'Crimson', color: '#991b1b' },
  { name: 'Violet', color: '#5b21b6' },
  { name: 'Teal', color: '#115e59' },
];

const BG_COLOR_PRESETS = [
  { name: 'White', color: '#ffffff' },
  { name: 'Off-White', color: '#f8fafc' },
  { name: 'Warm Cream', color: '#fefce8' },
  { name: 'Soft Gray', color: '#f1f5f9' },
  { name: 'Mint Ice', color: '#f0fdf4' },
  { name: 'Sky Ice', color: '#f0f9ff' },
];

const SIZES: { label: string; value: QRSize; desc: string }[] = [
  { label: '300 × 300', value: 300, desc: 'Web & Mobile' },
  { label: '500 × 500', value: 500, desc: 'Standard (Default)' },
  { label: '800 × 800', value: 800, desc: 'High-Res / Print' },
  { label: '1200 × 1200', value: 1200, desc: 'Ultra HD Posters' },
];

const ECC_LEVELS: { level: ErrorCorrectionLevel; name: string; desc: string }[] = [
  { level: 'L', name: 'Low', desc: '~7% recovery (Cleanest look)' },
  { level: 'M', name: 'Medium', desc: '~15% recovery (Standard)' },
  { level: 'Q', name: 'Quartile', desc: '~25% recovery (High durability)' },
  { level: 'H', name: 'High', desc: '~30% recovery (Best for heavy use)' },
];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
  onReset,
}) => {
  const contrastRatio = calculateContrastRatio(
    customization.foregroundColor,
    customization.backgroundColor
  );
  const isLowContrast = contrastRatio < 3.0;

  return (
    <div
      id="customization-panel"
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Customize QR Code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize colors, export resolution, and error recovery
            </p>
          </div>
        </div>

        <button
          type="button"
          id="reset-customization-btn"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Styles</span>
        </button>
      </div>

      {/* Contrast Warning Banner */}
      {isLowContrast && (
        <div
          id="contrast-warning-alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Low color contrast detected ({contrastRatio.toFixed(1)}:1)</p>
            <p className="mt-0.5 text-amber-800 dark:text-amber-300">
              Choose a darker QR color or lighter background for reliable scanning.
            </p>
          </div>
        </div>
      )}

      {/* Grid of customizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              QR Code Color (Foreground)
            </label>
            <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
              {customization.foregroundColor.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FG_COLOR_PRESETS.map((preset) => {
              const isSelected = customization.foregroundColor.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => onChange({ ...customization, foregroundColor: preset.color })}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-400 scale-110 shadow-sm ring-2 ring-blue-600/30'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                  aria-label={`Select ${preset.name} QR color`}
                >
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${preset.color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <label
              className="relative w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Custom QR color"
            >
              <input
                type="color"
                value={customization.foregroundColor}
                onChange={(e) => onChange({ ...customization, foregroundColor: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Choose custom QR foreground color"
              />
              <div
                className="w-full h-full"
                style={{ backgroundColor: customization.foregroundColor }}
              />
            </label>
          </div>

          {/* Background Color */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Background Color
              </label>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                {customization.backgroundColor.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {BG_COLOR_PRESETS.map((preset) => {
                const isSelected = customization.backgroundColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => onChange({ ...customization, backgroundColor: preset.color })}
                    className={`w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-blue-600 dark:ring-blue-400 scale-110 shadow-sm'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                    aria-label={`Select ${preset.name} background color`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-900" />
                    )}
                  </button>
                );
              })}

              {/* Custom BG Color Input */}
              <label
                className="relative w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Custom Background color"
              >
                <input
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => onChange({ ...customization, backgroundColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Choose custom QR background color"
                />
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: customization.backgroundColor }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Size and Error Correction */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              QR Code Resolution / Export Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onChange({ ...customization, size: s.value })}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    customization.size === s.value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{s.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      customization.size === s.value
                        ? 'text-blue-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Error Correction Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {ECC_LEVELS.map((ecc) => (
                <button
                  key={ecc.level}
                  type="button"
                  onClick={() => onChange({ ...customization, errorCorrectionLevel: ecc.level })}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    customization.errorCorrectionLevel === ecc.level
                      ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium'
                  }`}
                  title={ecc.desc}
                >
                  <span className="text-xs font-bold">{ecc.name} ({ecc.level})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
