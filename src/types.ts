export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRSize = 300 | 500 | 800 | 1200;

export interface QRCodeCustomization {
  foregroundColor: string;
  backgroundColor: string;
  size: QRSize;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
}

export interface QRHistoryItem {
  id: string;
  url: string;
  shortDisplayUrl: string;
  createdAt: number;
  customization: QRCodeCustomization;
}

export const DEFAULT_CUSTOMIZATION: QRCodeCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 500,
  errorCorrectionLevel: 'M',
  margin: 2,
};
