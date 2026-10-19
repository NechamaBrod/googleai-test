import { GemachItem, LoanRequest } from '../types.ts';

const STORAGE_KEY_ITEMS = 'gemach_items_v2';
const STORAGE_KEY_REQUESTS = 'gemach_requests_v2';

export const INITIAL_ITEMS: GemachItem[] = [
  {
    id: 'item-1',
    name: 'עגלת תינוק משולבת (אמבטיה וטיולון)',
    category: 'ציוד ליולדות',
    status: 'available',
    desc: 'עגלה איכותית, מרופדת וקלה לקיפול, מתאימה מלידה ועד גיל שנתיים. כוללת גגון שמש רחב וסל תחתון מרווח.',
    specs: ['משקל קל עם בולמי זעזועים', 'עריסת אמבטיה + טיולון דו-כיווני', 'מחוטאת ונקייה ברמה גבוהה'],
    imageUrl: '/src/assets/images/gemach_baby_stroller_1792381206804.jpg',
    location: 'סניף מרכזי - קומה 1',
  },
  {
    id: 'item-2',
    name: 'עריסת תינוק ניידת מעץ בוק',
    category: 'ציוד ליולדות',
    status: 'available',
    desc: 'עריסת עץ בטיחותית ותקנית עם גלגלים שקטים לניוד נוח בין החדרים. מגיעה עם מזרן נושם איכותי.',
    specs: ['עץ בוק מלא בעל תו תקן ישראלי', 'כולל מזרן נושם וסט מצעים סטרילי', 'גלגלים עם מעצורי בטיחות'],
    imageUrl: '/src/assets/images/gemach_wooden_crib_1792381207334.jpg',
    location: 'סניף מרכזי - קומה 1',
  },
  {
    id: 'item-3',
    name: 'משאבת חלב חשמלית כפולה מקצועית',
    category: 'ציוד ליולדות',
    status: 'borrowed',
    desc: 'משאבה שקטה במיוחד בעלת עוצמות שאיבה מגוונות ומסך דיגיטלי חכם. נבדקה ועברה חיטוי רפואי מלא.',
    specs: ['שאיבה כפולה בו-זמנית', 'מסך מגע דיגיטלי וסוללה נטענת', 'יש צורך בערכת שאיבה אישית חד-פעמית'],
    imageUrl: '/src/assets/images/gemach_breast_pump_1792381208362.jpg',
    location: 'סניף מרכזי - חדר יולדות',
  },
  {
    id: 'item-4',
    name: 'כיסא אוכל מתכוונן לפעוטות',
    category: 'ציוד ליולדות',
    status: 'available',
    desc: 'כיסא אוכל יציב מעץ ופלסטיק איכותי קל לניקוי, עם רתמת 5 נקודות ומגש אוכל כפול נשלף.',
    specs: ['רגלי עץ חזקות עם בסיס יציב', 'מגש נשלף שטיף במדיח', 'מתאים מגיל ישיבה ועד 18 ק״ג'],
    imageUrl: '/src/assets/images/gemach_high_chair_1792381222255.jpg',
    location: 'מחלקת פעוטות',
  },
  {
    id: 'item-5',
    name: 'מיחם שבת ואירועים נירוסטה 100 כוסות',
    category: 'ציוד לאירועים',
    status: 'available',
    desc: 'מיחם מים חמים בנפח ענק לאירועים, שבתות חתן ושמחות משפחתיות. מאושר לשימוש בשבת עם ברז מוגן.',
    specs: ['קיבולת גדולה: 100 כוסות מים רותחים', 'מאושר הלכתית לשבת על ידי מכון מדעי טכנולוגי', 'גוף נירוסטה כפול למניעת כוויות'],
    imageUrl: '/src/assets/images/gemach_hot_water_urn_1792381208614.jpg',
    location: 'מחסן אירועים - קומת קרקע',
  },
  {
    id: 'item-6',
    name: 'שולחן אירועים מתקפל 1.80 מטר',
    category: 'ציוד לאירועים',
    status: 'available',
    desc: 'שולחן פלסטיק חזק במיוחד מבית כתר עם רגלי מתכת מחוזקות, מתקפל לשניים בצורת מזוודה עם ידית נשיאה.',
    specs: ['מידות פתוח: 180×75 ס״מ', 'מתקפל למזוודה קומפקטית לרכב', 'עומס מירבי עד 150 ק״ג'],
    imageUrl: '/src/assets/images/gemach_folding_table_1792381208846.jpg',
    location: 'מחסן אירועים - קומת קרקע',
  },
  {
    id: 'item-7',
    name: 'סט 10 כיסאות כתר מתקפלים',
    category: 'ציוד לאירועים',
    status: 'borrowed',
    desc: 'ערימת 10 כיסאות פלסטיק לבנים איכותיים לאירוח ושמחות. יציבים, נוחים לערימה ונכנסים בקלות לכל תא מטען.',
    specs: ['מארז של 10 כיסאות מתקפלים/נערמים', 'קל משקל ועמיד במים ובשמש', 'עומס מירבי עד 120 ק״ג לכיסא'],
    imageUrl: '/src/assets/images/gemach_folding_chairs_1792381208541.jpg',
    location: 'מחסן אירועים - קומת קרקע',
  },
  {
    id: 'item-8',
    name: 'פלטת שבת חשמלית גדולה (6 סירים)',
    category: 'ציוד לאירועים',
    status: 'available',
    desc: 'פלטת חימום רחבה מנירוסטה מוברשת עם ידיות מבודדות חום, מושלמת לסעודות שבת, שבע ברכות ואירוח רב-משתתפים.',
    specs: ['מקום מרווח ל-6 סירים גדולים', 'תו תקן בטיחותי מחמיר עם חום אחיד', 'ידיות נשיאה מבודדות חום'],
    imageUrl: '/src/assets/images/gemach_shabbat_hotplate_1792381221997.jpg',
    location: 'מחסן אירועים - קומת קרקע',
  },
];

