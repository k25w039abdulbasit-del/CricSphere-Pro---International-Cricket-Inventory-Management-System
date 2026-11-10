/**
 * CricSphere Pro - Toast Notification Container
 * Provides immediate visual feedback for live events, dismissals, and stack ops
 */

import React from 'react';
import { useCricket } from '../context/CricketContext';
import { CheckCircle2, AlertCircle, Info, Zap, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCricket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isWicket = toast.type === 'wicket';
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
              isWicket
                ? 'bg-red-950/90 text-red-100 border-red-700/80 shadow-red-950/40'
                : isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/80 shadow-emerald-950/40'
                : isError
                ? 'bg-rose-950/90 text-rose-100 border-rose-700/80 shadow-rose-950/40'
                : 'bg-slate-900/90 text-slate-100 border-slate-700 shadow-slate-950/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isWicket ? (
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight flex items-center justify-between">
                <span>{toast.title}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="opacity-70 hover:opacity-100 text-slate-300 ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs opacity-90 mt-1 leading-snug">
                {toast.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
