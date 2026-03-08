// resources/js/Pages/Teacher/Progress/Index.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { TrendingUp, Baby, Activity, Award, ChevronRight, Star } from 'lucide-react';
import TeacherLayout from '@/Components/Layout/TeacherLayout';
import Badge from '@/Components/UI/Badge';
import {
    FlashMessage, PageEyebrow, Pagination,
    TableHeader, TableCell,
} from '@/Pages/Admin/Dashboard';

export default function ProgressIndex({ children, summary = {}, topEarners = [], recentSubmissions = [] }) {
    const { flash } = usePage().props;

    const summaryCards = [
        { label: 'Total Children',   value: summary.total_children    ?? 0, icon: Baby,     color: 'text-sky-500'     },
        { label: 'Avg Completion',   value: `${summary.avg_completion ?? 0}%`, icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'Active This Week', value: summary.active_this_week  ?? 0, icon: Activity, color: 'text-amber-500'   },
        { label: 'Total Lessons',    value: summary.total_lessons     ?? 0, icon: null,     color: 'text-stone-400'   },
        { label: 'Avg Score',        value: summary.avg_score         ?? 0, icon: null,     color: 'text-violet-500'  },
    ];

    return (
        <TeacherLayout title="Progress">
            <Head title="Progress — ECCII Teacher" />
            <FlashMessage flash={flash} />

            <PageEyebrow
                label="Tracking"
                title="Student Progress"
                desc={`Viewing ${summary.total_children ?? 0} children across all families`}
            />

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
                {summaryCards.map((s, i) => (
                    <div key={i} className="rounded-[14px] border border-stone-200 bg-white p-4">
                        <div
                            className={`text-[30px] font-bold leading-none mb-1 ${s.color}`}
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {s.value}
                        </div>
                        <div className="text-[11px] text-stone-400">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">

                {/* Children table */}
                <div>
                    <div className="rounded-[14px] border border-stone-200 bg-white overflow-x-auto mb-4">
                        <table className="w-full border-collapse">
                            <TableHeader columns={['Child', 'Family', 'Age Group', 'Lessons', 'Completion', 'Activities', 'Badges', '']} />
                            <tbody>
                                {(!children?.data || children.data.length === 0) && (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[13px] text-stone-400">
                                            No children registered yet.
                                        </td>
                                    </tr>
                                )}
                                {children?.data?.map(child => {
                                    const completed  = child.lessons_completed_count ?? 0;
                                    const total      = child.lessons_total ?? 1;
                                    const pct        = total > 0 ? Math.round((completed / total) * 100) : 0;

                                    return (
                                        <tr key={child.id} className="hover:bg-amber-50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                                        style={{ background: child.avatar_color ?? '#B8923A' }}
                                                    >
                                                        {child.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-[13px] text-stone-900">{child.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell muted>
                                                {child.user?.family_name || child.user?.name || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge status="amber" size="xs">{child.age_group ?? '—'}</Badge>
                                            </TableCell>
                                            <TableCell mono muted>
                                                {completed}/{total}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 min-w-[80px]">
                                                    <div className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-400'}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-stone-600 w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell mono muted>{child.activity_submissions_count ?? 0}</TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1 text-amber-500">
                                                    <Award size={11} />
                                                    <span className="text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                        {child.badges_count ?? 0}
                                                    </span>
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/teacher/progress/${child.id}`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold no-underline border border-stone-200 bg-stone-50 text-stone-900 hover:bg-stone-100"
                                                >
                                                    View
                                                    <ChevronRight size={10} />
                                                </Link>
                                            </TableCell>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={children?.links ?? []} />
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-5">

                    {/* Top earners */}
                    <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
                        <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-1.5">
                            <Star size={13} className="text-amber-500" />
                            <span className="text-[12px] font-bold text-stone-900">Top Badge Earners</span>
                        </div>
                        <div className="px-4 py-2">
                            {topEarners.length === 0 ? (
                                <p className="text-[12px] text-stone-400 py-4 text-center">No badges awarded yet.</p>
                            ) : topEarners.map((child, i) => (
                                <div key={child.id} className="flex items-center gap-2.5 py-2.5 border-b border-stone-100 last:border-b-0">
                                    <span className="text-[11px] font-bold w-5 text-stone-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        #{i + 1}
                                    </span>
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                        style={{ background: child.avatar_color ?? '#B8923A' }}
                                    >
                                        {child.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="flex-1 text-[12px] font-semibold text-stone-900">{child.name}</span>
                                    <span className="flex items-center gap-0.5 text-amber-500">
                                        <Award size={11} />
                                        <span className="text-[11px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {child.badges_count ?? 0}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent submissions */}
                    <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
                        <div className="px-4 py-3 border-b border-stone-100">
                            <span className="text-[12px] font-bold text-stone-900">Recent Submissions</span>
                        </div>
                        <div className="px-4 py-2">
                            {recentSubmissions.length === 0 ? (
                                <p className="text-[12px] text-stone-400 py-4 text-center">No submissions yet.</p>
                            ) : recentSubmissions.map(s => (
                                <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                                    <div>
                                        <div className="text-[12px] font-semibold text-stone-900">{s.childProfile?.name ?? '—'}</div>
                                        <div className="text-[10px] text-stone-400">{s.activity?.title ?? '—'}</div>
                                    </div>
                                    <span className="text-[12px] font-bold text-amber-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {s.score}/{s.activity?.max_score ?? '?'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}