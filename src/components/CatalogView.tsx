import React, { useState } from 'react';
import { GemachItem, ItemCategory } from '../types.ts';
import { filterItems } from '../utils/gemachLogic.ts';
import { Search, Sparkles, CheckCircle2, Clock, ArrowLeft, Baby, PartyPopper } from 'lucide-react';

interface CatalogViewProps {
  items: GemachItem[];
  onSelectItem: (itemId: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  items,
  onSelectItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = filterItems(items, selectedCategory, searchQuery);

  const availableCount = items.filter((i) => i.status === 'available').length;
  const borrowedCount = items.filter((i) => i.status === 'borrowed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero & Intro Section */}
      <section className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-teal-200 text-xs font-semibold bg-teal-800/60 px-3 py-1 rounded-full border border-teal-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>השאלת ציוד קהילתית ללא תשלום</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            ציוד איכותי לאירועים, שמחות וליולדות
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            עגלות, עריסות, משאבות חלב, כיסאות, שולחנות מתקפלים, מיחמי שבת ופלטות חימום.
            הציוד עובר בדיקת תקינות וחיטוי קפדני לפני כל מסירה.
          </p>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-3 gap-3 pt-3 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold tabular-nums text-white">
                {items.length}
              </span>
              <span className="text-[11px] text-teal-100">סה״כ פריטים</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-2.5 text-center border border-emerald-400/20">
              <span className="block text-xl sm:text-2xl font-bold tabular-nums text-emerald-300">
                {availableCount}
              </span>
              <span className="text-[11px] text-emerald-100">זמינים להשאלה</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold tabular-nums text-slate-200">
                {borrowedCount}
              </span>
              <span className="text-[11px] text-slate-200">מושאלים כרגע</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Controls */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              data-testid="filter-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              כל הציוד ({items.length})
            </button>
            <button
              data-testid="filter-maternity"
              onClick={() => setSelectedCategory('ציוד ליולדות')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'ציוד ליולדות'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Baby className="w-3.5 h-3.5 text-teal-600" />
              <span>ציוד ליולדות</span>
            </button>
            <button
              data-testid="filter-events"
              onClick={() => setSelectedCategory('ציוד לאירועים')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'ציוד לאירועים'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
              <span>ציוד לאירועים</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש פריט..."
              aria-label="חיפוש פריט בקטלוג"
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-600 font-medium">לא נמצאו פריטים התואמים לחיפוש שלך.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            איפוס סינונים והצגת כל הפריטים
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isAvailable = item.status === 'available';

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 text-right w-full p-0"
                aria-label={`${item.name}, קטגוריה: ${item.category}, סטטוס: ${isAvailable ? 'זמין' : 'מושאל'}`}
              >
                {/* Image Container with Status Badge */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Prominent Status Indicator Tag */}
                  <div className="absolute top-3 right-3">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/95 text-emerald-900 border border-emerald-300 shadow-xs backdrop-blur-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>זמין</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/95 text-slate-700 border border-slate-300 shadow-xs backdrop-blur-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>מושאל</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Category unboxed text */}
                    <div className="text-xs font-semibold text-teal-700">
                      {item.category}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-teal-800 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Link Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-900">
                    <span>{isAvailable ? 'להשאלה מיידית' : 'צפייה בפרטים והרשמה'}</span>
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
