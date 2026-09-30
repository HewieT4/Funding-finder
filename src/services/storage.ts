/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fund, LearnerProfile, SavedFundItem } from '../types';

export const DEFAULT_PROFILE: LearnerProfile = {
  province: 'Gauteng',
  level: 'grade12',
  academicAverage: 65,
  mathAverage: 60,
  scienceAverage: 60,
  fieldOfStudy: 'Engineering',
  incomeBand: 'under_350k',
  isSACitizen: true,
  hasDisability: false,
};

const PROFILE_STORAGE_KEY = 'bursary_finder_profile_v1';
const SAVED_FUNDS_STORAGE_KEY = 'bursary_finder_saved_funds_v1';
const LOW_DATA_STORAGE_KEY = 'bursary_finder_low_data_v1';
const DARK_MODE_STORAGE_KEY = 'bursary_finder_dark_mode_v1';

export function loadSavedProfile(): LearnerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: LearnerProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function loadSavedFunds(): SavedFundItem[] {
  try {
    const raw = localStorage.getItem(SAVED_FUNDS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load saved funds', e);
  }
  return [];
}

export function saveFundsToStorage(items: SavedFundItem[]): void {
  try {
    localStorage.setItem(SAVED_FUNDS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save funds', e);
  }
}

export function loadLowDataMode(): boolean {
  try {
    return localStorage.getItem(LOW_DATA_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setLowDataModeStorage(enabled: boolean): void {
  try {
    localStorage.setItem(LOW_DATA_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {}
}

export function loadDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch {
    return false;
  }
}

export function setDarkModeStorage(enabled: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {}
}

/**
 * Generates an iCalendar (.ics) download for a bursary deadline.
 */
export function downloadCalendarReminder(fund: Fund): void {
  const closeDate = new Date(fund.closeDate);
  const startStr = closeDate.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 8) + 'T090000Z';
  const endStr = closeDate.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 8) + 'T170000Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bursary Finder SA//Deadline Reminder//EN',
    'BEGIN:VEVENT',
    `SUMMARY:APPLICATION DEADLINE: ${fund.name}`,
    `DESCRIPTION:Final closing date to apply for ${fund.name} provided by ${fund.provider}. Official link: ${fund.applyUrl}`,
    `URL:${fund.applyUrl}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: 3 days left to submit application for ${fund.name}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fund.slug}-deadline-reminder.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a pre-populated WhatsApp sharing link.
 */
export function getWhatsAppShareUrl(fund: Fund): string {
  const text = encodeURIComponent(
    `🎓 Check out the ${fund.name} (${fund.provider}) on Bursary Finder SA!\n` +
    `📅 Closing date: ${fund.closeDate}\n` +
    `🔗 Official info: ${fund.applyUrl}\n` +
    `Found via Bursary Finder SA.`
  );
  return `https://wa.me/?text=${text}`;
}
