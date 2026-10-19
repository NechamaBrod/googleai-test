import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <aside
      aria-label="הודעת מערכת"
      aria-live="polite"
      className="fixed bottom-6 right-4 left-4 sm:right-6 sm:left-auto sm:max-w-md bg-slate-900/95 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between gap-3 z-50 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        aria-label="סגירת הודעה"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
