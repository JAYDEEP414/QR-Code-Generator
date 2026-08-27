import QRCode from 'qrcode';
import { QRCodeCustomization } from '../types';

/**
 * Validates and normalizes user input into a valid URL.
 * Handles inputs like 'example.com' -> 'https://example.com'
 */
export function validateAndNormalizeUrl(rawInput: string): {
  isValid: boolean;
  normalizedUrl: string;
  errorMessage?: string;
} {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      normalizedUrl: '',
      errorMessage: 'Please enter a link.',
    };
  }

  let testUrl = trimmed;

  // If missing protocol, prepend https://
  if (!/^https?:\/\//i.test(testUrl) && !/^ftp:\/\//i.test(testUrl)) {
    testUrl = `https://${testUrl}`;
  }

  try {
    const parsed = new URL(testUrl);
    // Ensure hostname exists and has at least a domain name structure (e.g. example.com or localhost or IP)
    const hostname = parsed.hostname;
    if (!hostname || (!hostname.includes('.') && hostname !== 'localhost')) {
      return {
        isValid: false,
        normalizedUrl: '',
        errorMessage: 'Please enter a valid URL.',
      };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.href,
    };
  } catch {
    return {
      isValid: false,
      normalizedUrl: '',
      errorMessage: 'Please enter a valid URL.',
    };
  }
}

/**
 * Shortens a URL for visual preview (e.g., https://example.com/products/...)
 */
export function formatDisplayUrl(url: string, maxLength = 45): string {
  try {
    const parsed = new URL(url);
    const hostAndPath = parsed.host + parsed.pathname + parsed.search + parsed.hash;
    const protocol = parsed.protocol + '//';
    
    if (url.length <= maxLength) {
      return url;
    }
    
    const maxPathLen = maxLength - protocol.length - 3;
    if (maxPathLen <= 0) {
      return url.slice(0, maxLength - 3) + '...';
    }
    return protocol + hostAndPath.slice(0, maxPathLen) + '...';
  } catch {
    if (url.length > maxLength) {
      return url.slice(0, maxLength - 3) + '...';
    }
    return url;
  }
}

/**
 * Converts Hex string to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

/**
 * Relative luminance calculation for WCAG contrast
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two hex colors (1:1 to 21:1)
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex) || { r: 0, g: 0, b: 0 };
  const bgRgb = hexToRgb(bgHex) || { r: 255, g: 255, b: 255 };

  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Generates high-resolution PNG Data URL
 */
export async function generateQrPngDataUrl(
  url: string,
  customization: QRCodeCustomization
): Promise<string> {
  const options: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: customization.errorCorrectionLevel,
    margin: customization.margin,
    width: customization.size,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor,
    },
  };

  return await QRCode.toDataURL(url, options);
}

/**
 * Generates pure SVG string
 */
export async function generateQrSvgString(
  url: string,
  customization: QRCodeCustomization
): Promise<string> {
  const options: QRCode.QRCodeToStringOptions = {
    type: 'svg',
    errorCorrectionLevel: customization.errorCorrectionLevel,
    margin: customization.margin,
    width: customization.size,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor,
    },
  };

  return await QRCode.toString(url, options);
}

/**
 * Sanitizes a URL into a safe, clean file name like `qr-code-example-com.png`
 */
export function getSanitizedFileName(url: string, extension: 'png' | 'svg'): string {
  try {
    const parsed = new URL(url);
    let host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    host = host.replace(/[^a-z0-9-_]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!host) {
      host = 'link';
    }
    return `qr-code-${host}.${extension}`;
  } catch {
    return `qr-code.${extension}`;
  }
}

/**
 * Triggers browser download for a Data URL (PNG)
 */
export function downloadPngFromDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers browser download for an SVG string
 */
export function downloadSvgFromString(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Copies text to user clipboard with safe fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  // Fallback using textarea selection
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
