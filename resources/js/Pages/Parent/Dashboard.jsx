// resources/js/Pages/Parent/Dashboard.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen, BookMarked, Users, HeartHandshake,
    Trophy, CheckCircle2, XCircle, Pin, ChevronRight,
} from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

export default function Dashboard({
    children      = [],
    activeChild   = null,
    stats         = {},
    recentLessons = [],
    currentVerse  = null,
    announcements = [],
}) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const lessonsCompleted = stats.lessons_completed ?? 0;
    const lessonsTotal     = stats.lessons_total     ?? 0;
    const quizzesDone      = stats.quizzes_done      ?? 0;
    const badgesEarned     = stats.badges_earned     ?? 0;
    const completionPct    = lessonsTotal > 0
        ? Math.round((lessonsCompleted / lessonsTotal) * 100) : 0;

    const hour       = new Date().getHours();
    const greeting   = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const familyName = user?.family_name || user?.name || 'Family';

    const pinnedAnn   = announcements.filter(a => a.pinned);
    const regularAnn  = announcements.filter(a => !a.pinned);

    const statCards = [
        { label: 'Lessons Done',  value: lessonsCompleted,  color: 'var(--sage)',  icon: BookOpen   },
        { label: 'Quizzes Done',  value: quizzesDone,       color: 'var(--amber)', icon: CheckCircle2 },
        { label: 'Badges Earned', value: badgesEarned,      color: 'var(--gold)',  icon: Trophy     },
        { label: 'Completion',    value: `${completionPct}%`, color: completionPct >= 80 ? 'var(--sage)' : 'var(--gold)', icon: ChevronRight },
    ];

    const quickLinks = [
        { href: activeChild ? `/lessons?child_id=${activeChild.id}` : '/children', label: 'Browse Lessons',       icon: BookOpen       },
        { href: '/verses',   label: 'Memory Verses',         icon: BookMarked     },
        { href: '/children', label: 'Manage Children',       icon: Users          },
        { href: '/prayer',   label: 'Submit Prayer Request', icon: HeartHandshake },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard — ECCII" />

            {/* ── Flash ───────────────────────────────────────────── */}
            {flash?.success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 text-[13px]"
                    style={{ background: 'var(--sage-pale)', borderColor: '#C2DEC8', color: 'var(--sage)' }}>
                    <CheckCircle2 size={14} className="flex-shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 text-[13px]"
                    style={{ background: 'var(--rose-pale)', borderColor: '#F5C6C6', color: 'var(--rose)' }}>
                    <XCircle size={14} className="flex-shrink-0" />
                    {flash.error}
                </div>
            )}

            {/* ── Pinned announcements ────────────────────────────── */}
            {pinnedAnn.map(ann => (
                <div key={ann.id}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-xl border mb-3 text-[13px]"
                    style={{ background: 'rgba(184,146,58,0.08)', borderColor: '#DFCB8A', color: 'var(--amber)' }}
                >
                    <Pin size={14} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold mb-0.5">{ann.title}</div>
                        <div className="leading-relaxed opacity-85">{ann.body}</div>
                    </div>
                </div>
            ))}

            {/* ── Page greeting ───────────────────────────────────── */}
            <div className="mb-7">
                <div className="text-[9px] tracking-[0.22em] uppercase mb-1.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}>
                    Family Dashboard
                </div>
                <h1 className="text-[30px] font-bold leading-tight m-0 mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                    {greeting}, {familyName} 🙏
                </h1>
                {activeChild && (
                    <p className="text-[13px] m-0" style={{ color: 'var(--ink-50)' }}>
                        Viewing as{' '}
                        <strong style={{ color: 'var(--ink)' }}>{activeChild.name}</strong>
                        {' '}· {ageLabel(activeChild.age)}
                    </p>
                )}
            </div>

            {/* ── No children CTA ─────────────────────────────────── */}
            {children.length === 0 && (
                <div className="rounded-[14px] border p-9 text-center mb-7"
                    style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                    <Users size={36} className="mx-auto mb-3 opacity-20" />
                    <div className="text-[20px] font-bold mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                        Add your first child to get started
                    </div>
                    <p className="text-[13px] leading-relaxed mb-5 max-w-xs mx-auto" style={{ color: 'var(--ink-50)' }}>
                        Create a child profile to track their lessons, quizzes, and progress.
                    </p>
                    <Link href="/children/create"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-semibold no-underline"
                        style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                        + Add Child
                    </Link>
                </div>
            )}

            {/* ── Stats strip ─────────────────────────────────────── */}
            {activeChild && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {statCards.map((s, i) => (
                        <div key={i} className="rounded-xl border p-3.5"
                            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                            <s.icon size={14} className="mb-1.5 opacity-50" style={{ color: s.color }} />
                            <div className="text-[28px] font-bold leading-none mb-1"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: s.color }}>
                                {s.value}
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--ink-50)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Progress bar ────────────────────────────────────── */}
            {activeChild && lessonsTotal > 0 && (
                <div className="rounded-[14px] border px-5 py-4 mb-6"
                    style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--ink)' }}>
                            {activeChild.name}'s Lesson Progress
                        </span>
                        <span className="text-[11px]"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                            {lessonsCompleted} / {lessonsTotal}
                        </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream-2)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${completionPct}%`, background: 'var(--sage)' }} />
                    </div>
                </div>
            )}

            {/* ── Two-column layout ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                {/* Left: lessons + announcements */}
                <div>
                    <SectionLabel title="Recent Lessons" action={
                        activeChild
                            ? <PanelLink href={`/lessons?child_id=${activeChild.id}`}>View all</PanelLink>
                            : null
                    } />

                    {recentLessons.length === 0 ? (
                        <EmptyBox icon={<BookOpen size={24} />} text={
                            activeChild
                                ? "No lessons available for this age group yet."
                                : "Select a child to see their lessons."
                        } />
                    ) : (
                        <div className="flex flex-col gap-2">
                            {recentLessons.map(lesson => (
                                <LessonRow key={lesson.id} lesson={lesson} childId={activeChild?.id} />
                            ))}
                        </div>
                    )}

                    {regularAnn.length > 0 && (
                        <div className="mt-7">
                            <SectionLabel title="Church Announcements" />
                            <div className="flex flex-col gap-2.5">
                                {regularAnn.map(ann => (
                                    <div key={ann.id} className="rounded-[10px] border px-4 py-3.5"
                                        style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                                        <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                                            {ann.title}
                                        </div>
                                        <p className="text-[12px] m-0 leading-relaxed" style={{ color: 'var(--ink-80)' }}>
                                            {ann.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: verse + quick links + children */}
                <div className="flex flex-col gap-6">

                    {/* Memory verse */}
                    {currentVerse && (
                        <div>
                            <SectionLabel title="Verse of the Week" action={
                                <PanelLink href="/verses">All</PanelLink>
                            } />
                            <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--ink)' }}>
                                <div className="p-5">
                                    <div className="text-[9px] tracking-[0.16em] uppercase mb-2.5"
                                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}>
                                        Week {currentVerse.week_number}
                                    </div>
                                    <blockquote className="text-[15px] italic leading-[1.75] border-l-2 pl-3 m-0 mb-3"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream)', borderColor: 'var(--gold)' }}>
                                        {currentVerse.verse_text}
                                    </blockquote>
                                    <div className="text-[11px] font-semibold"
                                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}>
                                        — {currentVerse.reference}
                                    </div>
                                </div>
                                <Link href="/verses"
                                    className="block px-5 py-2.5 text-[12px] text-center no-underline border-t transition-colors hover:text-[var(--gold)]"
                                    style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(250,247,242,0.45)', fontFamily: "'Outfit', sans-serif" }}>
                                    View all verses →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Quick links */}
                    <div>
                        <SectionLabel title="Quick Actions" />
                        <div className="flex flex-col gap-2">
                            {quickLinks.map(a => (
                                <Link key={a.href} href={a.href}
                                    className="flex items-center gap-2.5 px-4 py-3 rounded-[10px] border text-[13px] font-medium no-underline transition-colors hover:border-[var(--gold)]"
                                    style={{ background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--ink)', fontFamily: "'Outfit', sans-serif" }}>
                                    <a.icon size={15} style={{ color: 'var(--gold)', opacity: 0.8 }} />
                                    {a.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Children summary */}
                    {children.length > 0 && (
                        <div>
                            <SectionLabel title="Children" action={
                                <PanelLink href="/children">Manage</PanelLink>
                            } />
                            <div className="flex flex-col gap-1.5">
                                {children.map(child => (
                                    <Link key={child.id} href={`/lessons?child_id=${child.id}`}
                                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border no-underline transition-colors hover:border-[var(--gold)]"
                                        style={{
                                            background:   'var(--white)',
                                            borderColor:  activeChild?.id === child.id ? 'var(--gold)' : 'var(--border)',
                                        }}>
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                                            style={{ background: child.avatar_color || 'var(--gold)', color: 'var(--ink)' }}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--ink)' }}>
                                                {child.name}
                                            </div>
                                            <div className="text-[10px]" style={{ color: 'var(--ink-50)' }}>
                                                {ageLabel(child.age)} · Age {child.age}
                                            </div>
                                        </div>
                                        {activeChild?.id === child.id && (
                                            <span className="text-[9px] font-bold flex-shrink-0"
                                                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)', letterSpacing: '0.08em' }}>
                                                ACTIVE
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Lesson row ──────────────────────────────────────────────────────── */
function LessonRow({ lesson, childId }) {
    const status = lesson.progress?.status;
    const dotColor = status === 'completed' ? 'var(--sage)' : status === 'viewed' ? 'var(--amber)' : 'var(--border)';
    const badge = status === 'completed'
        ? { label: 'Done ✓',      bg: 'var(--sage-pale)',  color: 'var(--sage)'  }
        : status === 'viewed'
        ? { label: 'In Progress', bg: 'var(--amber-pale)', color: 'var(--amber)' }
        : { label: 'New',         bg: 'var(--cream-2)',    color: 'var(--ink-50)' };
    const href = childId ? `/lessons/${lesson.id}?child_id=${childId}` : `/lessons/${lesson.id}`;

    return (
        <Link href={href} className="no-underline">
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] border transition-colors hover:border-[var(--gold)]"
                style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--ink)' }}>
                        {lesson.title}
                    </div>
                    <div className="text-[10px] mt-0.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                        Wk {lesson.week_number}{lesson.series ? ` · ${lesson.series}` : ''}
                    </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0"
                    style={{ background: badge.bg, color: badge.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {badge.label}
                </span>
            </div>
        </Link>
    );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function SectionLabel({ title, action }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                {title}
            </span>
            {action}
        </div>
    );
}
function PanelLink({ href, children }) {
    return (
        <Link href={href}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium no-underline hover:opacity-70"
            style={{ color: 'var(--gold)' }}>
            {children}
            <ChevronRight size={12} />
        </Link>
    );
}
function EmptyBox({ icon, text }) {
    return (
        <div className="rounded-xl border p-8 text-center" style={{ background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--ink-50)' }}>
            <div className="flex justify-center mb-2 opacity-25">{icon}</div>
            <p className="text-[13px] m-0">{text}</p>
        </div>
    );
}
function ageLabel(age) {
    if (!age) return '';
    if (age <= 5)  return 'Nursery';
    if (age <= 10) return 'Kids';
    return 'Youth';
}