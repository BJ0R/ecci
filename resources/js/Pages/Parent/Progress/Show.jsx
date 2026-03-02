// resources/js/Pages/Parent/Progress/Show.jsx
// Rendered by: App\Http\Controllers\Parent\ProgressController@show
// Route: GET /progress/{child}  (name: parent.progress.show)

import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Components/Layout/AppLayout';

/**
 * Props from ProgressController@show:
 *   child — ChildProfile with loaded relations:
 *     { id, name, age, grade, avatar_color,
 *       lesson_progresses:    [{ lesson: { title, series, week_number }, status, completed_at }],
 *       activity_submissions: [{ activity: { title, type, max_score, lesson: { title } }, score, submitted_at }],
 *       verse_completions:    [{ memory_verse: { reference }, memorized_at }],
 *       badges:               [{ id, name, icon, description, pivot: { awarded_at } }]
 *     }
 *   stats — {
 *     lessons_completed, lessons_viewed, quizzes_total,
 *     average_score, verses_memorized, badges_earned
 *   }
 *
 * NOTE: ProgressBar, BadgeChip, Badge imports removed — all rendered inline.
 */
export default function ProgressShow({ child = {}, stats = {} }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');

    const lessonProgresses    = child.lesson_progresses    ?? [];
    const activitySubmissions = child.activity_submissions ?? [];
    const verseCompletions    = child.verse_completions    ?? [];
    const badges              = child.badges               ?? [];

    const lessonsCompleted = stats.lessons_completed ?? 0;
    const lessonsViewed    = stats.lessons_viewed    ?? 0;
    const quizzesTotal     = stats.quizzes_total     ?? 0;
    const avgScore         = stats.average_score ? Math.round(stats.average_score) : 0;
    const versesMemorized  = stats.verses_memorized ?? 0;
    const badgesEarned     = stats.badges_earned    ?? 0;

    const totalEngaged  = lessonsCompleted + lessonsViewed;
    const completionPct = totalEngaged > 0
        ? Math.round((lessonsCompleted / totalEngaged) * 100) : 0;

    function ageGroupLabel(age) {
        if (!age) return 'Unknown';
        if (age <= 5)  return 'Nursery';
        if (age <= 10) return 'Kids';
        return 'Youth';
    }

    const tabs = [
        { key: 'overview',   label: 'Overview' },
        { key: 'lessons',    label: `Lessons (${lessonProgresses.length})` },
        { key: 'activities', label: `Activities (${activitySubmissions.length})` },
        { key: 'verses',     label: `Verses (${verseCompletions.length})` },
        { key: 'badges',     label: `Badges (${badges.length})` },
    ];

    return (
        <AppLayout>
            <Head title={`${child.name ?? 'Progress'} — ECCII`} />

            {flash?.success && (
                <div style={{ background: '#EBF7EE', border: '1px solid #C2DEC8', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: '#3E6B52' }}>
                    ✓ {flash.success}
                </div>
            )}

            {/* Breadcrumb */}
            <div style={{ fontSize: '12px', color: 'var(--ink-50)', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Link href="/children" style={{ color: 'var(--ink-50)', textDecoration: 'none' }}>← My Children</Link>
                <span>/</span>
                <span style={{ color: 'var(--ink)' }}>{child.name}'s Progress</span>
            </div>

            {/* Child hero card */}
            <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: child.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: 'var(--ink)', border: '3px solid rgba(255,255,255,0.15)' }}>
                        {child.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                            Progress Report
                        </div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1, margin: 0 }}>
                            {child.name}
                        </h1>
                        <div style={{ fontSize: '12px', color: 'rgba(250,247,242,0.5)', marginTop: '4px' }}>
                            {ageGroupLabel(child.age)} · Age {child.age}{child.grade ? ` · ${child.grade}` : ''}
                        </div>
                    </div>
                </div>

                {/* Big percentage */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 700, lineHeight: 1, color: completionPct >= 80 ? '#6ED99F' : completionPct >= 50 ? 'var(--gold)' : 'var(--cream)' }}>
                        {completionPct}<span style={{ fontSize: '22px' }}>%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.4)', marginTop: '2px' }}>Lesson Completion</div>
                </div>
            </div>

            {/* Stat strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {[
                    { label: 'Lessons Done',    value: lessonsCompleted, color: '#3E6B52'      },
                    { label: 'In Progress',     value: lessonsViewed,    color: '#3A7CA8'      },
                    { label: 'Activities Done', value: quizzesTotal,     color: '#D4A853'      },
                    { label: 'Avg Score',       value: `${avgScore}%`,   color: 'var(--gold)'  },
                    { label: 'Verses Learned',  value: versesMemorized,  color: '#3E6B52'      },
                    { label: 'Badges',          value: badgesEarned,     color: '#D4A853'      },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--ink-50)', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab nav */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                        padding: '7px 16px', borderRadius: '100px', border: 'none',
                        fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: activeTab === t.key ? 'var(--ink)' : 'var(--white)',
                        color:      activeTab === t.key ? 'var(--cream)' : 'var(--ink-50)',
                        boxShadow:  activeTab === t.key ? 'none' : 'inset 0 0 0 1px var(--border)',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === 'overview' && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                    {/* Inline progress bar */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Lesson completion</span>
                            <span style={{ fontSize: '11px', color: 'var(--ink-50)', fontFamily: "'JetBrains Mono', monospace" }}>
                                {lessonsCompleted}/{totalEngaged}
                            </span>
                        </div>
                        <div style={{ height: '10px', background: 'var(--cream-2)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${completionPct}%`, background: '#3E6B52', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                        </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--ink-80)', lineHeight: 1.7, margin: '0 0 20px' }}>
                        {completionPct === 100
                            ? `🎉 ${child.name} has completed all available lessons!`
                            : completionPct >= 50
                            ? `${child.name} is making great progress — more than halfway through.`
                            : lessonsCompleted > 0
                            ? `${child.name} has started their learning journey. Keep it up!`
                            : `${child.name} hasn't completed any lessons yet. Head to Lessons to get started.`}
                    </p>

                    {/* Recent badges */}
                    {badges.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-50)', marginBottom: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Badges Earned
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {badges.slice(0, 6).map(badge => (
                                    <BadgeChip key={badge.id} badge={badge} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Lessons ── */}
            {activeTab === 'lessons' && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                    {lessonProgresses.length === 0 ? (
                        <EmptyTab icon="📖" text="No lessons viewed yet." />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Lesson', 'Series', 'Week', 'Status', 'Completed'].map((col, i) => (
                                        <th key={i} style={{ padding: '10px 16px', background: 'var(--cream-2)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-50)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {lessonProgresses.map((lp, i) => (
                                    <tr key={i}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid var(--border-lt)' }}>
                                            {lp.lesson?.title ?? '—'}
                                        </td>
                                        <td style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                            {lp.lesson?.series ?? '—'}
                                        </td>
                                        <td style={{ padding: '10px 16px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                            Wk {lp.lesson?.week_number ?? '—'}
                                        </td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-lt)' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '9px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: lp.status === 'completed' ? '#EBF7EE' : 'rgba(58,124,168,0.1)', color: lp.status === 'completed' ? '#3E6B52' : '#3A7CA8' }}>
                                                {lp.status === 'completed' ? 'Done ✓' : 'Viewed'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 16px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                            {lp.completed_at ? new Date(lp.completed_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ── Activities ── */}
            {activeTab === 'activities' && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                    {activitySubmissions.length === 0 ? (
                        <EmptyTab icon="📝" text="No activities submitted yet." />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Activity', 'Type', 'Lesson', 'Score', 'Submitted'].map((col, i) => (
                                        <th key={i} style={{ padding: '10px 16px', background: 'var(--cream-2)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-50)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activitySubmissions.map((sub, i) => {
                                    const maxScore = sub.activity?.max_score ?? 0;
                                    const pct      = maxScore > 0 ? Math.round((sub.score / maxScore) * 100) : null;
                                    const typeIcons = { quiz: '🧠', fill: '✏️' };
                                    return (
                                        <tr key={i}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid var(--border-lt)' }}>
                                                {sub.activity?.title ?? '—'}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '11px', color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                                {typeIcons[sub.activity?.type] ?? ''} {sub.activity?.type ?? '—'}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                                {sub.activity?.lesson?.title ?? <em style={{ opacity: 0.5 }}>Standalone</em>}
                                            </td>
                                            <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-lt)' }}>
                                                {sub.activity?.type === 'quiz' ? (
                                                    <span>
                                                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 700, color: pct >= 80 ? '#3E6B52' : pct >= 60 ? '#D4A853' : 'var(--ink-50)' }}>
                                                            {sub.score}
                                                        </span>
                                                        <span style={{ fontSize: '11px', color: 'var(--ink-50)' }}>/{maxScore} {pct !== null ? `(${pct}%)` : ''}</span>
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '11px', color: '#3E6B52' }}>Submitted</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)', borderBottom: '1px solid var(--border-lt)' }}>
                                                {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ── Verses ── */}
            {activeTab === 'verses' && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                    {verseCompletions.length === 0 ? (
                        <EmptyTab icon="✝️" text="No verses memorised yet." />
                    ) : (
                        <div style={{ padding: '4px 0' }}>
                            {verseCompletions.map((vc, i) => (
                                <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-lt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: 'var(--gold)' }}>
                                            {vc.memory_verse?.reference ?? '—'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '2px' }}>
                                            Memorised {vc.memorized_at ? new Date(vc.memorized_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '16px', color: '#3E6B52' }}>✓</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Badges ── */}
            {activeTab === 'badges' && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                    {badges.length === 0 ? (
                        <EmptyTab icon="🏅" text="No badges earned yet. Complete lessons and activities to earn badges!" />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                            {badges.map(badge => (
                                <BadgeChip key={badge.id} badge={badge} large />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}

/* ── Inline badge chip (replaces BadgeChip import) ───────────────────────── */
function BadgeChip({ badge, large = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: large ? '12px' : '8px', padding: large ? '14px 18px' : '8px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: large ? '12px' : '8px', maxWidth: large ? '200px' : '160px' }}>
            <span style={{ fontSize: large ? '26px' : '18px', flexShrink: 0 }}>
                {badge.icon || '🏅'}
            </span>
            <div>
                <div style={{ fontSize: large ? '13px' : '11px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                    {badge.name}
                </div>
                {badge.description && (
                    <div style={{ fontSize: large ? '11px' : '10px', color: 'var(--ink-50)', marginTop: '2px', lineHeight: 1.4 }}>
                        {badge.description}
                    </div>
                )}
                {badge.pivot?.awarded_at && (
                    <div style={{ fontSize: '9px', color: 'var(--gold)', marginTop: '3px', fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(badge.pivot.awarded_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyTab({ icon, text }) {
    return (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-50)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
            <p style={{ fontSize: '13px', margin: 0 }}>{text}</p>
        </div>
    );
}