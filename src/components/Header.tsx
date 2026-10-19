import React from 'react';
import { Package, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { ActiveScreen } from '../types.ts';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen, itemId?: string) => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-right cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1"
          aria-label="דף הבית של גמ״ח שמחה וחסד"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight">
              גמ״ח שמחה וחסד
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block">
              השאלת ציוד לאירועים וליולדות
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            data-testid="nav-catalog"
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              currentScreen === 'home' || currentScreen === 'detail'
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>קטלוג פריטים</span>
          </button>

          <button
            data-testid="nav-admin"
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              currentScreen === 'admin'
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>מסך ניהול</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Quick Action / Contact */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 border-r border-slate-200 pr-4">
          <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
          <span className="font-medium">מוקד הגמ״ח:</span>
          <a
            href="tel:025001234"
            className="font-bold text-teal-700 hover:underline dir-ltr text-left"
            dir="ltr"
          >
            02-500-1234
          </a>
        </div>
      </div>
    </header>
  );
};
