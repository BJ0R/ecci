import { BookOpen, Check, Clock, ChevronRight } from 'lucide-react';
import Badge from '@/Components/UI/Badge';

/**
 * VerseCard.jsx — Tailwind CSS + Lucide icons
 * Dark ink verse block + per-child memorization tracker.
 */
export default function VerseCard({
    verse,
    completions    = [],
    children       = [],
    activeChildId,
    onMarkComplete,
    compact        = false,
}) {
    if (!verse) return null;

    const memorizedSet  = new Set(completions.map(c => c.child_profile_id));
    const activeMemorized = memorizedSet.has(activeChildId);

    return (
        <div
            className="rounded-[14px] overflow-hidden border"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
            {/* Dark verse block */}
            <div className={compact ? 'p-4' : 'p-6'} style={{ background: 'var(--ink)' }}>
                {/* Week label */}
                <div
                    className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold-lt)' }}
                >
                    <span className="inline-block w-4 h-px flex-shrink-0" style={{ background: 'var(--gold)' }} />
                    <BookOpen size={10} style={{ color: 'var(--gold)' }} />
                    Week {verse.week_number} · Memory Verse
                </div>

                {/* Verse text */}
                <blockquote
                    className={`italic leading-relaxed mb-3.5 ${compact ? 'text-sm' : 'text-[17px]'}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream)', margin: 0 }}
                >
                    "{verse.verse_text}"
                </blockquote>

                {/* Reference */}
                <div
                    className="text-[9px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold-lt)' }}
                >
                    {verse.reference}
                </div>
            </div>

            {/* Context note */}
            {!compact && verse.context_note && (
                <div
                    className="px-6 py-3.5 text-[13px] leading-relaxed border-b"
                    style={{ background: 'var(--cream-2)', color: 'var(--ink-80)', borderColor: 'var(--border)' }}
                >
                    {verse.context_note}
                </div>
            )}

            {/* Children memorization status */}
            {children.length > 0 && (
                <div
                    className={`border-t ${compact ? 'px-4 py-3' : 'px-6 py-4'}`}
                    style={{ background: 'var(--white)', borderColor: 'var(--border-lt)' }}
                >
                    <div
                        className="text-[9px] tracking-[0.12em] uppercase mb-2.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}
                    >
                        Memorization Status
                    </div>

                    <div className="flex flex-col gap-0">
                        {children.map(child => {
                            const done = memorizedSet.has(child.id);
                            return (
                                <div
                                    key={child.id}
                                    className="flex items-center justify-between py-1.5 border-b last:border-b-0"
                                    style={{ borderColor: 'var(--border-lt)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ background: done ? 'var(--gold)' : 'var(--amber)' }}
                                        />
                                        <span
                                            className={`text-[13px] ${child.id === activeChildId ? 'font-semibold' : 'font-normal'}`}
                                            style={{ color: 'var(--ink-80)' }}
                                        >
                                            {child.name}
                                        </span>
                                    </div>

                                    {done ? (
                                        <Badge status="completed" size="xs">
                                            <Check size={9} className="mr-0.5" />
                                            Memorized
                                        </Badge>
                                    ) : child.id === activeChildId && onMarkComplete ? (
                                        <button
                                            onClick={() => onMarkComplete(verse.id, child.id)}
                                            className="flex items-center gap-0.5 text-[11px] font-semibold transition-colors hover:opacity-70"
                                            style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            Mark memorized
                                            <ChevronRight size={12} />
                                        </button>
                                    ) : (
                                        <Badge status="pending" size="xs">
                                            <Clock size={9} className="mr-0.5" />
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}