import { Medal } from 'lucide-react';

/**
 * BadgeChip.jsx — Tailwind CSS + Lucide icons
 * Visual badge chip for child progress cards and sidebar.
 */
export default function BadgeChip({ badge, awardedAt, size = 'md', showTooltip = true, locked = false }) {
    if (!badge) return null;

    const sizes = {
        sm: { outer: 'w-8 h-8',   icon: 14, fontSize: 'text-[9px]'  },
        md: { outer: 'w-11 h-11', icon: 20, fontSize: 'text-[10px]' },
        lg: { outer: 'w-14 h-14', icon: 26, fontSize: 'text-[11px]' },
    };
    const s = sizes[size] || sizes.md;

    const isEmoji    = badge.icon && /\p{Emoji}/u.test(badge.icon);
    const isRecent   = !locked && awardedAt && isRecentlyEarned(awardedAt);
    const tooltip    = showTooltip
        ? `${badge.name}${badge.description ? ` — ${badge.description}` : ''}${awardedAt ? `\nEarned: ${new Date(awardedAt).toLocaleDateString()}` : ''}`
        : undefined;

    return (
        <div
            title={tooltip}
            className="relative inline-flex flex-col items-center gap-1 cursor-default"
        >
            {/* Badge circle */}
            <div
                className={`
                    ${s.outer} rounded-full flex items-center justify-center
                    transition-transform duration-200
                    ${locked ? 'border border-[var(--border)] grayscale opacity-45' : 'border border-[var(--gold-lt)] hover:scale-110'}
                `}
                style={{
                    background: locked ? 'var(--cream-3)' : 'var(--gold-pale)',
                    boxShadow:  locked ? 'none' : '0 2px 8px rgba(184,146,58,0.2)',
                }}
            >
                {isEmoji ? (
                    <span style={{ fontSize: `${s.icon}px`, lineHeight: 1 }}>{badge.icon}</span>
                ) : badge.icon && !badge.icon.startsWith('<') ? (
                    <img
                        src={badge.icon}
                        alt={badge.name}
                        className="object-contain"
                        style={{ width: '60%', height: '60%', opacity: locked ? 0.4 : 1 }}
                    />
                ) : (
                    <Medal size={s.icon} style={{ color: locked ? 'var(--ink-50)' : 'var(--gold)' }} />
                )}
            </div>

            {/* Badge name (md and lg only) */}
            {size !== 'sm' && (
                <div
                    className={`${s.fontSize} text-center max-w-[64px] truncate leading-tight`}
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.04em',
                        color: locked ? 'var(--ink-50)' : 'var(--amber)',
                    }}
                >
                    {badge.name}
                </div>
            )}

            {/* "New" pulse dot for recently earned */}
            {isRecent && (
                <div
                    className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ background: 'var(--rose)', animation: 'eccii-pulse 1.8s ease-in-out infinite' }}
                />
            )}

            <style>{`
                @keyframes eccii-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%       { transform: scale(1.3); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}

function isRecentlyEarned(awardedAt) {
    if (!awardedAt) return false;
    return Date.now() - new Date(awardedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
}