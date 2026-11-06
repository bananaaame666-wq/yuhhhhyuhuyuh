import React, { useEffect } from 'react';
import { Flame, CheckCircle, Sparkles, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'streak' | 'success' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slide-up">
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-xl border border-stone-700/80 flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {toast.type === 'streak' ? (
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
            <span>{toast.title}</span>
            {toast.type === 'streak' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
          </h4>
          <p className="text-xs text-stone-300 mt-0.5 leading-snug">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss();
          }}
          className="text-stone-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Dismiss toast"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
