import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ChildSelector.jsx — ECCII logo palette
 * "Who is taking this?" — gold-tinted selector panel
 */
export default function ChildSelector({
    children = [], selectedId, onChange,
    existingSubs = {}, activityTitle, required = false, error,
}) {
    if (!children.length) {
        return (
            <div
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                    background:  '#fdefd4',
                    border:      '1px solid rgba(184,112,16,0.30)',
                }}
            >
                <UserPlus size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#b87010' }} />
                <p className="text-[13px]" style={{ color: '#7a4800' }}>
                    No child profiles found. Please{' '}
                    <a href="/children/create" className="font-bold underline" style={{ color: '#0d1f5c' }}>
                        add a child profile
                    </a>{' '}
                    first.
                </p>
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-4"
            style={{
                background:   '#fdefd4',
                border:       `1px solid ${error ? '#c0201e' : 'rgba(184,112,16,0.28)'}`,
                boxShadow:    error ? '0 0 0 3px rgba(192,32,30,0.10)' : 'none',
            }}
        >
            {/* Label */}
            <p
                className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7a4800' }}
            >
                {activityTitle
                    ? `"${activityTitle}" — Who is taking this?`
                    : 'Who is taking this activity?'
                }
            </p>

            {/* Child chips */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select a child">
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
                            aria-pressed={isSelected}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
                            style={{
                                fontFamily:  "'Outfit', sans-serif",
                                fontWeight:  isSelected ? '700' : '500',
                                background:  isSelected ? '#e8a020' : isAlready ? 'rgba(13,31,92,0.06)' : '#ffffff',
                                borderColor: isSelected ? '#e8a020' : 'rgba(184,112,16,0.30)',
                                color:       isSelected ? '#0d1f5c' : isAlready ? 'rgba(13,31,92,0.35)' : '#7a4800',
                                cursor:      isAlready ? 'not-allowed' : 'pointer',
                                opacity:     isAlready ? 0.70 : 1,
                            }}
                        >
                            <span
                                className="w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                style={{
                                    background: isSelected ? 'rgba(0,0,0,0.15)' : (child.avatar_color || '#e8a020'),
                                    color:      isSelected ? '#0d1f5c' : '#ffffff',
                                }}
                            >
                                {child.name.charAt(0).toUpperCase()}
                            </span>

                            {child.name}

                            {isAlready && sub?.score !== undefined && (
                                <span
                                    className="flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                                    style={{ background: '#ddf0e4', color: '#145c32' }}
                                >
                                    <CheckCircle2 size={8} />
                                    {sub.score}pts
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {required && !selectedId && !error && (
                <p className="flex items-center gap-1 text-[11px] mt-2.5 font-medium" style={{ color: '#7a4800' }}>
                    <AlertCircle size={11} />
                    Please select a child before starting.
                </p>
            )}

            {error && (
                <p role="alert" className="flex items-center gap-1 text-[12px] mt-2.5 font-semibold" style={{ color: '#8c1816' }}>
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
}