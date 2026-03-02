import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/Components/UI/Button';

/**
 * Modal.jsx — Tailwind CSS + Lucide icons
 * Accessible modal: ESC key, backdrop click, body scroll lock, animations.
 */
export default function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    confirmLabel    = 'Confirm',
    cancelLabel     = 'Cancel',
    onConfirm,
    confirmVariant  = 'primary',
    size            = 'md',
    closeOnBackdrop = true,
}) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const maxWidths = { sm: 'max-w-sm', md: 'max-w-[520px]', lg: 'max-w-2xl' };

    return (
        <div
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{
                background:     'rgba(13,13,13,0.55)',
                backdropFilter: 'blur(4px)',
                animation:      'eccii-backdrop-in 0.18s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="eccii-modal-title"
                className={`
                    w-full ${maxWidths[size] || maxWidths.md}
                    max-h-[90dvh] overflow-y-auto
                    rounded-[16px] overflow-hidden
                `}
                style={{
                    background: 'var(--white)',
                    boxShadow:  'var(--shadow-lg)',
                    animation:  'eccii-modal-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Header */}
                {title && (
                    <div
                        className="flex items-center justify-between px-6 md:px-7 pt-5 pb-4 border-b"
                        style={{ borderColor: 'var(--border-lt)' }}
                    >
                        <h2
                            id="eccii-modal-title"
                            className="text-[22px] font-bold leading-tight m-0"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)', letterSpacing: '-0.01em' }}
                        >
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                            style={{ color: 'var(--ink-50)' }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div
                    className="px-6 md:px-7 py-5 text-[14px] leading-relaxed"
                    style={{ color: 'var(--ink-80)' }}
                >
                    {children}
                </div>

                {/* Footer */}
                {(footer || onConfirm) && (
                    <div
                        className="flex justify-end gap-2.5 px-6 md:px-7 py-4 border-t"
                        style={{ borderColor: 'var(--border-lt)' }}
                    >
                        {footer || (
                            <>
                                <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
                                <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes eccii-backdrop-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes eccii-modal-in {
                    from { opacity: 0; transform: scale(0.92) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);    }
                }
            `}</style>
        </div>
    );
}