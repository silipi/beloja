import { google } from 'googleapis';

export function getGoogleAuth(
  scopes: string[] = ['https://www.googleapis.com/auth/spreadsheets'],
) {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  }

  return new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes,
  });
}
