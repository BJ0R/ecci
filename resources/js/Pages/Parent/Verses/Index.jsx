// resources/js/Pages/Parent/Verses/Index.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, Check, Clock, ChevronRight } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

export default function VersesIndex({ verses = [], children: kids = [], completions = {} }) {
    const { flash }    = usePage().props;
    const [loading, setLoading] = useState(null);

    function markComplete(verseId, childProfileId) {
        setLoading(verseId);
        router.post(`/verses/${verseId}/complete`, { child_profile_id: childProfileId }, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    }

    const totalVerses = verses.length;
    const childStats  = kids.map(child => {
        const done = verses.filter(v => (completions[v.id] ?? []).some(c => c.child_profile_id === child.id)).length;
        return { child, done, pct: totalVerses > 0 ? Math.round((done / totalVerses) * 100) : 0 };
    });

    return (
        <AppLayout>
            <Head title="Memory Verses — ECCII" />

            {/* ── Flash ─────────────────────────────────────── */}
            {flash?.success && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[12px] font-medium mb-4"
                    style={{ background: '#ddf0e4', border: '1px solid rgba(30,110,66,0.25)', color: '#145c32' }}>
                    <Check size={13} className="flex-shrink-0" />
                    {flash.success}
                </div>
            )}

            {/* ── Header ────────────────────────────────────── */}
            <div className="mb-4">
                <p className="text-[9px] tracking-[0.22em] uppercase font-bold m-0 mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e8a020' }}>
                    Scripture
                </p>
                <h1 className="text-[26px] font-bold m-0 leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#0d1f5c' }}>
                    Memory Verses
                </h1>
                <p className="text-[12px] mt-1 m-0 leading-relaxed" style={{ color: 'rgba(13,31,92,0.50)' }}>
                    Weekly scriptures for your family to memorise together.
                </p>
            </div>

            {/* ── Family progress panel (navy) ──────────────── */}
            {kids.length > 0 && totalVerses > 0 && (
                <div className="rounded-[13px] overflow-hidden mb-4"
                    style={{ boxShadow: '0 4px 20px rgba(13,31,92,0.18)' }}>

                    {/* Panel header */}
                    <div className="px-4 py-2.5 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, #0d1f5c, #162a7a)' }}>
                        <p className="text-[9px] tracking-[0.20em] uppercase font-bold m-0"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e8a020' }}>
                            Family Progress
                        </p>
                        <p className="text-[10px] m-0"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(240,244,252,0.35)' }}>
                            {totalVerses} verse{totalVerses !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div
                        className="px-4 py-4 grid gap-3"
                        style={{
                            background: 'linear-gradient(175deg, #101e5a 0%, #080f30 100%)',
                            gridTemplateColumns: `repeat(${Math.min(kids.length, 4)}, 1fr)`,
                        }}>
                        {childStats.map(({ child, done, pct }) => (
                            <div key={child.id} className="flex flex-col items-center gap-2">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full flex items-center justify-center text-[17px] font-bold"
                                    style={{
                                        background:  child.avatar_color || '#e8a020',
                                        color:       '#0d1f5c',
                                        fontFamily:  "'Cormorant Garamond', serif",
                                        boxShadow:   `0 2px 10px ${child.avatar_color || '#e8a020'}50`,
                                    }}>
                                    {child.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Progress ring substitute — bar */}
                                <div className="w-full rounded-full overflow-hidden"
                                    style={{ height: '4px', background: 'rgba(255,255,255,0.10)' }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width:      `${pct}%`,
                                            background: `linear-gradient(90deg, ${child.avatar_color || '#e8a020'}, ${child.avatar_color || '#e8a020'}cc)`,
                                        }} />
                                </div>

                                <div className="text-center">
                                    <p className="text-[16px] font-bold m-0 leading-none"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            color:      child.avatar_color || '#e8a020',
                                        }}>
                                        {done}/{totalVerses}
                                    </p>
                                    <p className="text-[9px] m-0 mt-0.5 truncate max-w-[70px]"
                                        style={{ color: 'rgba(240,244,252,0.42)', fontFamily: "'JetBrains Mono', monospace" }}>
                                        {child.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ───────────────────────────────── */}
            {verses.length === 0 && (
                <div className="text-center py-10 rounded-[13px] border"
                    style={{ background: '#ffffff', border: '1px solid rgba(13,31,92,0.09)', color: 'rgba(13,31,92,0.45)' }}>
                    <div className="text-[32px] mb-2">✝️</div>
                    <h3 className="text-[18px] font-bold mb-1 m-0"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#0d1f5c' }}>
                        No verses posted yet
                    </h3>
                    <p className="text-[12px] m-0" style={{ color: 'rgba(13,31,92,0.45)' }}>
                        Your church admin will post weekly memory verses here.
                    </p>
                </div>
            )}

            {/* ── Verses list ───────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {verses.map(verse => {
                    const verseCompletions = completions[verse.id] ?? [];
                    return (
                        <VerseItem
                            key={verse.id}
                            verse={verse}
                            kids={kids}
                            verseCompletions={verseCompletions}
                            onMark={childId => markComplete(verse.id, childId)}
                            isLoading={loading === verse.id}
                        />
                    );
                })}
            </div>
        </AppLayout>
    );
}

/* ── VerseItem ───────────────────────────────────────────────────────── */
function VerseItem({ verse, kids, verseCompletions, onMark, isLoading }) {
    const doneChildIds = new Set(verseCompletions.map(c => c.child_profile_id));
    const allDone      = kids.length > 0 && kids.every(c => doneChildIds.has(c.id));
    const doneSome     = !allDone && kids.some(c => doneChildIds.has(c.id));

    const borderColor = allDone ? 'rgba(30,110,66,0.30)' : doneSome ? 'rgba(232,160,32,0.25)' : 'rgba(13,31,92,0.09)';

    return (
        <div className="rounded-[13px] overflow-hidden transition-all duration-200"
            style={{
                background: '#ffffff',
                border:     `1px solid ${borderColor}`,
                boxShadow:  allDone
                    ? '0 2px 12px rgba(30,110,66,0.10)'
                    : '0 1px 4px rgba(13,31,92,0.06)',
            }}>

            {/* ── Dark verse block ─────────────────────────── */}
            <div className="relative overflow-hidden"
                style={{ background: 'linear-gradient(150deg, #0d1f5c 0%, #0a1540 65%, #080f30 100%)' }}>

                {/* Dot texture */}
                <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

                {/* Completed ribbon */}
                {allDone && (
                    <div className="absolute top-0 right-0">
                        <div className="px-3 py-1 text-[8px] font-bold uppercase tracking-widest"
                            style={{
                                background:   '#1e6e42',
                                color:        '#fff',
                                fontFamily:   "'JetBrains Mono', monospace",
                                borderBottomLeftRadius: '8px',
                            }}>
                            ✓ All Done
                        </div>
                    </div>
                )}

                <div className="relative z-10 px-5 pt-4 pb-4">
                    {/* Week label */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block w-3 h-px" style={{ background: '#e8a020' }} />
                        <BookOpen size={10} style={{ color: '#e8a020' }} />
                        <span className="text-[9px] tracking-[0.20em] uppercase font-bold"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e8a020' }}>
                            Week {verse.week_number} · Memory Verse
                        </span>
                    </div>

                    {/* Verse text — largest, most important */}
                    <blockquote className="text-[19px] italic leading-relaxed m-0 mb-3"
                        style={{
                            fontFamily:   "'Cormorant Garamond', serif",
                            color:        '#f0f4fc',
                            borderLeft:   '3px solid rgba(232,160,32,0.55)',
                            paddingLeft:  '16px',
                        }}>
                        "{verse.verse_text}"
                    </blockquote>

                    {/* Reference */}
                    <cite className="not-italic text-[10px] tracking-[0.16em] uppercase font-bold block pl-5"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,160,32,0.70)' }}>
                        — {verse.reference}
                    </cite>
                </div>
            </div>

            {/* ── Context note ─────────────────────────────── */}
            {verse.context_note && (
                <div className="px-5 py-3 text-[12px] leading-relaxed border-b italic"
                    style={{
                        background:   '#f0f4fc',
                        borderColor:  'rgba(13,31,92,0.07)',
                        color:        'rgba(13,31,92,0.65)',
                    }}>
                    📖 {verse.context_note}
                </div>
            )}

            {/* ── Per-child tracker ────────────────────────── */}
            {kids.length > 0 && (
                <div className="px-5 py-3.5" style={{ background: '#ffffff' }}>
                    <p className="text-[9px] tracking-[0.16em] uppercase font-bold mb-2.5 m-0"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(13,31,92,0.38)' }}>
                        Memorization Status
                    </p>

                    <div className="flex flex-col gap-0">
                        {kids.map(child => {
                            const isDone    = doneChildIds.has(child.id);
                            const comp      = verseCompletions.find(c => c.child_profile_id === child.id);
                            const isDark    = ['#0d1f5c','#1e6e42','#1a5c8a','#c0201e','#154e78'].includes(child.avatar_color);

                            return (
                                <div key={child.id}
                                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                                    style={{ borderColor: 'rgba(13,31,92,0.06)' }}>

                                    {/* Child info */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                                            style={{
                                                background: isDone ? (child.avatar_color || '#e8a020') : 'rgba(13,31,92,0.08)',
                                                color:      isDone ? (isDark ? '#fff' : '#0d1f5c') : 'rgba(13,31,92,0.40)',
                                                boxShadow:  isDone ? `0 1px 6px ${child.avatar_color || '#e8a020'}50` : 'none',
                                            }}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold m-0" style={{ color: '#0d1f5c' }}>
                                                {child.name}
                                            </p>
                                            {isDone && comp?.memorized_at && (
                                                <p className="text-[9px] m-0"
                                                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(13,31,92,0.38)' }}>
                                                    {new Date(comp.memorized_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status / CTA */}
                                    {isDone ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase"
                                            style={{ background: '#ddf0e4', color: '#145c32', fontFamily: "'JetBrains Mono', monospace" }}>
                                            <Check size={9} /> Memorized
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => !isLoading && onMark(child.id)}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
                                            style={{
                                                background:  isLoading ? 'rgba(13,31,92,0.05)' : '#f0f4fc',
                                                borderColor: 'rgba(13,31,92,0.16)',
                                                color:       isLoading ? 'rgba(13,31,92,0.35)' : '#0d1f5c',
                                                cursor:      isLoading ? 'not-allowed' : 'pointer',
                                                fontFamily:  "'Outfit', sans-serif",
                                            }}
                                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = '#ddf0e4'; e.currentTarget.style.borderColor = 'rgba(30,110,66,0.30)'; e.currentTarget.style.color = '#145c32'; }}}
                                            onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = '#f0f4fc'; e.currentTarget.style.borderColor = 'rgba(13,31,92,0.16)'; e.currentTarget.style.color = '#0d1f5c'; }}}
                                        >
                                            {isLoading ? (
                                                <Clock size={10} />
                                            ) : (
                                                <>Mark memorized <ChevronRight size={10} /></>
                                            )}
                                        </button>
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