// resources/js/Pages/Parent/Lessons/Show.jsx
// Rendered by: App\Http\Controllers\Parent\LessonViewController@show
// Route: GET /lessons/{lesson}  (name: parent.lessons.show)

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Components/Layout/AppLayout';

/**
 * Props from LessonViewController@show:
 *   lesson — {
 *     id, title, series, week_number, age_group,
 *     activities_count,
 *     content: {
 *       bible_reference, bible_text, explanation,
 *       reflection_questions: string[],
 *       prayer
 *     },
 *     activities: [{
 *       id, title, type, instructions, max_score,
 *       questions_count (withCount)
 *     }]
 *   }
 *
 * NOTE: ActivityCard component import removed — activity cards rendered inline
 * to avoid import errors if that component doesn't exist yet.
 */
export default function LessonsShow({ lesson = {} }) {
    const { activeChild, flash } = usePage().props;
    const [marking, setMarking]         = useState(false);
    const [activeSection, setActiveSection] = useState('bible');

    const content    = lesson.content    ?? {};
    const activities = lesson.activities ?? [];

    function markComplete() {
        if (!activeChild) return;
        setMarking(true);
        router.patch(`/lessons/${lesson.id}/complete`, {
            child_profile_id: activeChild.id,
        }, { onFinish: () => setMarking(false) });
    }

    const ageColors = { nursery: '#D4A853', kids: '#3A7CA8', youth: '#3E6B52' };
    const ageColor  = ageColors[lesson.age_group] || '#3A7CA8';

    const sections = [
        { key: 'bible',      label: 'Scripture'   },
        { key: 'lesson',     label: 'Lesson'      },
        { key: 'reflection', label: 'Reflection'  },
        { key: 'prayer',     label: 'Prayer'      },
        { key: 'activities', label: `Activities (${activities.length})` },
    ];

    return (
        <AppLayout>
            <Head title={`${lesson.title ?? 'Lesson'} — ECCII`} />

            {/* Flash */}
            {flash?.success && (
                <div style={{ background: '#EBF7EE', border: '1px solid #C2DEC8', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: '#3E6B52' }}>
                    ✓ {flash.success}
                </div>
            )}

            {/* Breadcrumb */}
            <div style={{ fontSize: '12px', color: 'var(--ink-50)', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                    href={activeChild ? `/lessons?child_id=${activeChild.id}` : '/lessons'}
                    style={{ color: 'var(--ink-50)', textDecoration: 'none' }}
                >
                    ← Lessons
                </Link>
                <span>/</span>
                <span style={{ color: 'var(--ink)' }}>{lesson.title}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>

                {/* ── Main content ── */}
                <div>
                    {/* Hero banner */}
                    <div style={{
                        background: 'var(--ink)', borderRadius: '16px',
                        padding: '28px', marginBottom: '0',
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '10px', letterSpacing: '0.16em',
                                textTransform: 'uppercase', color: 'var(--gold)',
                            }}>
                                Week {lesson.week_number}
                            </span>
                            {lesson.series && (
                                <span style={{ fontSize: '10px', color: 'rgba(250,247,242,0.4)' }}>
                                    · {lesson.series}
                                </span>
                            )}
                            {lesson.age_group && (
                                <span style={{
                                    padding: '2px 10px', borderRadius: '100px', fontSize: '9px',
                                    fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: `${ageColor}28`, color: ageColor,
                                    marginLeft: 'auto',
                                }}>
                                    {lesson.age_group}
                                </span>
                            )}
                        </div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '30px', fontWeight: 700,
                            color: 'var(--cream)', lineHeight: 1.1, margin: '0 0 10px',
                        }}>
                            {lesson.title}
                        </h1>
                        {content.bible_reference && (
                            <div style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.08em',
                            }}>
                                {content.bible_reference}
                            </div>
                        )}
                    </div>

                    {/* Section tab bar */}
                    <div style={{
                        display: 'flex', gap: '2px',
                        background: 'var(--cream-2)', borderRadius: '0 0 10px 10px',
                        padding: '6px 8px', marginBottom: '22px', overflowX: 'auto',
                    }}>
                        {sections.map(s => (
                            <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
                                padding: '7px 14px', borderRadius: '6px',
                                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                                fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 500,
                                background: activeSection === s.key ? 'var(--white)' : 'transparent',
                                color:      activeSection === s.key ? 'var(--ink)' : 'var(--ink-50)',
                                boxShadow:  activeSection === s.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.12s',
                            }}>
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Bible ── */}
                    {activeSection === 'bible' && (
                        <Section title="Scripture Passage">
                            {content.bible_reference && (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '14px' }}>
                                    {content.bible_reference}
                                </div>
                            )}
                            {content.bible_text ? (
                                <blockquote style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '17px', fontStyle: 'italic',
                                    color: 'var(--ink)', lineHeight: 1.8,
                                    borderLeft: '3px solid var(--gold)',
                                    paddingLeft: '18px', margin: 0,
                                }}>
                                    {content.bible_text}
                                </blockquote>
                            ) : (
                                <EmptyState text="No scripture text added yet." />
                            )}
                        </Section>
                    )}

                    {/* ── Lesson explanation ── */}
                    {activeSection === 'lesson' && (
                        <Section title="Lesson Explanation">
                            {content.explanation ? (
                                <div style={{ fontSize: '14px', color: 'var(--ink-80)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                    {content.explanation}
                                </div>
                            ) : (
                                <EmptyState text="No explanation written yet." />
                            )}
                        </Section>
                    )}

                    {/* ── Reflection questions ── */}
                    {activeSection === 'reflection' && (
                        <Section title="Reflection Questions">
                            <p style={{ fontSize: '13px', color: 'var(--ink-50)', marginBottom: '20px', lineHeight: 1.55 }}>
                                Discuss these questions with your child after reading the lesson.
                            </p>
                            {(content.reflection_questions ?? []).length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {content.reflection_questions.map((q, i) => (
                                        <div key={i} style={{
                                            display: 'flex', gap: '14px', alignItems: 'flex-start',
                                            padding: '14px 16px', background: 'var(--cream)',
                                            borderRadius: '10px', border: '1px solid var(--border-lt)',
                                        }}>
                                            <span style={{
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '22px', fontWeight: 700,
                                                color: 'var(--gold)', lineHeight: 1, flexShrink: 0,
                                            }}>
                                                {i + 1}.
                                            </span>
                                            <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                                                {q}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No reflection questions for this lesson." />
                            )}
                        </Section>
                    )}

                    {/* ── Prayer ── */}
                    {activeSection === 'prayer' && (
                        <Section title="Closing Prayer">
                            {content.prayer ? (
                                <div style={{ background: 'var(--ink)', borderRadius: '12px', padding: '24px 26px' }}>
                                    <div style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '9px', letterSpacing: '0.2em',
                                        textTransform: 'uppercase', color: 'var(--gold)',
                                        marginBottom: '12px',
                                    }}>
                                        🙏 Prayer
                                    </div>
                                    <p style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '16px', fontStyle: 'italic',
                                        color: 'var(--cream)', lineHeight: 1.8, margin: 0,
                                    }}>
                                        {content.prayer}
                                    </p>
                                </div>
                            ) : (
                                <EmptyState text="No closing prayer added yet." />
                            )}
                        </Section>
                    )}

                    {/* ── Activities ── */}
                    {activeSection === 'activities' && (
                        <Section title="Activities">
                            {activities.length === 0 ? (
                                <EmptyState text="No activities attached to this lesson yet." />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {activities.map(activity => (
                                        <InlineActivityCard
                                            key={activity.id}
                                            activity={activity}
                                            childId={activeChild?.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </Section>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Mark complete */}
                    {activeChild && (
                        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                                Reading as {activeChild.name}
                            </div>
                            <button onClick={markComplete} disabled={marking} style={{
                                width: '100%', padding: '10px', border: 'none',
                                borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                background: marking ? 'rgba(62,107,82,0.4)' : '#3E6B52',
                                color: 'var(--white)',
                                cursor: marking ? 'not-allowed' : 'pointer',
                                fontFamily: "'Outfit', sans-serif", transition: 'background 0.2s',
                            }}>
                                {marking ? '✓ Saving…' : '✓ Mark as Completed'}
                            </button>
                            <p style={{ fontSize: '10px', color: 'var(--ink-50)', marginTop: '8px', lineHeight: 1.5 }}>
                                Marks this lesson as fully read for {activeChild.name}.
                            </p>
                        </div>
                    )}

                    {/* Lesson info */}
                    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
                            Lesson Info
                        </div>
                        {[
                            { label: 'Series',     value: lesson.series },
                            { label: 'Week',       value: lesson.week_number ? `Week ${lesson.week_number}` : null },
                            { label: 'Age Group',  value: lesson.age_group },
                            { label: 'Activities', value: activities.length },
                        ].filter(r => r.value !== null && r.value !== undefined).map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border-lt)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--ink-50)' }}>{r.label}</span>
                                <span style={{ fontSize: '12px', color: 'var(--ink)', fontWeight: 500 }}>{r.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Section shortcuts */}
                    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 18px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink-50)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Jump to
                        </div>
                        {sections.map(s => (
                            <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '7px 10px', borderRadius: '6px', border: 'none',
                                background: activeSection === s.key ? 'rgba(184,146,58,0.1)' : 'transparent',
                                color:      activeSection === s.key ? 'var(--gold)' : 'var(--ink-50)',
                                fontSize: '12px', fontWeight: activeSection === s.key ? 600 : 400,
                                cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.12s',
                            }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Inline activity card (replaces ActivityCard import) ─────────────────── */
function InlineActivityCard({ activity, childId }) {
    const typeConfig = {
        quiz: { icon: '🧠', label: 'Multiple Choice Quiz', color: 'var(--gold)' },
        fill: { icon: '✏️', label: 'Fill in the Blank',    color: '#6B5EA8'      },
    };
    const tc  = typeConfig[activity.type] ?? typeConfig.quiz;
    const url = childId
        ? `/activities/${activity.id}?child_id=${childId}`
        : `/activities/${activity.id}`;

    return (
        <div style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
            display: 'flex', alignItems: 'stretch',
        }}>
            {/* Left color bar */}
            <div style={{ width: '4px', background: tc.color, flexShrink: 0 }} />

            <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '20px', marginTop: '1px' }}>{tc.icon}</span>
                    <div style={{ flex: 1 }}>
                        {/* Type badge */}
                        <div style={{ marginBottom: '4px' }}>
                            <span style={{
                                fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em',
                                textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace",
                                color: tc.color,
                            }}>
                                {tc.label}
                            </span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                            {activity.title}
                        </div>
                        {activity.instructions && (
                            <p style={{
                                fontSize: '12px', color: 'var(--ink-50)', lineHeight: 1.55,
                                margin: '0 0 10px',
                                display: '-webkit-box', WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {activity.instructions}
                            </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: 'var(--ink-50)' }}>
                                Max score: <strong style={{ color: 'var(--ink)' }}>{activity.max_score}</strong>
                            </span>
                            {activity.type === 'quiz' && activity.questions_count !== undefined && (
                                <span style={{ fontSize: '11px', color: 'var(--ink-50)' }}>
                                    {activity.questions_count} question{activity.questions_count !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Start button */}
                    <Link href={url} style={{
                        flexShrink: 0, padding: '9px 18px',
                        background: tc.color === 'var(--gold)' ? 'var(--ink)' : tc.color,
                        color: 'var(--cream)', textDecoration: 'none',
                        borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                        Start →
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── Shared sub-components ───────────────────────────────────────────────── */
function Section({ title, children }) {
    return (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '4px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-lt)', fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                {title}
            </div>
            <div style={{ padding: '22px' }}>{children}</div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div style={{ textAlign: 'center', padding: '28px', color: 'var(--ink-50)', fontSize: '13px' }}>
            {text}
        </div>
    );
}