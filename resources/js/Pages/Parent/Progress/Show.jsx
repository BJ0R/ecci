// resources/js/Pages/Parent/Progress/Show.jsx
// Rendered by: App\Http\Controllers\Parent\ProgressController@show
// Route: GET /progress/{child}
//
// FIX: Replaced all var(--ink), var(--cream), var(--white), var(--border)
//      etc. with literal ECCSII dark-theme hex values. Those CSS custom
//      properties were only defined in the old light theme.

import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

// ── ECCSII dark tokens (matches AppLayout) ────────────────────────
const T = {
    bg300:     '#101A38',
    bg400:     '#16224A',
    bg500:     '#1D2D5E',
    gold:      '#D4930A',
    goldLt:    '#F0B429',
    goldPale:  'rgba(212,147,10,0.12)',
    cream:     '#EDE6D6',
    muted:     '#8A7F6E',
    faint:     '#3A3224',
    sage:      '#3C7554',
    sageLt:    '#59A472',
    sagePale:  'rgba(60,117,84,0.14)',
    sky:       '#2453A0',
    skyLt:     '#4876CC',
    red:       '#C83030',
    border:    'rgba(212,147,10,0.12)',
    borderDim: 'rgba(237,230,214,0.06)',
};

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

    const totalLessons  = lessonsCompleted + lessonsViewed;
    const completionPct = totalLessons > 0
        ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

    const ageGroupLabel = (age) => {
        if (!age) return 'Unknown';
        if (age <= 5) return 'Nursery';
        if (age <= 10) return 'Kids';
        return 'Youth';
    };

    const tabs = [
        { key: 'overview',   label: 'Overview' },
        { key: 'lessons',    label: `Lessons (${lessonProgresses.length})` },
        { key: 'activities', label: `Activities (${activitySubmissions.length})` },
        { key: 'verses',     label: `Verses (${verseCompletions.length})` },
        { key: 'badges',     label: `Badges (${badges.length})` },
    ];

    return (
        <AppLayout>
            <Head title={`${child.name ?? 'Progress'} — ECCSII`} />

            {flash?.success && (
                <div style={{ background: T.sagePale, border: `1px solid rgba(60,117,84,0.3)`, borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: T.sageLt, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} /> {flash.success}
                </div>
            )}

            {/* Breadcrumb */}
            <div style={{ fontSize: '12px', color: T.faint, marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Link href="/children" style={{ color: T.muted, textDecoration: 'none' }}>← My Children</Link>
                <span style={{ color: T.faint }}>/</span>
                <span style={{ color: T.cream }}>{child.name}'s Progress</span>
            </div>

            {/* ── Hero card ─────────────────────────────────────── */}
            <div style={{
                background: `linear-gradient(145deg, ${T.bg500} 0%, ${T.bg400} 100%)`,
                border: `1px solid ${T.border}`,
                borderRadius: '16px', padding: '24px 28px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '20px', flexWrap: 'wrap',
                boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                        background: child.avatar_color || T.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700,
                        color: '#06091A', border: `3px solid rgba(255,255,255,0.12)`,
                        boxShadow: `0 0 20px ${(child.avatar_color || T.gold) + '44'}`,
                    }}>
                        {child.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: '4px' }}>
                            Progress Report
                        </div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: T.cream, lineHeight: 1, margin: 0 }}>
                            {child.name}
                        </h1>
                        <div style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>
                            {ageGroupLabel(child.age)} · Age {child.age}{child.grade ? ` · ${child.grade}` : ''}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 700, lineHeight: 1,
                        color: completionPct >= 80 ? T.sageLt : completionPct >= 50 ? T.goldLt : T.cream,
                    }}>
                        {completionPct}<span style={{ fontSize: '22px' }}>%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: T.muted, marginTop: '2px' }}>Lesson Completion</div>
                </div>
            </div>

            {/* ── Stat strip ─────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '22px' }}>
                {[
                    { label: 'Lessons Done',    value: lessonsCompleted, color: T.sageLt   },
                    { label: 'In Progress',     value: lessonsViewed,    color: T.skyLt    },
                    { label: 'Activities Done', value: quizzesTotal,     color: T.goldLt   },
                    { label: 'Avg Score',       value: `${avgScore}%`,   color: T.goldLt   },
                    { label: 'Verses Learned',  value: versesMemorized,  color: T.sageLt   },
                    { label: 'Badges',          value: badgesEarned,     color: T.goldLt   },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`,
                        border: `1px solid ${T.borderDim}`,
                        borderRadius: '12px', padding: '14px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: '10px', color: T.muted, marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Tab nav ────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '18px', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                        padding: '7px 16px', borderRadius: '100px',
                        border: 'none', fontFamily: "'Outfit', sans-serif",
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: activeTab === t.key
                            ? `linear-gradient(135deg, ${T.gold}, #A0701A)`
                            : `rgba(255,255,255,0.06)`,
                        color: activeTab === t.key ? '#06091A' : T.muted,
                        boxShadow: activeTab === t.key ? `0 2px 10px rgba(212,147,10,0.22)` : 'none',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Overview ───────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <div style={{ background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px' }}>
                    {/* Progress bar */}
                    <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: T.cream }}>Lesson completion</span>
                            <span style={{ fontSize: '11px', color: T.muted, fontFamily: "'JetBrains Mono', monospace" }}>
                                {lessonsCompleted}/{totalLessons}
                            </span>
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${completionPct}%`,
                                background: `linear-gradient(90deg, ${T.sage}, ${T.sageLt})`,
                                borderRadius: '100px', transition: 'width 0.5s ease',
                                boxShadow: `0 0 8px rgba(60,117,84,0.4)`,
                            }} />
                        </div>
                    </div>

                    <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.7, margin: '0 0 20px' }}>
                        {completionPct === 100
                            ? `🎉 ${child.name} has completed all available lessons!`
                            : completionPct >= 50
                            ? `${child.name} is making great progress — more than halfway through.`
                            : lessonsCompleted > 0
                            ? `${child.name} has started their learning journey. Keep it up!`
                            : `${child.name} hasn't completed any lessons yet. Head to Lessons to get started.`}
                    </p>

                    {badges.length > 0 && (
                        <div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted, marginBottom: '12px' }}>
                                Badges Earned
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {badges.slice(0, 6).map(badge => <BadgeChip key={badge.id} badge={badge} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Lessons ────────────────────────────────────────── */}
            {activeTab === 'lessons' && (
                <div style={{ background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`, border: `1px solid ${T.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                    {lessonProgresses.length === 0 ? (
                        <EmptyTab icon="📖" text="No lessons viewed yet." />
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
                                <THead cols={['Lesson', 'Series', 'Week', 'Status', 'Completed']} />
                                <tbody>
                                    {lessonProgresses.map((lp, i) => (
                                        <tr key={i} style={{ transition: 'background 0.12s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <TD bold>{lp.lesson?.title ?? '—'}</TD>
                                            <TD muted>{lp.lesson?.series ?? '—'}</TD>
                                            <TD mono>Wk {lp.lesson?.week_number ?? '—'}</TD>
                                            <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.borderDim}` }}>
                                                <StatusPill done={lp.status === 'completed'} />
                                            </td>
                                            <TD mono>{lp.completed_at ? new Date(lp.completed_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</TD>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Activities ─────────────────────────────────────── */}
            {activeTab === 'activities' && (
                <div style={{ background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`, border: `1px solid ${T.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                    {activitySubmissions.length === 0 ? (
                        <EmptyTab icon="📝" text="No activities submitted yet." />
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '580px' }}>
                                <THead cols={['Activity', 'Type', 'Lesson', 'Score', 'Submitted']} />
                                <tbody>
                                    {activitySubmissions.map((sub, i) => {
                                        const maxScore = sub.activity?.max_score ?? 0;
                                        const pct = maxScore > 0 ? Math.round((sub.score / maxScore) * 100) : null;
                                        const scoreColor = pct === null ? T.muted : pct >= 80 ? T.sageLt : pct >= 60 ? T.goldLt : '#E05050';
                                        return (
                                            <tr key={i} style={{ transition: 'background 0.12s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <TD bold>{sub.activity?.title ?? '—'}</TD>
                                                <TD muted>{sub.activity?.type === 'quiz' ? '🧠 Quiz' : '✏️ Fill-in'}</TD>
                                                <TD muted>{sub.activity?.lesson?.title ?? <em style={{ opacity: 0.4 }}>—</em>}</TD>
                                                <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.borderDim}` }}>
                                                    {sub.activity?.type === 'quiz' ? (
                                                        <span>
                                                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 700, color: scoreColor }}>
                                                                {sub.score}
                                                            </span>
                                                            <span style={{ fontSize: '11px', color: T.faint }}>/{maxScore} {pct !== null ? `(${pct}%)` : ''}</span>
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '11px', color: T.sageLt }}>Submitted</span>
                                                    )}
                                                </td>
                                                <TD mono>{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</TD>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Verses ─────────────────────────────────────────── */}
            {activeTab === 'verses' && (
                <div style={{ background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`, border: `1px solid ${T.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                    {verseCompletions.length === 0 ? (
                        <EmptyTab icon="✝️" text="No verses memorised yet." />
                    ) : (
                        <div>
                            {verseCompletions.map((vc, i) => (
                                <div key={i} style={{ padding: '14px 20px', borderBottom: `1px solid ${T.borderDim}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: T.gold }}>
                                            {vc.memory_verse?.reference ?? '—'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: T.muted, marginTop: '2px' }}>
                                            Memorised {vc.memorized_at ? new Date(vc.memorized_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </div>
                                    </div>
                                    <CheckCircle2 size={16} style={{ color: T.sageLt }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Badges ─────────────────────────────────────────── */}
            {activeTab === 'badges' && (
                <div style={{ background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px' }}>
                    {badges.length === 0 ? (
                        <EmptyTab icon="🏅" text="No badges earned yet. Complete lessons and activities to earn badges!" />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {badges.map(badge => <BadgeChip key={badge.id} badge={badge} large />)}
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function THead({ cols }) {
    return (
        <thead>
            <tr>
                {cols.map((col, i) => (
                    <th key={i} style={{
                        padding: '10px 16px', textAlign: 'left',
                        background: 'rgba(255,255,255,0.03)',
                        fontSize: '9px', fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'rgba(138,127,110,0.55)',
                        borderBottom: `1px solid rgba(212,147,10,0.12)`,
                    }}>
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function TD({ children, bold, muted, mono }) {
    const T_inner = { cream: '#EDE6D6', muted: '#8A7F6E', faint: '#3A3224', borderDim: 'rgba(237,230,214,0.06)' };
    return (
        <td style={{
            padding: '10px 16px', fontSize: mono ? '11px' : '13px',
            fontWeight: bold ? 600 : 400,
            fontFamily: mono ? "'JetBrains Mono', monospace" : "'Outfit', sans-serif",
            color: muted || mono ? T_inner.muted : T_inner.cream,
            borderBottom: `1px solid ${T_inner.borderDim}`,
        }}>
            {children}
        </td>
    );
}

function StatusPill({ done }) {
    return (
        <span style={{
            padding: '2px 9px', borderRadius: '100px',
            fontSize: '9px', fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: done ? 'rgba(60,117,84,0.18)' : 'rgba(36,83,160,0.16)',
            color: done ? '#59A472' : '#4876CC',
        }}>
            {done ? 'Done ✓' : 'Viewed'}
        </span>
    );
}

function BadgeChip({ badge, large = false }) {
    const T_inner = { bg400: '#16224A', border: 'rgba(212,147,10,0.12)', cream: '#EDE6D6', muted: '#8A7F6E', gold: '#D4930A' };
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: large ? '12px' : '8px',
            padding: large ? '14px 18px' : '8px 12px',
            background: `rgba(255,255,255,0.04)`, border: `1px solid ${T_inner.border}`,
            borderRadius: large ? '12px' : '8px', maxWidth: large ? '200px' : '160px',
        }}>
            <span style={{ fontSize: large ? '26px' : '18px', flexShrink: 0 }}>
                {badge.icon || '🏅'}
            </span>
            <div>
                <div style={{ fontSize: large ? '13px' : '11px', fontWeight: 700, color: T_inner.cream, lineHeight: 1.2 }}>
                    {badge.name}
                </div>
                {badge.description && (
                    <div style={{ fontSize: large ? '11px' : '10px', color: T_inner.muted, marginTop: '2px', lineHeight: 1.4 }}>
                        {badge.description}
                    </div>
                )}
                {badge.pivot?.awarded_at && (
                    <div style={{ fontSize: '9px', color: T_inner.gold, marginTop: '3px', fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(badge.pivot.awarded_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyTab({ icon, text }) {
    return (
        <div style={{ padding: '48px', textAlign: 'center', color: '#3A3224' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
            <p style={{ fontSize: '13px', margin: 0 }}>{text}</p>
        </div>
    );
}