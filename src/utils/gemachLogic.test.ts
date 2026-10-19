import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidIsraeliPhone,
  formatPhoneNumber,
  validateDateRange,
  formatHebrewDate,
  approveRequestLogic,
  markReturnedLogic,
  filterItems,
} from './gemachLogic.ts';
import type { GemachItem, LoanRequest } from '../types.ts';

test('isValidIsraeliPhone accurately validates Israeli numbers', () => {
  // Valid mobile numbers
  assert.equal(isValidIsraeliPhone('0501234567'), true);
  assert.equal(isValidIsraeliPhone('052-1234567'), true);
  assert.equal(isValidIsraeliPhone('054 987 6543'), true);
  assert.equal(isValidIsraeliPhone('+972501234567'), true);
  assert.equal(isValidIsraeliPhone('058-7654321'), true);

  // Valid landline
  assert.equal(isValidIsraeliPhone('02-6543210'), true);
  assert.equal(isValidIsraeliPhone('039876543'), true);
  assert.equal(isValidIsraeliPhone('0771234567'), true);

  // Invalid
  assert.equal(isValidIsraeliPhone(''), false);
  assert.equal(isValidIsraeliPhone('12345'), false);
  assert.equal(isValidIsraeliPhone('050123456'), false); // 9 digits only
  assert.equal(isValidIsraeliPhone('0601234567'), false); // invalid prefix
  assert.equal(isValidIsraeliPhone('abcdefghij'), false);
});

test('formatPhoneNumber formats properly', () => {
  assert.equal(formatPhoneNumber('0501234567'), '050-1234567');
  assert.equal(formatPhoneNumber('026543210'), '02-6543210');
});

test('validateDateRange rejects missing or backward dates', () => {
  assert.equal(validateDateRange('', '2026-10-25').valid, false);
  assert.equal(validateDateRange('2026-10-25', '').valid, false);

  // Return date before start date
  const backward = validateDateRange('2026-10-25', '2026-10-20');
  assert.equal(backward.valid, false);
  assert.match(backward.error!, /מאוחר/);

  // Same day is valid
  assert.equal(validateDateRange('2026-10-20', '2026-10-20').valid, true);

  // Later date is valid
  assert.equal(validateDateRange('2026-10-20', '2026-10-27').valid, true);
});

test('formatHebrewDate converts YYYY-MM-DD to DD/MM/YYYY', () => {
  assert.equal(formatHebrewDate('2026-10-18'), '18/10/2026');
  assert.equal(formatHebrewDate(''), '');
});

test('approveRequestLogic sets request to approved and item to borrowed', () => {
  const initialItems: GemachItem[] = [
    {
      id: 'item-1',
      name: 'עגלה',
      category: 'ציוד ליולדות',
      status: 'available',
      desc: '',
      specs: [],
      imageUrl: '',
      location: '',
    },
  ];

  const initialRequests: LoanRequest[] = [
    {
      id: 'req-1',
      itemId: 'item-1',
      itemName: 'עגלה',
      category: 'ציוד ליולדות',
      borrowerName: 'ישראל',
      phone: '050-1234567',
      startDate: '2026-10-20',
      endDate: '2026-10-25',
      status: 'pending',
      createdAt: '2026-10-18T10:00:00Z',
    },
  ];

  const { updatedItems, updatedRequests } = approveRequestLogic(initialItems, initialRequests, 'req-1');

  assert.equal(updatedRequests[0].status, 'approved');
  assert.equal(updatedItems[0].status, 'borrowed');
});

test('markReturnedLogic sets request to returned and item to available', () => {
  const initialItems: GemachItem[] = [
    {
      id: 'item-1',
      name: 'עגלה',
      category: 'ציוד ליולדות',
      status: 'borrowed',
      desc: '',
      specs: [],
      imageUrl: '',
      location: '',
    },
  ];

  const initialRequests: LoanRequest[] = [
    {
      id: 'req-1',
      itemId: 'item-1',
      itemName: 'עגלה',
      category: 'ציוד ליולדות',
      borrowerName: 'ישראל',
      phone: '050-1234567',
      startDate: '2026-10-20',
      endDate: '2026-10-25',
      status: 'approved',
      createdAt: '2026-10-18T10:00:00Z',
    },
  ];

  const { updatedItems, updatedRequests } = markReturnedLogic(initialItems, initialRequests, 'req-1');

  assert.equal(updatedRequests[0].status, 'returned');
  assert.equal(updatedItems[0].status, 'available');
});

test('filterItems filters by category and search text', () => {
  const sampleItems: GemachItem[] = [
    {
      id: '1',
      name: 'עגלת תינוק',
      category: 'ציוד ליולדות',
      status: 'available',
      desc: 'עגלה נוחה',
      specs: [],
      imageUrl: '',
      location: '',
    },
    {
      id: '2',
      name: 'שולחן מתקפל',
      category: 'ציוד לאירועים',
      status: 'available',
      desc: 'שולחן 1.8 מטר',
      specs: [],
      imageUrl: '',
      location: '',
    },
  ];

  assert.equal(filterItems(sampleItems, 'all', '').length, 2);
  assert.equal(filterItems(sampleItems, 'ציוד ליולדות', '').length, 1);
  assert.equal(filterItems(sampleItems, 'all', 'שולחן').length, 1);
  assert.equal(filterItems(sampleItems, 'ציוד ליולדות', 'שולחן').length, 0);
});
