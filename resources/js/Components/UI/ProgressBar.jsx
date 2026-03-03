import { useEffect, useState } from 'react';

/**
 * ProgressBar.jsx — ECCII logo-derived palette
 * Navy-tinted track · logo-color fills · subtle inner shadow
 */
export default function ProgressBar({
    value = 0, label, showValue = true,
    color = 'sage', height = 6, animate = true, className = '',
}) {
    const clamped = Math.max(0, Math.min(100, value));
    const [rendered, setRendered] = useState(animate ? 0 : clamped);

    useEffect(() => {
        if (animate) {
            const t = setTimeout(() => setRendered(clamped), 60);
            return () => clearTimeout(t);
        }
    }, [clamped, animate]);

    const gradients = {
        sage:   'linear-gradient(90deg, #145c32 0%, #1e6e42 50%, #2e9a58 100%)',
        gold:   'linear-gradient(90deg, #b87010 0%, #e8a020 55%, #f2bc50 100%)',
        sky:    'linear-gradient(90deg, #154e78 0%, #1a5c8a 50%, #2878b8 100%)',
        amber:  'linear-gradient(90deg, #7a4800 0%, #b87010 55%, #e8901a 100%)',
        rose:   'linear-gradient(90deg, #8c1816 0%, #c0201e 55%, #d84040 100%)',
        navy:   'linear-gradient(90deg, #0d1f5c 0%, #1e3a9a 55%, #3058c8 100%)',
    };

    return (
        <div className={`w-full ${className}`} role="progressbar"
            aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}
            aria-label={label || `${clamped}% complete`}
        >
            {(label || showValue) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && (
                        <span className="text-[12px] font-medium" style={{ color: 'var(--ink-50)' }}>
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span
                            className="text-[11px] font-bold ml-auto"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}
                        >
                            {clamped}%
                        </span>
                    )}
                </div>
            )}

            {/* Track */}
            <div
                className="rounded-full overflow-hidden"
                style={{
                    height: `${height}px`,
                    background: 'rgba(13,31,92,0.09)',
                    boxShadow: 'inset 0 1px 2px rgba(13,31,92,0.08)',
                }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width:      `${rendered}%`,
                        background: gradients[color] || gradients.sage,
                        transition: animate ? 'width 0.65s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                        boxShadow:  rendered > 8 ? '0 1px 4px rgba(13,31,92,0.22)' : 'none',
                    }}
                />
            </div>
        </div>
    );
}