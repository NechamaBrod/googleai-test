import React, { useState, useEffect } from 'react';
import { ActiveScreen, GemachItem, LoanRequest } from './types.ts';
import {
  getStoredItems,
  saveStoredItems,
  getStoredRequests,
  saveStoredRequests,
  resetAllStorage,
} from './services/storage.ts';
import { approveRequestLogic, markReturnedLogic } from './utils/gemachLogic.ts';
import { Header } from './components/Header.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { ItemDetailView } from './components/ItemDetailView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { Toast } from './components/Toast.tsx';
import { Package, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<GemachItem[]>(() => getStoredItems());
  const [requests, setRequests] = useState<LoanRequest[]>(() => getStoredRequests());
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync items to localStorage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  // Sync requests to localStorage
  useEffect(() => {
    saveStoredRequests(requests);
  }, [requests]);

  const handleNavigate = (screen: ActiveScreen, itemId?: string) => {
    if (itemId) {
      setSelectedItemId(itemId);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitRequest = (
    newReqData: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newRequest: LoanRequest = {
      ...newReqData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    setToastMessage('בקשת ההשאלה נשלחה בהצלחה וממתינה לאישור');
  };

  const handleApproveRequest = (requestId: string) => {
    const { updatedItems, updatedRequests } = approveRequestLogic(
      items,
      requests,
      requestId
    );
    setItems(updatedItems);
    setRequests(updatedRequests);
    setToastMessage('הבקשה אושרה והפריט סומן כמושאל');
  };

  const handleReturnRequest = (requestId: string) => {
    const { updatedItems, updatedRequests } = markReturnedLogic(
      items,
      requests,
      requestId
    );
    setItems(updatedItems);
    setRequests(updatedRequests);
    setToastMessage('הפריט הוחזר למלאי ועודכן כזמין להשאלה');
  };

  const handleResetData = () => {
    const { items: defaultItems, requests: defaultRequests } = resetAllStorage();
    setItems(defaultItems);
    setRequests(defaultRequests);
    setSelectedItemId(null);
    setCurrentScreen('home');
    setToastMessage('כל הנתונים אופסו לברירת המחדל');
  };

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800" dir="rtl">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentScreen === 'home' && (
          <CatalogView items={items} onSelectItem={handleSelectItem} />
        )}

        {currentScreen === 'detail' && selectedItem && (
          <ItemDetailView
            item={selectedItem}
            onBack={() => handleNavigate('home')}
            onSubmitRequest={handleSubmitRequest}
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentScreen === 'detail' && !selectedItem && (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
            <p className="text-slate-600 font-medium">פריט זה לא נמצא במערכת.</p>
            <button
              onClick={() => handleNavigate('home')}
              className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold"
            >
              חזרה לקטלוג
            </button>
          </div>
        )}

        {currentScreen === 'admin' && (
          <AdminView
            items={items}
            requests={requests}
            onApproveRequest={handleApproveRequest}
            onReturnRequest={handleReturnRequest}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Pattern 1 from Mobile Guidelines) */}
      <nav aria-label="ניווט תחתון למובייל" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-6 flex items-center justify-around shadow-lg">
        <button
          data-testid="mobile-nav-catalog"
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition ${
            currentScreen === 'home' || currentScreen === 'detail'
              ? 'text-teal-800 font-bold'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[11px]">קטלוג פריטים</span>
        </button>

        <button
          data-testid="mobile-nav-admin"
          onClick={() => handleNavigate('admin')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition relative ${
            currentScreen === 'admin'
              ? 'text-teal-800 font-bold'
              : 'text-slate-500 font-medium'
          }`}
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">ניהול בקשות</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 pb-20 sm:pb-6 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
          <span>גמ״ח שמחה וחסד</span>
          <span>·</span>
          <span>השאלת ציוד לאירועים וליולדות</span>
        </div>
        <p className="text-[11px] text-slate-400">
          כל הציוד מושאל ללא תשלום · הנתונים נשמרים בדפדפן ומסונכרנים אוטומטית
        </p>
      </footer>

      {/* Toast Feedback */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
