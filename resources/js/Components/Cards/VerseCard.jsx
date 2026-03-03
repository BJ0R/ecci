import { BookOpen, Check, Clock, ChevronRight } from 'lucide-react';
import Badge from '@/Components/UI/Badge';

/**
 * VerseCard.jsx — ECCII logo palette
 * Navy immersive verse block · white tracker · gold memorization CTA
 * Hierarchy: week label → verse text (large italic) → reference → tracker rows
 */
export default function VerseCard({
    verse, completions = [], children = [],
    activeChildId, onMarkComplete, compact = false,
}) {
    if (!verse) return null;
    const memorizedSet = new Set(completions.map(c => c.child_profile_id));

    return (
        <section
            className="rounded-[14px] overflow-hidden"
            style={{ border: '1px solid rgba(13,31,92,0.10)', boxShadow: 'var(--shadow-sm)' }}
        >
            {/* ── Navy verse block — highest hierarchy ── */}
            <div
                className={compact ? 'p-4' : 'px-6 py-6'}
                style={{ background: 'linear-gradient(150deg, #0d1f5c 0%, #0a1540 60%, #080f30 100%)' }}
            >
                {/* Week label */}
                <div
                    className="flex items-center gap-2 mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <span className="w-4 h-px" style={{ background: '#e8a020', display: 'inline-block' }} />
                    <BookOpen size={10} style={{ color: '#e8a020' }} />
                    <span
                        className="text-[9px] tracking-[0.22em] uppercase"
                        style={{ color: '#e8a020' }}
                    >
                        Week {verse.week_number} · Memory Verse
                    </span>
                </div>

                {/* Verse text — primary, largest */}
                <blockquote
                    className={`italic leading-relaxed mb-4 m-0 ${compact ? 'text-[14px]' : 'text-[19px]'}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0f4fc' }}
                >
                    "{verse.verse_text}"
                </blockquote>

                {/* Reference */}
                <cite
                    className="text-[10px] tracking-[0.18em] uppercase not-italic"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,160,32,0.80)' }}
                >
                    — {verse.reference}
                </cite>
            </div>

            {/* ── Context note ── */}
            {!compact && verse.context_note && (
                <div
                    className="px-6 py-4 text-[13px] leading-relaxed"
                    style={{
                        background:  '#f0f4fc',
                        borderBottom: '1px solid rgba(13,31,92,0.07)',
                        color:        'rgba(13,31,92,0.72)',
                        fontStyle:    'italic',
                    }}
                >
                    {verse.context_note}
                </div>
            )}

            {/* ── Memorization tracker ── */}
            {children.length > 0 && (
                <div
                    className={compact ? 'px-4 py-3' : 'px-6 py-4'}
                    style={{ background: '#ffffff' }}
                >
                    <p
                        className="text-[9px] tracking-[0.18em] uppercase mb-3 font-bold"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(13,31,92,0.40)' }}
                    >
                        Memorization Status
                    </p>

                    <div className="flex flex-col">
                        {children.map(child => {
                            const done      = memorizedSet.has(child.id);
                            const isActive  = child.id === activeChildId;
                            return (
                                <div
                                    key={child.id}
                                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                                    style={{ borderColor: 'rgba(13,31,92,0.06)' }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        {/* Avatar dot */}
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                            style={{
                                                background: done ? '#ddf0e4' : 'rgba(13,31,92,0.08)',
                                                color:      done ? '#145c32' : 'rgba(13,31,92,0.50)',
                                            }}
                                        >
                                            {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className="text-[13px]"
                                            style={{
                                                color:      'rgba(13,31,92,0.80)',
                                                fontWeight: isActive ? '700' : '400',
                                            }}
                                        >
                                            {child.name}
                                            {isActive && (
                                                <span className="ml-1.5 text-[9px] tracking-wide uppercase"
                                                    style={{ color: '#e8a020', fontFamily: "'JetBrains Mono', monospace" }}>
                                                    active
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {done ? (
                                        <Badge status="completed" size="xs">
                                            <Check size={9} />
                                            Memorized
                                        </Badge>
                                    ) : isActive && onMarkComplete ? (
                                        <button
                                            onClick={() => onMarkComplete(verse.id, child.id)}
                                            className="flex items-center gap-0.5 text-[11px] font-bold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020] rounded px-1"
                                            style={{ color: '#b87010', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            Mark memorized
                                            <ChevronRight size={12} />
                                        </button>
                                    ) : (
                                        <Badge status="pending" size="xs">
                                            <Clock size={9} />
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}