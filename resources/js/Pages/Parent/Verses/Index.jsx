// resources/js/Pages/Parent/Verses/Index.jsx
// Rendered by: App\Http\Controllers\Parent\VerseController@index
// Route: GET /verses  (name: parent.verses.index)

import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Components/Layout/AppLayout';

/**
 * Props from VerseController@index:
 *   verses      — MemoryVerse[]  { id, verse_text, reference, week_number, context_note }
 *   children    — ChildProfile[] { id, name, avatar_color }
 *   completions — { [memory_verse_id]: [{ child_profile_id, memorized_at }] }
 *
 * NOTE: VerseCard import removed — rendered inline to avoid crashes
 * if that component file doesn't exist yet.
 */
export default function VersesIndex({ verses = [], children: kids = [], completions = {} }) {
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(null); // verse id being marked

    function markComplete(verseId, childProfileId) {
        setLoading(verseId);
        router.post(`/verses/${verseId}/complete`, { child_profile_id: childProfileId }, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    }

    // Family-level stats
    const totalVerses = verses.length;
    const childStats  = kids.map(child => {
        const done = verses.filter(v => (completions[v.id] ?? []).some(c => c.child_profile_id === child.id)).length;
        return { child, done, pct: totalVerses > 0 ? Math.round((done / totalVerses) * 100) : 0 };
    });

    return (
        <AppLayout>
            <Head title="Memory Verses — ECCII" />

            {/* Flash */}
            {flash?.success && (
                <div style={{ background: '#EBF7EE', border: '1px solid #C2DEC8', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: '#3E6B52', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✓ {flash.success}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>
                    Scripture
                </div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>
                    Memory Verses
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--ink-50)', lineHeight: 1.55, margin: 0 }}>
                    Weekly scriptures for your family to memorise together.
                    Mark each child when they've learned their verse.
                </p>
            </div>

            {/* Family progress cards */}
            {kids.length > 0 && totalVerses > 0 && (
                <div style={{ background: 'var(--ink)', borderRadius: '14px', padding: '20px 24px', marginBottom: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {childStats.map(({ child, done, pct }) => (
                        <div key={child.id} style={{ textAlign: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 8px', background: child.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Cormorant Garamond', serif" }}>
                                {child.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                                {done}/{totalVerses}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.5)', marginTop: '2px' }}>
                                {child.name} · {pct}%
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No verses empty state */}
            {verses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '56px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', color: 'var(--ink-50)' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>✝️</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--ink)' }}>
                        No verses posted yet
                    </div>
                    <p style={{ fontSize: '13px', margin: 0 }}>Your church admin will post weekly memory verses here.</p>
                </div>
            )}

            {/* Verses list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {verses.map(verse => {
                    const verseCompletions = completions[verse.id] ?? [];
                    return (
                        <VerseItem
                            key={verse.id}
                            verse={verse}
                            kids={kids}
                            verseCompletions={verseCompletions}
                            onMark={(childId) => markComplete(verse.id, childId)}
                            isLoading={loading === verse.id}
                        />
                    );
                })}
            </div>
        </AppLayout>
    );
}

/* ── Inline verse card (replaces VerseCard import) ───────────────────────── */
function VerseItem({ verse, kids, verseCompletions, onMark, isLoading }) {
    const doneChildIds = new Set(verseCompletions.map(c => c.child_profile_id));
    const allDone      = kids.length > 0 && kids.every(c => doneChildIds.has(c.id));

    return (
        <div style={{ background: 'var(--white)', border: `1px solid ${allDone ? '#C2DEC8' : 'var(--border)'}`, borderRadius: '14px', overflow: 'hidden' }}>
            {/* Top bar */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-lt)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: allDone ? '#EBF7EE' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: allDone ? '#3E6B52' : 'var(--gold)', fontWeight: 700 }}>
                        Week {verse.week_number}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: allDone ? '#3E6B52' : 'var(--ink-50)', fontWeight: 600 }}>
                        {verse.reference}
                    </span>
                </div>
                {allDone && kids.length > 0 && (
                    <span style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#3E6B52', letterSpacing: '0.08em' }}>
                        ✓ ALL DONE
                    </span>
                )}
            </div>

            {/* Verse text */}
            <div style={{ padding: '20px' }}>
                <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.8, borderLeft: '3px solid var(--gold)', paddingLeft: '16px', margin: '0 0 6px' }}>
                    {verse.verse_text}
                </blockquote>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--gold)', fontWeight: 600, paddingLeft: '20px' }}>
                    — {verse.reference}
                </div>

                {verse.context_note && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border-lt)', fontSize: '12px', color: 'var(--ink-50)', lineHeight: 1.6 }}>
                        📖 {verse.context_note}
                    </div>
                )}
            </div>

            {/* Per-child completion row */}
            {kids.length > 0 && (
                <div style={{ padding: '0 20px 18px' }}>
                    <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-50)', marginBottom: '10px' }}>
                        Mark as memorized
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {kids.map(child => {
                            const isDone = doneChildIds.has(child.id);
                            const completion = verseCompletions.find(c => c.child_profile_id === child.id);
                            return (
                                <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    {isDone ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 12px', borderRadius: '8px', background: '#EBF7EE', border: '1px solid #C2DEC8' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: child.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
                                                {child.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#3E6B52' }}>{child.name} ✓</div>
                                                {completion?.memorized_at && (
                                                    <div style={{ fontSize: '9px', color: '#3E6B52', opacity: 0.7 }}>
                                                        {new Date(completion.memorized_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => !isLoading && onMark(child.id)}
                                            disabled={isLoading}
                                            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 12px', borderRadius: '8px', background: 'var(--cream)', border: '1px solid var(--border)', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: "'Outfit', sans-serif' " }}
                                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.borderColor = '#3E6B52'; e.currentTarget.style.background = '#EBF7EE'; } }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--cream)'; }}
                                        >
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: child.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
                                                {child.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                                                {isLoading ? '…' : `${child.name} learned it!`}
                                            </span>
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