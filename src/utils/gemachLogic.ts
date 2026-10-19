import type { GemachItem, LoanRequest, RequestStatus } from '../types.ts';

/**
 * Validates an Israeli phone number (mobile 05X or landline 02, 03, 04, 08, 09, 07X).
 * Removes spaces, hyphens, and leading +972 or 972.
 */
export function isValidIsraeliPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  let clean = phone.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+972')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('972')) {
    clean = '0' + clean.slice(3);
  }

  // Israeli mobile: 050, 051, 052, 053, 054, 055, 058 (10 digits)
  // Israeli landline: 02, 03, 04, 08, 09, 07X (9-10 digits)
  const mobileRegex = /^05\d{8}$/;
  const landlineRegex = /^0[23489]\d{7}$/;
  const voipRegex = /^07\d{8}$/;

  return mobileRegex.test(clean) || landlineRegex.test(clean) || voipRegex.test(clean);
}

/**
 * Formats a raw phone string into a clean Israeli format (e.g., 050-1234567 or 02-1234567).
 */
export function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+972')) clean = '0' + clean.slice(4);
  else if (clean.startsWith('972')) clean = '0' + clean.slice(3);

  if (clean.length === 10 && clean.startsWith('05')) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  if (clean.length === 9 && /^0[23489]/.test(clean)) {
    return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  }
  return phone;
}

/**
 * Validates start and end date logic.
 * - Both must exist
 * - Return date must be equal or later than start date
 */
export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (!startDate) {
    return { valid: false, error: 'נא לבחור תאריך התחלה' };
  }
  if (!endDate) {
    return { valid: false, error: 'נא לבחור תאריך החזרה' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'תאריך התחלה אינו תקין' };
  }
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'תאריך החזרה אינו תקין' };
  }

  if (endDate < startDate) {
    return { valid: false, error: 'תאריך ההחזרה חייב להיות שווה או מאוחר מתאריך ההתחלה' };
  }

  return { valid: true };
}

/**
 * Formats YYYY-MM-DD into Israeli format DD/MM/YYYY
 */
export function formatHebrewDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Pure transition logic for approving a loan request:
 * Sets the request status to 'approved' and marks the associated item as 'borrowed'.
 */
export function approveRequestLogic(
  items: GemachItem[],
  requests: LoanRequest[],
  reqId: string
): { updatedItems: GemachItem[]; updatedRequests: LoanRequest[] } {
  const targetReq = requests.find((r) => r.id === reqId);
  if (!targetReq) {
    return { updatedItems: items, updatedRequests: requests };
  }

  const updatedRequests = requests.map((r) =>
    r.id === reqId ? { ...r, status: 'approved' as RequestStatus } : r
  );

  const updatedItems = items.map((item) =>
    item.id === targetReq.itemId ? { ...item, status: 'borrowed' as const } : item
  );

  return { updatedItems, updatedRequests };
}

/**
 * Pure transition logic for returning an item:
 * Sets the request status to 'returned' and marks the associated item as 'available'.
 */
export function markReturnedLogic(
  items: GemachItem[],
  requests: LoanRequest[],
  reqId: string
): { updatedItems: GemachItem[]; updatedRequests: LoanRequest[] } {
  const targetReq = requests.find((r) => r.id === reqId);
  if (!targetReq) {
    return { updatedItems: items, updatedRequests: requests };
  }

  const updatedRequests = requests.map((r) =>
    r.id === reqId ? { ...r, status: 'returned' as RequestStatus } : r
  );

  const updatedItems = items.map((item) =>
    item.id === targetReq.itemId ? { ...item, status: 'available' as const } : item
  );

  return { updatedItems, updatedRequests };
}

/**
 * Filters items by category and search keyword.
 */
export function filterItems(
  items: GemachItem[],
  category: string,
  searchQuery: string = ''
): GemachItem[] {
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;

    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });
}
