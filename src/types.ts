export type ItemCategory = 'ציוד ליולדות' | 'ציוד לאירועים';

export type ItemStatus = 'available' | 'borrowed';

export type RequestStatus = 'pending' | 'approved' | 'returned';

export interface GemachItem {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  desc: string;
  specs: string[];
  imageUrl: string;
  location: string;
}

export interface LoanRequest {
  id: string;
  itemId: string;
  itemName: string;
  category: ItemCategory;
  borrowerName: string;
  phone: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: RequestStatus;
  notes?: string;
  createdAt: string;
}

export type ActiveScreen = 'home' | 'detail' | 'admin';
