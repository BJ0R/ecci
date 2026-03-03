import { Medal } from 'lucide-react';

/**
 * BadgeChip.jsx — ECCII logo palette
 * Gold flame ring · navy locked state · crimson "new" pulse dot
 */
export default function BadgeChip({ badge, awardedAt, size = 'md', showTooltip = true, locked = false }) {
    if (!badge) return null;

    const sizes = {
        sm: { outer: 'w-8 h-8',   icon: 14, fontSize: '9px'  },
        md: { outer: 'w-11 h-11', icon: 20, fontSize: '10px' },
        lg: { outer: 'w-14 h-14', icon: 26, fontSize: '11px' },
    };
    const s        = sizes[size] || sizes.md;
    const isEmoji  = badge.icon && /\p{Emoji}/u.test(badge.icon);
    const isRecent = !locked && awardedAt && isRecentlyEarned(awardedAt);
    const tooltip  = showTooltip
        ? `${badge.name}${badge.description ? ` — ${badge.description}` : ''}${awardedAt ? `\nEarned: ${new Date(awardedAt).toLocaleDateString()}` : ''}`
        : undefined;

    return (
        <div title={tooltip} className="relative inline-flex flex-col items-center gap-1 cursor-default">
            {/* Badge circle */}
            <div
                className={`${s.outer} rounded-full flex items-center justify-center transition-transform duration-200 ${!locked ? 'hover:scale-110' : ''}`}
                style={{
                    background:  locked ? '#e4eaf8' : '#fdefd4',
                    border:      `2px solid ${locked ? 'rgba(13,31,92,0.12)' : 'rgba(232,160,32,0.50)'}`,
                    boxShadow:   locked ? 'none' : '0 2px 10px rgba(232,160,32,0.22)',
                    filter:      locked ? 'grayscale(1)' : 'none',
                    opacity:     locked ? 0.45 : 1,
                }}
            >
                {isEmoji ? (
                    <span style={{ fontSize: `${s.icon}px`, lineHeight: 1 }}>{badge.icon}</span>
                ) : badge.icon && !badge.icon.startsWith('<') ? (
                    <img src={badge.icon} alt={badge.name} className="object-contain"
                        style={{ width: '60%', height: '60%' }} />
                ) : (
                    <Medal size={s.icon} style={{ color: locked ? 'rgba(13,31,92,0.35)' : '#b87010' }} />
                )}
            </div>

            {/* Badge name */}
            {size !== 'sm' && (
                <span
                    className="text-center max-w-[64px] truncate leading-tight block"
                    style={{
                        fontFamily:    "'JetBrains Mono', monospace",
                        fontSize:      s.fontSize,
                        letterSpacing: '0.04em',
                        color:         locked ? 'rgba(13,31,92,0.35)' : '#7a4800',
                        fontWeight:    600,
                    }}
                >
                    {badge.name}
                </span>
            )}

            {/* "New" pulse dot */}
            {isRecent && (
                <div
                    className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full"
                    style={{
                        background:  '#c0201e',
                        border:      '2px solid #ffffff',
                        animation:   'eccii-badge-pulse 1.8s ease-in-out infinite',
                    }}
                />
            )}

            <style>{`
                @keyframes eccii-badge-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(1.35); opacity: 0.65; }
                }
            `}</style>
        </div>
    );
}

function isRecentlyEarned(awardedAt) {
    if (!awardedAt) return false;
    return Date.now() - new Date(awardedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
}