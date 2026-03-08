// resources/js/Pages/Teacher/Dashboard.jsx
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen, BrainCircuit, Baby, ClipboardList,
    BookMarked, Plus, TrendingUp, ChevronRight,
    CheckCircle2, XCircle,
} from 'lucide-react';
import TeacherLayout from '@/Components/Layout/TeacherLayout';
import Badge from '@/Components/UI/Badge';
import { usePage } from '@inertiajs/react';

export default function TeacherDashboard({ stats = {}, recentLessons = [], recentSubmissions = [] }) {
    const { flash } = usePage().props;

    const statCards = [
        { label: 'Published Lessons', value: stats.published_lessons ?? 0, icon: BookOpen,      color: 'text-emerald-600', sub: `${stats.draft_lessons ?? 0} drafts` },
        { label: 'Total Activities',  value: stats.total_activities  ?? 0, icon: BrainCircuit,  color: 'text-amber-500'   },
        { label: 'Total Children',    value: stats.total_children    ?? 0, icon: Baby,          color: 'text-sky-500'     },
        { label: 'Submissions Today', value: stats.submissions_today ?? 0, icon: ClipboardList, color: 'text-amber-600'   },
        { label: 'Memory Verses',     value: stats.total_verses      ?? 0, icon: BookMarked,    color: 'text-violet-500'  },
    ];

    const quickActions = [
        { href: '/teacher/lessons/create',  label: 'New Lesson',     icon: BookOpen,     bg: 'bg-stone-900 text-amber-50'  },
        { href: '/teacher/activities/create', label: 'New Activity',  icon: BrainCircuit, bg: 'bg-amber-500 text-stone-900' },
        { href: '/teacher/verses',           label: 'Post Verse',     icon: BookMarked,   bg: 'bg-emerald-600 text-white'   },
        { href: '/teacher/progress',         label: 'View Progress',  icon: TrendingUp,   bg: 'bg-sky-500 text-white'       },
    ];

    return (
        <TeacherLayout title="Dashboard">
            <Head title="Dashboard — ECCII Teacher" />

            {flash?.success && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-[13px] border bg-emerald-50 border-emerald-200 text-emerald-600">
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-px" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-[13px] border bg-rose-50 border-rose-200 text-rose-500">
                    <XCircle size={15} className="flex-shrink-0 mt-px" />
                    {flash.error}
                </div>
            )}

            {/* Eyebrow */}
            <div className="mb-6">
                <div
                    className="flex items-center gap-2 text-[9px] tracking-[0.22em] uppercase mb-1.5 text-amber-500"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <span className="w-4 h-px flex-shrink-0 inline-block bg-amber-500" />
                    Overview
                </div>
                <h1
                    className="text-[28px] font-bold leading-tight m-0 text-stone-900"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    Teacher Dashboard
                </h1>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
                {statCards.map((s, i) => (
                    <div key={i} className="rounded-[14px] border border-stone-200 bg-white p-4 flex flex-col gap-1">
                        <s.icon size={16} className={`${s.color} opacity-70 mb-1`} />
                        <div
                            className={`text-[34px] font-bold leading-none ${s.color}`}
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {s.value}
                        </div>
                        <div className="text-[11px] text-stone-400">{s.label}</div>
                        {s.sub && <div className="text-[10px] text-stone-300 mt-0.5">{s.sub}</div>}
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2.5 mb-7">
                {quickActions.map((a, i) => (
                    <Link
                        key={i}
                        href={a.href}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold no-underline transition-opacity hover:opacity-80 ${a.bg}`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <a.icon size={14} />
                        {a.label}
                    </Link>
                ))}
            </div>

            {/* Two-column panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Recent lessons */}
                <Panel
                    title="Recent Lessons"
                    icon={<BookOpen size={13} className="text-stone-400" />}
                    action={<PanelLink href="/teacher/lessons">View all</PanelLink>}
                >
                    {recentLessons.length === 0 ? (
                        <EmptyState icon={<BookOpen size={26} />} text="No lessons yet. Create the first one!" />
                    ) : recentLessons.map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                            <div>
                                <div className="text-[13px] font-semibold text-stone-900">{lesson.title}</div>
                                <div className="text-[11px] text-stone-400">
                                    Wk {lesson.week_number} · {lesson.activities_count ?? 0} activities
                                </div>
                            </div>
                            <Badge status={lesson.is_published ? 'completed' : 'draft'} size="xs">
                                {lesson.is_published ? 'Live' : 'Draft'}
                            </Badge>
                        </div>
                    ))}
                </Panel>

                {/* Recent submissions */}
                <Panel
                    title="Recent Submissions"
                    icon={<ClipboardList size={13} className="text-stone-400" />}
                    action={<PanelLink href="/teacher/progress">View progress</PanelLink>}
                >
                    {recentSubmissions.length === 0 ? (
                        <EmptyState icon={<ClipboardList size={26} />} text="No submissions yet." />
                    ) : recentSubmissions.map(s => (
                        <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                            <div>
                                <div className="text-[13px] font-semibold text-stone-900">{s.child?.name ?? '—'}</div>
                                <div className="text-[11px] text-stone-400">{s.activity?.title ?? '—'}</div>
                            </div>
                            <div
                                className="text-[14px] font-bold text-amber-500"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {s.score}/{s.activity?.max_score ?? '?'}
                            </div>
                        </div>
                    ))}
                </Panel>
            </div>
        </TeacherLayout>
    );
}

function Panel({ title, icon, action, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-[12px] font-bold text-stone-900">{title}</span>
                </div>
                {action}
            </div>
            <div className="px-4 md:px-5 py-1">{children}</div>
        </div>
    );
}

function PanelLink({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium no-underline transition-opacity hover:opacity-70 text-amber-500"
        >
            {children}
            <ChevronRight size={12} />
        </Link>
    );
}

function EmptyState({ icon, text }) {
    return (
        <div className="flex flex-col items-center py-10 gap-3 text-stone-400">
            <div className="opacity-30">{icon}</div>
            <p className="text-[12px] text-center">{text}</p>
        </div>
    );
}