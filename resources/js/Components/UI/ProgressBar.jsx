import { useEffect, useState } from 'react';

/**
 * ProgressBar.jsx — Tailwind CSS
 * Animated progress bar: sage (default) | gold | sky | amber | rose
 */
export default function ProgressBar({
    value     = 0,
    label,
    showValue = true,
    color     = 'sage',
    height    = 6,
    animate   = true,
    className = '',
}) {
    const clamped  = Math.max(0, Math.min(100, value));
    const [rendered, setRendered] = useState(animate ? 0 : clamped);

    useEffect(() => {
        if (animate) {
            const t = setTimeout(() => setRendered(clamped), 60);
            return () => clearTimeout(t);
        }
    }, [clamped, animate]);

    const gradients = {
        sage:  'linear-gradient(90deg, #3E6B52, #6A9E7F)',
        gold:  'linear-gradient(90deg, #B8923A, #D4AE60)',
        sky:   'linear-gradient(90deg, #2B5F82, #5D90B3)',
        amber: 'linear-gradient(90deg, #C06A1A, #E8913A)',
        rose:  'linear-gradient(90deg, #B84848, #D47070)',
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label row */}
            {(label || showValue) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && (
                        <span className="text-[11px] font-medium" style={{ color: 'var(--ink-50)' }}>
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span
                            className="text-[10px] ml-auto"
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
                style={{ height: `${height}px`, background: 'var(--cream-2)' }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width:      `${rendered}%`,
                        background: gradients[color] || gradients.sage,
                        transition: animate ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                />
            </div>
        </div>
    );
}