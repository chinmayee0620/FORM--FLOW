import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'xl',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-3xl shadow-modal border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] z-10`}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 h-8 w-8 rounded-full"
            aria-label="Close modal"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
