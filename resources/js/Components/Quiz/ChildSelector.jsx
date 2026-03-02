import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ChildSelector.jsx — Tailwind CSS + Lucide icons
 * "Who is taking this quiz?" chip selector.
 */
export default function ChildSelector({
    children       = [],
    selectedId,
    onChange,
    existingSubs   = {},
    activityTitle,
    required       = false,
    error,
}) {
    if (!children.length) {
        return (
            <div
                className="flex items-start gap-3 rounded-lg p-4 border"
                style={{ background: 'var(--amber-pale)', borderColor: '#E8C87A' }}
            >
                <UserPlus size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--amber)' }} />
                <p className="text-[13px]" style={{ color: 'var(--amber)' }}>
                    No child profiles found. Please{' '}
                    <a href="/children/create" className="font-semibold underline" style={{ color: 'var(--gold)' }}>
                        add a child profile
                    </a>{' '}
                    first.
                </p>
            </div>
        );
    }

    return (
        <div
            className="rounded-lg p-4 border"
            style={{
                background:  'var(--amber-pale)',
                borderColor: error ? 'var(--rose)' : '#E8C87A',
            }}
        >
            {/* Banner */}
            <div
                className="text-[10px] font-bold tracking-[0.08em] uppercase mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--amber)' }}
            >
                {activityTitle
                    ? `"${activityTitle}" — Who is taking this?`
                    : 'Who is taking this activity?'
                }
            </div>

            {/* Child chips */}
            <div className="flex flex-wrap gap-1.5">
                {children.map(child => {
                    const sub        = existingSubs[child.id];
                    const isAlready  = !!sub;
                    const isSelected = child.id === selectedId;

                    return (
                        <button
                            key={child.id}
                            type="button"
                            disabled={isAlready}
                            onClick={() => !isAlready && onChange?.(child.id)}
                            className={`
                                inline-flex items-center gap-1.5 rounded-full text-[12px]
                                border transition-all duration-150
                                ${isAlready ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                                ${isSelected ? 'font-bold' : 'font-medium'}
                                ${isAlready ? 'px-3 py-1' : 'px-3.5 py-1'}
                            `}
                            style={{
                                fontFamily:  "'Outfit', sans-serif",
                                background:  isSelected ? 'var(--gold)' : isAlready ? 'var(--cream-2)' : 'var(--white)',
                                borderColor: isSelected ? 'var(--gold)' : '#E8C87A',
                                color:       isSelected ? 'var(--ink)'  : isAlready ? 'var(--ink-50)'  : 'var(--amber)',
                            }}
                        >
                            {/* Initials dot */}
                            <span
                                className="w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                style={{
                                    background: isSelected ? 'rgba(0,0,0,0.15)' : (child.avatar_color || 'var(--gold)'),
                                    color:      isSelected ? 'var(--ink)' : 'var(--cream)',
                                }}
                            >
                                {child.name.charAt(0).toUpperCase()}
                            </span>

                            {child.name}

                            {/* Already submitted score */}
                            {isAlready && sub?.score !== undefined && (
                                <span
                                    className="flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded text-[9px]"
                                    style={{
                                        fontFamily:  "'JetBrains Mono', monospace",
                                        background:  'var(--sage-pale)',
                                        color:       'var(--sage)',
                                    }}
                                >
                                    <CheckCircle2 size={8} />
                                    {sub.score}pts
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Hint */}
            {required && !selectedId && !error && (
                <p className="flex items-center gap-1 text-[11px] mt-2" style={{ color: 'var(--amber)' }}>
                    <AlertCircle size={11} />
                    Please select a child before starting.
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="flex items-center gap-1 text-[11px] mt-2" style={{ color: 'var(--rose)' }}>
                    <AlertCircle size={11} />
                    {error}
                </p>
            )}
        </div>
    );
}