export const INITIAL_REQUESTS: LoanRequest[] = [
  {
    id: 'req-1',
    itemId: 'item-3',
    itemName: 'משאבת חלב חשמלית כפולה מקצועית',
    category: 'ציוד ליולדות',
    borrowerName: 'רחל כהן',
    phone: '052-7123456',
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    status: 'approved',
    notes: 'איסוף על ידי הבעל מהסניף המרכזי',
    createdAt: '2026-10-15T09:30:00Z',
  },
  {
    id: 'req-2',
    itemId: 'item-7',
    itemName: 'סט 10 כיסאות כתר מתקפלים',
    category: 'ציוד לאירועים',
    borrowerName: 'משה לוי',
    phone: '050-9876543',
    startDate: '2026-10-18',
    endDate: '2026-10-22',
    status: 'approved',
    notes: 'לברית מילה ביום ראשון',
    createdAt: '2026-10-17T18:20:00Z',
  },
  {
    id: 'req-3',
    itemId: 'item-1',
    itemName: 'עגלת תינוק משולבת (אמבטיה וטיולון)',
    category: 'ציוד ליולדות',
    borrowerName: 'שרה גולדשטיין',
    phone: '054-8451234',
    startDate: '2026-10-22',
    endDate: '2026-11-05',
    status: 'pending',
    notes: 'לידה ראשונה, צריכים את האמבטיה',
    createdAt: '2026-10-18T14:10:00Z',
  },
];

export function getStoredItems(): GemachItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ITEMS;
  } catch {
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: GemachItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function getStoredRequests(): LoanRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: LoanRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save requests to localStorage', err);
  }
}

export function resetAllStorage(): { items: GemachItem[]; requests: LoanRequest[] } {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_ITEMS));
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  return { items: INITIAL_ITEMS, requests: INITIAL_REQUESTS };
}
