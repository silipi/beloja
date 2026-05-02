'use server';

import { google } from 'googleapis';
import { headers } from 'next/headers';
import { waitlistSchema, type WaitlistInput } from '@/lib/waitlist-schema';
import { getGoogleAuth } from '@/lib/google/auth';

function getSheetClient() {
  return google.sheets({ version: 'v4', auth: getGoogleAuth() });
}

export async function joinWaitlist(data: WaitlistInput) {
  waitlistSchema.parse(data);

  const spreadsheetId = process.env.WAITLIST_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('WAITLIST_SPREADSHEET_ID not set');
  }

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') ?? '';
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '';

  const phoneDigits = data.phone.replace(/\D/g, '');
  const timestamp = new Date().toISOString();

  const sheets = getSheetClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Waitlist!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [timestamp, data.name, phoneDigits, data.email, data.brand_name, ip, userAgent],
      ],
    },
  });

  return { success: true };
}
