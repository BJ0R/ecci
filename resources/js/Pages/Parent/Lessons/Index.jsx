// resources/js/Pages/Parent/Lessons/Index.jsx
// Rendered by: App\Http\Controllers\Parent\LessonViewController@index
// Route: GET /lessons  (name: parent.lessons.index)
// Optionally: GET /lessons?child_id={id}

import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Components/Layout/AppLayout';

/**
 * Props from LessonViewController@index:
 *   lessons — Lesson[] (published, age-filtered)
 *     { id, title, series, week_number, age_group,
 *       activities_count,
 *       content: { bible_reference } | null,
 *       progress: { status: 'viewed'|'completed' } | null }
 *   child   — ChildProfile { id, name, age, avatar_color } | null
 *
 * NOTE: LessonCard and ProgressBar imports removed — rendered inline
 * to avoid crashes if those component files don't exist yet.
 */
export default function LessonsIndex({ lessons = [], child = null }) {
    const [filter, setFilter] = useState('all');

    const totalLessons     = lessons.length;
    const completedLessons = lessons.filter(l => l.progress?.status === 'completed').length;
    const viewedLessons    = lessons.filter(l => l.progress?.status === 'viewed').length;
    const newLessons       = lessons.filter(l => !l.progress).length;
    const completionPct    = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const filtered =
        filter === 'new'       ? lessons.filter(l => !l.progress)
        : filter === 'viewed'  ? lessons.filter(l => l.progress?.status === 'viewed')
        : filter === 'done'    ? lessons.filter(l => l.progress?.status === 'completed')
        : lessons;

    const tabs = [
        { key: 'all',    label: 'All',          count: totalLessons     },
        { key: 'new',    label: 'New',           count: newLessons       },
        { key: 'viewed', label: 'In Progress',   count: viewedLessons    },
        { key: 'done',   label: 'Completed',     count: completedLessons },
    ];

    function ageGroupLabel(age) {
        if (!age) return '';
        if (age <= 5)  return 'Nursery';
        if (age <= 10) return 'Kids';
        return 'Youth';
    }

    return (
        <AppLayout>
            <Head title={`Lessons${child ? ` — ${child.name}` : ''} — ECCII`} />

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '5px' }}>
                    Lessons
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>
                            {child ? `${child.name}'s Lessons` : 'All Lessons'}
                        </h1>
                        {child && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    background: child.avatar_color || 'var(--gold)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '9px', fontWeight: 700, color: 'var(--ink)',
                                }}>
                                    {child.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '13px', color: 'var(--ink-50)' }}>
                                    {ageGroupLabel(child.age)} group · Age {child.age}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* No child state */}
            {!child && (
                <div style={{
                    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px',
                    padding: '40px', textAlign: 'center', color: 'var(--ink-50)', marginBottom: '24px',
                }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>👦</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--ink)' }}>
                        No child selected
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 16px' }}>
                        Add a child profile to start seeing lessons for their age group.
                    </p>
                    <Link href="/children/create" style={{
                        display: 'inline-block', padding: '9px 20px',
                        background: 'var(--ink)', color: 'var(--cream)',
                        textDecoration: 'none', borderRadius: '8px',
                        fontSize: '13px', fontWeight: 600,
                    }}>
                        + Add a Child
                    </Link>
                </div>
            )}

            {/* Progress overview */}
            {child && totalLessons > 0 && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px', marginBottom: '22px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
                        {[
                            { label: 'Total',       value: totalLessons,    color: 'var(--ink)'  },
                            { label: 'New',         value: newLessons,       color: '#3A7CA8'     },
                            { label: 'In Progress', value: viewedLessons,    color: '#D4A853'     },
                            { label: 'Completed',   value: completedLessons, color: '#3E6B52'     },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: s.color }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--ink-50)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Inline progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--cream-2)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: '100px',
                                background: '#3E6B52',
                                width: `${completionPct}%`,
                                transition: 'width 0.4s ease',
                            }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--ink-50)', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                            {completedLessons}/{totalLessons}
                        </span>
                    </div>
                </div>
            )}

            {/* Filter tabs */}
            {child && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setFilter(t.key)} style={{
                            padding: '7px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                            cursor: 'pointer', border: 'none', fontFamily: "'Outfit', sans-serif",
                            background: filter === t.key ? 'var(--ink)' : 'var(--white)',
                            color:      filter === t.key ? 'var(--cream)' : 'var(--ink-50)',
                            boxShadow:  filter === t.key ? 'none' : 'inset 0 0 0 1px var(--border)',
                            transition: 'all 0.15s',
                        }}>
                            {t.label}
                            <span style={{
                                marginLeft: '6px', padding: '1px 6px', borderRadius: '100px', fontSize: '10px',
                                background: filter === t.key ? 'rgba(255,255,255,0.2)' : 'var(--cream-2)',
                                color:      filter === t.key ? 'var(--cream)' : 'var(--ink-50)',
                            }}>
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Lessons grid */}
            {child && filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '52px',
                    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px',
                    color: 'var(--ink-50)',
                }}>
                    <div style={{ fontSize: '30px', marginBottom: '10px' }}>📖</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                        {filter === 'all'
                            ? `No lessons available for the ${ageGroupLabel(child?.age)} age group yet.`
                            : `No ${filter === 'new' ? 'new' : filter === 'viewed' ? 'in-progress' : 'completed'} lessons.`}
                    </div>
                </div>
            ) : child ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {filtered.map(lesson => (
                        <InlineLessonCard key={lesson.id} lesson={lesson} child={child} />
                    ))}
                </div>
            ) : null}
        </AppLayout>
    );
}

