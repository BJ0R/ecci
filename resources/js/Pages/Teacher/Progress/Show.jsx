// resources/js/Pages/Teacher/Progress/Show.jsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, BookOpen, BrainCircuit, BookMarked, CheckCircle2, Clock, BarChart2 } from 'lucide-react';
import TeacherLayout from '@/Components/Layout/TeacherLayout';
import Badge from '@/Components/UI/Badge';

export default function ProgressShow({ child, stats = {}, scoreHistory = [] }) {
    const pct = stats.lessons_total > 0
        ? Math.round((stats.lessons_completed / stats.lessons_total) * 100)
        : 0;

    const familyName = child.user?.family_name || child.user?.name || '—';

    return (
        <TeacherLayout title={`${child.name}'s Progress`}>
            <Head title={`${child.name} — Progress`} />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] mb-6 text-stone-400">
                <Link href="/teacher/progress" className="inline-flex items-center gap-1 no-underline hover:opacity-70 text-stone-400">
                    <ArrowLeft size={13} />
                    All Progress
                </Link>
                <span className="text-stone-200">/</span>
                <span className="font-semibold text-stone-900">{child.name}</span>
            </nav>

            {/* Child header */}
            <div className="flex items-center gap-4 mb-7 rounded-[14px] border border-stone-200 bg-white p-5">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-bold text-white flex-shrink-0"
                    style={{ background: child.avatar_color ?? '#B8923A' }}
                >
                    {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="text-[22px] font-bold text-stone-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {child.name}
                    </div>
                    <div className="text-[12px] text-stone-400">
                        {familyName} · Age {child.age} · {child.age_group ?? child.grade}
                    </div>
                </div>
                {/* Circular progress hint */}
                <div className="text-right">
                    <div className="text-[32px] font-bold text-emerald-600 leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {pct}%
                    </div>
                    <div className="text-[11px] text-stone-400">completion</div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                {[
                    { label: 'Lessons Done',    value: `${stats.lessons_completed ?? 0}/${stats.lessons_total ?? 0}`, icon: BookOpen,     color: 'text-emerald-600' },
                    { label: 'Activities Done', value: stats.quizzes_total   ?? 0,                                    icon: BrainCircuit, color: 'text-amber-500'   },
                    { label: 'Verses Memorized',value: stats.verses_memorized ?? 0,                                   icon: BookMarked,   color: 'text-violet-500'  },
                    { label: 'Badges Earned',   value: stats.badges_earned   ?? 0,                                    icon: Award,        color: 'text-sky-500'     },
                ].map((s, i) => (
                    <div key={i} className="rounded-[14px] border border-stone-200 bg-white p-4">
                        <s.icon size={15} className={`${s.color} mb-2 opacity-70`} />
                        <div className={`text-[28px] font-bold leading-none ${s.color}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {s.value}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Avg score */}
            {stats.quizzes_total > 0 && (
                <div className="flex items-center gap-3 mb-7 rounded-[14px] border border-stone-200 bg-white p-4">
                    <BarChart2 size={16} className="text-amber-500" />
                    <span className="text-[13px] text-stone-600">Average quiz score:</span>
                    <span className="text-[18px] font-bold text-amber-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {stats.average_score ?? '—'}
                    </span>
                    {stats.perfect_scores > 0 && (
                        <Badge status="gold" size="xs">{stats.perfect_scores} perfect</Badge>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Lesson progress */}
                <Section title="Lesson Progress" icon={<BookOpen size={13} />}>
                    {(child.lessonProgresses ?? []).length === 0 ? (
                        <Empty text="No lessons started yet." />
                    ) : child.lessonProgresses.map(lp => (
                        <div key={lp.id} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                            {lp.status === 'completed'
                                ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                : <Clock size={14} className="text-amber-400 flex-shrink-0" />
                            }
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-stone-900 truncate">
                                    {lp.lesson?.title ?? '—'}
                                </div>
                                <div className="text-[10px] text-stone-400">
                                    Wk {lp.lesson?.week_number} · {lp.lesson?.series || 'No series'}
                                </div>
                            </div>
                            <Badge status={lp.status === 'completed' ? 'completed' : 'pending'} size="xs">
                                {lp.status}
                            </Badge>
                        </div>
                    ))}
                </Section>

                {/* Activity submissions */}
                <Section title="Activity Submissions" icon={<BrainCircuit size={13} />}>
                    {(child.activitySubmissions ?? []).length === 0 ? (
                        <Empty text="No activities submitted yet." />
                    ) : child.activitySubmissions.map(sub => {
                        const max    = sub.activity?.max_score ?? 1;
                        const scored = sub.score ?? 0;
                        const pctS   = Math.round((scored / max) * 100);
                        return (
                            <div key={sub.id} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-semibold text-stone-900 truncate">{sub.activity?.title ?? '—'}</div>
                                    <div className="text-[10px] text-stone-400">{sub.activity?.lesson?.title || 'Standalone'}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div
                                        className={`text-[14px] font-bold ${pctS === 100 ? 'text-emerald-600' : pctS >= 60 ? 'text-amber-500' : 'text-rose-500'}`}
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        {scored}/{max}
                                    </div>
                                    <div className="text-[10px] text-stone-400">{pctS}%</div>
                                </div>
                            </div>
                        );
                    })}
                </Section>

                {/* Verses */}
                <Section title="Memory Verses" icon={<BookMarked size={13} />}>
                    {(child.verseCompletions ?? []).length === 0 ? (
                        <Empty text="No verses memorized yet." />
                    ) : child.verseCompletions.map(vc => (
                        <div key={vc.id} className="flex items-center gap-2.5 py-2.5 border-b border-stone-100 last:border-b-0">
                            <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-stone-900 truncate">
                                    {vc.memoryVerse?.reference ?? '—'}
                                </div>
                                <div className="text-[11px] italic text-stone-400 truncate">
                                    {vc.memoryVerse?.verse_text?.slice(0, 60)}…
                                </div>
                            </div>
                        </div>
                    ))}
                </Section>

                {/* Badges */}
                <Section title="Badges Earned" icon={<Award size={13} />}>
                    {(child.badges ?? []).length === 0 ? (
                        <Empty text="No badges earned yet." />
                    ) : (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {child.badges.map(badge => (
                                <div key={badge.id} className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-[10px] border border-amber-200 bg-amber-50">
                                    <Award size={20} className="text-amber-500" />
                                    <span className="text-[11px] font-semibold text-stone-900 text-center">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>
        </TeacherLayout>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-100">
                <span className="text-stone-400">{icon}</span>
                <span className="text-[12px] font-bold text-stone-900">{title}</span>
            </div>
            <div className="px-4 py-1">{children}</div>
        </div>
    );
}

function Empty({ text }) {
    return <p className="text-[12px] text-stone-400 text-center py-8">{text}</p>;
}