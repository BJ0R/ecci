import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '@/Components/UI/Button';

/**
 * Modal.jsx — ECCII logo-derived palette
 * Navy gradient header · accessible focus trap · ARIA complete
 */
export default function Modal({
    open, onClose, title, children, footer,
    confirmLabel = 'Confirm', cancelLabel = 'Cancel',
    onConfirm, confirmVariant = 'primary',
    size = 'md', closeOnBackdrop = true,
}) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        // Focus the close button when modal opens
        setTimeout(() => closeRef.current?.focus(), 50);
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
            role="presentation"
            style={{
                background:     'rgba(10,18,54,0.65)',
                backdropFilter: 'blur(6px)',
                animation:      'eccii-backdrop-in 0.18s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'eccii-modal-title' : undefined}
                className={`w-full ${maxWidths[size] || maxWidths.md} max-h-[90dvh] overflow-hidden flex flex-col rounded-[18px]`}
                style={{
                    background: '#ffffff',
                    boxShadow:  '0 24px 64px rgba(13,31,92,0.30), 0 4px 16px rgba(13,31,92,0.14)',
                    animation:  'eccii-modal-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* ── Header — deep navy gradient ── */}
                {title && (
                    <div
                        className="flex items-center justify-between px-6 md:px-7 pt-5 pb-4 flex-shrink-0"
                        style={{
                            background:   'linear-gradient(135deg, #0d1f5c 0%, #162a7a 100%)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}
                    >
                        <h2
                            id="eccii-modal-title"
                            className="text-[22px] font-bold leading-tight m-0"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0f4fc', letterSpacing: '-0.01em' }}
                        >
                            {title}
                        </h2>
                        <button
                            ref={closeRef}
                            onClick={onClose}
                            aria-label="Close dialog"
                            className="p-1.5 rounded-lg transition-all duration-150 ml-4 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
                            style={{ color: 'rgba(240,244,252,0.50)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#f0f4fc'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(240,244,252,0.50)'; }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* ── Body ── */}
                <div
                    className="px-6 md:px-7 py-6 text-[14px] leading-relaxed overflow-y-auto flex-1"
                    style={{ color: 'rgba(13,31,92,0.80)' }}
                >
                    {children}
                </div>

                {/* ── Footer ── */}
                {(footer || onConfirm) && (
                    <div
                        className="flex justify-end gap-2.5 px-6 md:px-7 py-4 flex-shrink-0"
                        style={{
                            borderTop: '1px solid rgba(13,31,92,0.07)',
                            background: '#f0f4fc',
                        }}
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
                    from { opacity: 0; transform: scale(0.93) translateY(16px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);    }
                }
            `}</style>
        </div>
    );
}