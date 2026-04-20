import React, { useEffect, useRef, useState } from 'react';
import { useModalStore } from '../store/useModalStore';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlobalModal: React.FC = () => {
  const { isOpen, options, closeModal } = useModalStore();
  const [inputValue, setInputValue] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && options?.type === 'prompt') {
      // eslint-disable-next-line
      setInputValue(options.defaultValue || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && options?.dismissible) {
        closeModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, closeModal]);

  if (!isOpen && !options) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && options?.dismissible) {
      closeModal(null);
    }
  };

  const getIcon = () => {
    switch (options?.type) {
      case 'info':
        return <Info className="w-6 h-6 text-secondary" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-error" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'confirm':
      case 'prompt':
        return <AlertTriangle className="w-6 h-6 text-tertiary" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 transition-all duration-200',
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      )}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl w-full max-w-md p-6 relative overflow-hidden transition-all duration-300',
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 rounded-full bg-surface-container-low shrink-0">{getIcon()}</div>
          <div className="flex-1 pt-1">
            <h3 className="font-headline font-bold text-lg text-on-surface">{options?.title}</h3>
            <p className="font-body text-sm text-on-surface-variant mt-2 leading-relaxed">
              {options?.message}
            </p>
          </div>
        </div>

        {/* Prompt Input */}
        {options?.type === 'prompt' && (
          <div className="mt-4 mb-6">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 font-body text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') closeModal(inputValue);
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 font-label text-sm uppercase tracking-[0.05em] font-bold">
          {(options?.type === 'confirm' || options?.type === 'prompt') && (
            <button
              onClick={() => closeModal(null)}
              className="px-5 py-2.5 rounded text-on-surface hover:bg-surface-container-low transition-colors active:scale-95"
            >
              {options?.cancelText}
            </button>
          )}

          <button
            onClick={() => {
              if (options?.type === 'prompt') {
                closeModal(inputValue);
              } else if (options?.type === 'confirm') {
                closeModal(true);
              } else {
                closeModal(true);
              }
            }}
            className={cn(
              'px-5 py-2.5 rounded shadow-sm hover:opacity-90 transition-all active:scale-95',
              options?.type === 'error'
                ? 'bg-error text-on-error'
                : 'bg-secondary text-on-secondary cta-gradient'
            )}
          >
            {options?.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
