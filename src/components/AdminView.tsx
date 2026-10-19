import React, { useState } from 'react';
import { GemachItem, LoanRequest, RequestStatus } from '../types.ts';
import { formatHebrewDate, formatPhoneNumber } from '../utils/gemachLogic.ts';
import {
  ShieldCheck,
  Check,
  RotateCcw,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

interface AdminViewProps {
  items: GemachItem[];
  requests: LoanRequest[];
  onApproveRequest: (requestId: string) => void;
  onReturnRequest: (requestId: string) => void;
  onResetData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  items,
  requests,
  onApproveRequest,
  onReturnRequest,
  onResetData,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const returnedRequests = requests.filter((r) => r.status === 'returned');

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    if (!matchesStatus) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.itemName.toLowerCase().includes(q) ||
      req.borrowerName.toLowerCase().includes(q) ||
      req.phone.includes(q)
    );
  });

  const getCleanWhatsAppLink = (phone: string, itemName: string, borrowerName: string) => {
    let clean = phone.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('0')) {
      clean = '972' + clean.slice(1);
    }
    const msg = encodeURIComponent(`שלום ${borrowerName}, בקשר לבקשת ההשאלה מתוך גמ״ח שמחה וחסד עבור ${itemName}:`);
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Header & Stats */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>פאנל ניהול גמ״ח</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              מעקב בקשות והשאלות פעילות
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              אישור בקשות חדשות מעדכן את הפריט כמושאל, וסימון החזרה מחזיר אותו לקטלוג כזמין.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('האם לאפס את כל הנתונים לברירת המחדל המקורית?')) {
                onResetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition self-start sm:self-auto cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>איפוס נתונים לברירת מחדל</span>
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">ממתינות לאישור</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-amber-950 tabular-nums">
              {pendingRequests.length}
            </div>
            <p className="text-[11px] text-amber-800 mt-1">דורש אישור מנהל הגמ״ח</p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">בהשאלה פעילה</span>
              <Calendar className="w-4 h-4 text-blue-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-blue-950 tabular-nums">
              {approvedRequests.length}
            </div>
            <p className="text-[11px] text-blue-800 mt-1">ציוד הנמצא כעת אצל שואלים</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">הוחזרו בהצלחה</span>
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
              {returnedRequests.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">השאלות שהסתיימו במלואן</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            כל הבקשות ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ממתינות ({pendingRequests.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            בהשאלה ({approvedRequests.length})
          </button>
          <button
            onClick={() => setFilterStatus('returned')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterStatus === 'returned'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            הוחזרו ({returnedRequests.length})
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="סינון לפי פריט, שם שואל או טלפון..."
          aria-label="חיפוש בטבלת בקשות"
          className="w-full sm:w-64 px-3.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
        />
      </div>

      {/* Requests Table & Cards View */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="font-semibold text-slate-600">אין בקשות התואמות לסינון הנוכחי.</p>
            <p className="text-xs text-slate-400">ניתן להגיש בקשה חדשה מתוך קטלוג הפריטים.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                  <tr>
                    <th className="py-3.5 px-4">פריט</th>
                    <th className="py-3.5 px-4">שם השואל/ת</th>
                    <th className="py-3.5 px-4">טלפון וקשר</th>
                    <th className="py-3.5 px-4">מועדי השאלה</th>
                    <th className="py-3.5 px-4">סטטוס</th>
                    <th className="py-3.5 px-4 text-center">פעולות עדכון</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => {
                    const linkedItem = items.find((i) => i.id === req.itemId);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition">
                        {/* Item */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div>{req.itemName}</div>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {req.category}
                          </span>
                        </td>

                        {/* Borrower Name */}
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <div>{req.borrowerName}</div>
                          {req.notes && (
                            <span className="text-[11px] text-slate-500 italic block line-clamp-1">
                              הערה: {req.notes}
                            </span>
                          )}
                        </td>

                        {/* Phone & Quick Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-700" dir="ltr">
                              {formatPhoneNumber(req.phone)}
                            </span>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${req.phone}`}
                                title="חיוג טלפוני"
                                className="p-1 rounded-md text-slate-500 hover:text-teal-700 hover:bg-teal-50"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={getCleanWhatsAppLink(req.phone, req.itemName, req.borrowerName)}
                                target="_blank"
                                rel="noreferrer"
                                title="שליחת הודעת וואטסאפ"
                                className="p-1 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            מ-{formatHebrewDate(req.startDate)}
                          </div>
                          <div className="text-slate-500">
                            עד {formatHebrewDate(req.endDate)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>ממתין לאישור</span>
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                              <Calendar className="w-3 h-3 text-blue-700" />
                              <span>אושר (בהשאלה)</span>
                            </span>
                          )}
                          {req.status === 'returned' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              <span>הוחזר לגמ״ח</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {req.status === 'pending' && (
                              <button
                                onClick={() => onApproveRequest(req.id)}
                                aria-label={`אישור השאלת ${req.itemName} עבור ${req.borrowerName}`}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>אושר (סמן כמושאל)</span>
                              </button>
                            )}

                            {req.status === 'approved' && (
                              <button
                                onClick={() => onReturnRequest(req.id)}
                                aria-label={`סימון החזרת ${req.itemName} מאת ${req.borrowerName}`}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>הוחזר (החזר לזמין)</span>
                              </button>
                            )}

                            {req.status === 'returned' && (
                              <span className="text-xs text-slate-400 font-medium">
                                הושלם
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-teal-700 block">
                        {req.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {req.itemName}
                      </h3>
                    </div>

                    {req.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 shrink-0">
                        ממתין
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 shrink-0">
                        בהשאלה
                      </span>
                    )}
                    {req.status === 'returned' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 shrink-0">
                        הוחזר
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">שואל/ת:</span>
                      <span className="font-semibold">{req.borrowerName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">טלפון:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono" dir="ltr">
                          {formatPhoneNumber(req.phone)}
                        </span>
                        <a
                          href={`tel:${req.phone}`}
                          className="p-1 rounded bg-white text-teal-700 border border-slate-200"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <a
                          href={getCleanWhatsAppLink(req.phone, req.itemName, req.borrowerName)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-white text-emerald-700 border border-slate-200"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">תאריכים:</span>
                      <span className="font-medium">
                        {formatHebrewDate(req.startDate)} - {formatHebrewDate(req.endDate)}
                      </span>
                    </div>

                    {req.notes && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        הערה: {req.notes}
                      </div>
                    )}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="pt-1">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => onApproveRequest(req.id)}
                        aria-label={`אישור השאלת ${req.itemName} עבור ${req.borrowerName}`}
                        className="w-full py-2.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>אישור בקשה (סמן כמושאל)</span>
                      </button>
                    )}

                    {req.status === 'approved' && (
                      <button
                        onClick={() => onReturnRequest(req.id)}
                        aria-label={`סימון החזרת ${req.itemName} מאת ${req.borrowerName}`}
                        className="w-full py-2.5 bg-slate-800 active:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>סימון כהוחזר (החזר לזמין)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
