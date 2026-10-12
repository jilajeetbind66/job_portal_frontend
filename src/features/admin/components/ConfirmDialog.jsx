import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const Icon = confirmVariant === 'danger' ? AlertTriangle : Info;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07151A]/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-[#0D2224] border border-[#294341] rounded-2xl shadow-2xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border",
            confirmVariant === 'danger' 
              ? "bg-rose-950/40 border-rose-800/40 text-rose-400" 
              : "bg-[#102A2B] border-[#2F7D5B]/30 text-[#B9D8C4]"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#F7F8F5] mb-2">{title}</h3>
          <p className="text-sm text-[#91A6A0] mb-6 leading-relaxed">{message}</p>
          
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-[#8FAF9A] bg-[#102A2B] border border-[#294341] rounded-xl hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={clsx(
                "flex-1 px-4 py-2.5 text-xs font-semibold text-white rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2",
                confirmVariant === 'danger'
                  ? "bg-rose-700 hover:bg-rose-600 border border-rose-600/30"
                  : "bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50"
              )}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
