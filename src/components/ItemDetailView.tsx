import React, { useState } from 'react';
import { GemachItem, LoanRequest } from '../types.ts';
import { isValidIsraeliPhone, validateDateRange, formatHebrewDate } from '../utils/gemachLogic.ts';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Phone,
  User,
  FileText,
  AlertCircle,
  ShieldAlert,
  Send,
  ExternalLink,
} from 'lucide-react';

interface ItemDetailViewProps {
  item: GemachItem;
  onBack: () => void;
  onSubmitRequest: (request: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToAdmin: () => void;
}

export const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  item,
  onBack,
  onSubmitRequest,
  onNavigateToAdmin,
}) => {
  // Today's ISO date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [borrowerName, setBorrowerName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    borrowerName: string;
    phone: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const isAvailable = item.status === 'available';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate Name
    if (!borrowerName.trim()) {
      newErrors.borrowerName = 'נא להזין שם מלא';
    }

    // Validate Israeli Phone
    if (!phone.trim()) {
      newErrors.phone = 'נא להזין מספר טלפון';
    } else if (!isValidIsraeliPhone(phone)) {
      newErrors.phone = 'נא להזין מספר טלפון ישראלי תקין (לדוגמה: 050-1234567 או 02-6543210)';
    }

    // Validate Dates
    const dateCheck = validateDateRange(startDate, endDate);
    if (!dateCheck.valid) {
      if (!startDate) newErrors.startDate = 'נא לבחור תאריך התחלה';
      if (!endDate) newErrors.endDate = 'נא לבחור תאריך החזרה';
      else if (dateCheck.error) newErrors.endDate = dateCheck.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const reqPayload = {
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      borrowerName: borrowerName.trim(),
      phone: phone.trim(),
      startDate,
      endDate,
      notes: notes.trim(),
    };

    onSubmitRequest(reqPayload);
    setSubmittedData({
      borrowerName: borrowerName.trim(),
      phone: phone.trim(),
      startDate,
      endDate,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-800 transition py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowRight className="w-4 h-4" />
          <span>חזרה לקטלוג הפריטים</span>
        </button>

        <span className="text-xs text-slate-500">
          מזהה פריט: <span className="font-mono text-slate-700">{item.id}</span>
        </span>
      </div>

      {/* Main Grid: Details on one side, Form on the other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Details): 7 cols on desktop */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6 p-6">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={item.imageUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Status on image */}
            <div className="absolute top-4 right-4">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/95 text-emerald-900 border border-emerald-300 shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>זמין להשאלה מיידית</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-200/95 text-slate-800 border border-slate-300 shadow-xs backdrop-blur-xs">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>כרגע מושאל (ניתן לשריין)</span>
                </span>
              )}
            </div>
          </div>

          {/* Title and Metadata */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-teal-700">
              {item.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {item.name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {item.desc}
            </p>
          </div>

          {/* Specs & Highlights */}
          {item.specs && item.specs.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                מאפיינים ותנאי שימוש
              </h3>
              <ul className="space-y-2">
                {item.specs.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Location info */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
            <span>מיקום מסירה: <strong>{item.location}</strong> (בתיאום מראש)</span>
          </div>
        </div>

        {/* Right Column (Form / Success): 5 cols on desktop */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          {isSubmitted && submittedData ? (
            /* Confirmation Message */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>הבקשה נשלחה בהצלחה!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  פרטייך נקלטו במערכת הגמ״ח. אחראי הגמ״ח יבדוק את הבקשה ויאשר אותה לקראת מועד האיסוף.
                </p>
              </div>

              {/* Submitted Details Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  סיכום פרטי ההשאלה
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">פריט:</span>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">שם השואל/ת:</span>
                  <span className="font-semibold text-slate-900">{submittedData.borrowerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">טלפון ליצירת קשר:</span>
                  <span className="font-semibold text-slate-900" dir="ltr">
                    {submittedData.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">תקופת השאלה:</span>
                  <span className="font-semibold text-slate-900">
                    {formatHebrewDate(submittedData.startDate)} עד {formatHebrewDate(submittedData.endDate)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={onNavigateToAdmin}
                  className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>צפייה בבקשה במסך הניהול</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-xs sm:text-sm"
                >
                  חזרה לקטלוג הראשי
                </button>
              </div>
            </div>
          ) : (
            /* Loan Request Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  טופס בקשת השאלה
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  אנא מלאו את כל פרטי החובה לצורך תיאום קבלת הציוד.
                </p>
              </div>

              {/* Status Note if borrowed */}
              {!isAvailable && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    הפריט מושאל כעת. ניתן להגיש בקשה לתאריך עתידי ואנו נעדכן כשהפריט יוחזר.
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="borrowerName"
                  className="block text-xs font-bold text-slate-700"
                >
                  שם מלא *
                </label>
                <div className="relative">
                  <input
                    id="borrowerName"
                    type="text"
                    value={borrowerName}
                    onChange={(e) => {
                      setBorrowerName(e.target.value);
                      if (errors.borrowerName) setErrors({ ...errors, borrowerName: '' });
                    }}
                    placeholder="ישראל ישראלי"
                    className={`w-full pl-3 pr-9 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                      errors.borrowerName
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errors.borrowerName && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errors.borrowerName}</span>
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label
                  htmlFor="borrowerPhone"
                  className="block text-xs font-bold text-slate-700"
                >
                  מספר טלפון *
                </label>
                <div className="relative">
                  <input
                    id="borrowerPhone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="050-1234567"
                    className={`w-full pl-3 pr-9 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition text-right ${
                      errors.phone
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    טלפון נייד או קווי ישראלי תקין לצורך קבלת SMS / שיחה לאישור
                  </p>
                )}
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Start Date */}
                <div className="space-y-1">
                  <label
                    htmlFor="startDate"
                    className="block text-xs font-bold text-slate-700"
                  >
                    תאריך התחלה *
                  </label>
                  <div className="relative">
                    <input
                      id="startDate"
                      type="date"
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (errors.startDate) setErrors({ ...errors, startDate: '' });
                      }}
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                        errors.startDate
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{errors.startDate}</span>
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <label
                    htmlFor="endDate"
                    className="block text-xs font-bold text-slate-700"
                  >
                    תאריך החזרה *
                  </label>
                  <div className="relative">
                    <input
                      id="endDate"
                      type="date"
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (errors.endDate) setErrors({ ...errors, endDate: '' });
                      }}
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                        errors.endDate
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                      }`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{errors.endDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Notes (Optional) */}
              <div className="space-y-1">
                <label
                  htmlFor="notes"
                  className="block text-xs font-bold text-slate-700"
                >
                  הערות / תיאום מיוחד (אופציונלי)
                </label>
                <div className="relative">
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="למשל: איסוף ביום שישי בבוקר, צורך בחיבור מיוחד..."
                    className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>שליחת בקשת השאלה</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 pt-1">
                בלחיצה על שליחה, הינך מתחייב לשמור על שלמות וניקיון הציוד ולהחזירו בזמן.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