/* ── Inline lesson card (replaces LessonCard import) ─────────────────────── */
function InlineLessonCard({ lesson, child }) {
    const progress = lesson.progress;
    const href     = child
        ? `/lessons/${lesson.id}?child_id=${child.id}`
        : `/lessons/${lesson.id}`;

    const statusConfig = {
        completed: { label: 'Completed', color: '#3E6B52', bg: '#EBF7EE', dot: '#3E6B52' },
        viewed:    { label: 'In Progress', color: '#D4A853', bg: 'rgba(212,168,83,0.1)', dot: '#D4A853' },
        null:      { label: 'New',        color: 'var(--ink-50)', bg: 'var(--cream-2)', dot: 'var(--border)' },
    };
    const sc = statusConfig[progress?.status ?? 'null'] ?? statusConfig.null;

    const ageColors = { nursery: '#D4A853', kids: '#3A7CA8', youth: '#3E6B52' };
    const ageColor  = ageColors[lesson.age_group] || '#3A7CA8';

    return (
        <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: '14px', overflow: 'hidden',
                transition: 'box-shadow 0.15s, transform 0.15s',
                cursor: 'pointer',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
            }}
            >
                {/* Top color strip */}
                <div style={{ height: '4px', background: ageColor }} />

                <div style={{ padding: '18px' }}>
                    {/* Week + status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)',
                        }}>
                            Week {lesson.week_number}
                            {lesson.series ? ` · ${lesson.series}` : ''}
                        </span>
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '2px 8px', borderRadius: '100px', fontSize: '9px',
                            fontWeight: 600, background: sc.bg, color: sc.color,
                        }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot }} />
                            {sc.label}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
                        lineHeight: 1.2, margin: '0 0 6px',
                    }}>
                        {lesson.title}
                    </h3>

                    {/* Bible reference */}
                    {lesson.content?.bible_reference && (
                        <div style={{ fontSize: '11px', color: 'var(--ink-50)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
                            {lesson.content.bible_reference}
                        </div>
                    )}

                    {/* Footer: age group + activities count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-lt)' }}>
                        <span style={{
                            padding: '2px 8px', borderRadius: '100px', fontSize: '9px',
                            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                            fontFamily: "'JetBrains Mono', monospace",
                            background: `${ageColor}18`, color: ageColor,
                        }}>
                            {lesson.age_group}
                        </span>
                        {(lesson.activities_count ?? 0) > 0 && (
                            <span style={{ fontSize: '11px', color: 'var(--ink-50)', marginLeft: 'auto' }}>
                                {lesson.activities_count} {lesson.activities_count === 1 ? 'activity' : 'activities'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}