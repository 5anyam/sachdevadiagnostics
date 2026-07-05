// Replace this URL with your Google Apps Script Web App URL
// Add to .env.local: NEXT_PUBLIC_GOOGLE_SHEET_URL=https://script.google.com/macros/s/.../exec
const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || '';

export interface BookingSheetRow {
  timestamp: string;
  source: string;        // 'book-test-page' | 'test-detail-page'
  name: string;
  age: string;
  gender: string;
  phone: string;
  whatsapp: string;
  email: string;
  testCategory: string;
  testName: string;
  collectionType: string;
  date: string;
  time: string;
  address: string;
  requirements: string;
  emergencyContact: string;
}

export async function submitToGoogleSheet(data: BookingSheetRow): Promise<void> {
  if (!SHEET_URL) {
    console.warn('Google Sheet URL not configured. Set NEXT_PUBLIC_GOOGLE_SHEET_URL in .env.local');
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', // required for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Google Sheet submission error:', err);
  }
}
