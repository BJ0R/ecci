import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardCheck, Trophy, TrendingUp } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import ProgressBar from '@/Components/UI/ProgressBar';
import { FlashMessage, PageEyebrow, Pagination } from '@/Pages/Admin/Dashboard';

export default function ProgressIndex({ children: childrenPaginator = {}, summary = {} }) {
    const { flash } = usePage().props;
    const children = childrenPaginator.data ?? [];

    const summaryCards = [
        { label: 'Total Children',   value: summary.total_children    ?? children.length, icon: TrendingUp,     colorClass: 'text-sky-500'     },
        { label: 'Avg. Completion',  value: `${summary.avg_completion ?? 0}%`,             icon: TrendingUp,     colorClass: 'text-emerald-600' },
        { label: 'Active This Week', value: summary.active_this_week  ?? 0,                icon: ClipboardCheck, colorClass: 'text-amber-500'   },
    ];

    return (
        <AdminLayout title="Progress Overview">
            <Head title="Progress — ECCII Admin" />
            <FlashMessage flash={flash} />

            <PageEyebrow
                label="Overview"
                title="All Children Progress"
                desc="See how every child across all families is progressing."
            />

            {/* Summary stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7">
                {summaryCards.map((s, i) => (
                    <div key={i} className="rounded-[14px] border border-stone-200 bg-white p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <s.icon size={15} className={`${s.colorClass} opacity-70`} />
                        </div>
                        <div
                            className={`text-[32px] font-bold leading-none mb-1 ${s.colorClass}`}
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {s.value}
                        </div>
                        <div className="text-[11px] text-stone-400">{s.label}</div>
                    </div>
                ))}
            </div>

            {children.length === 0 ? (
                <div className="py-16 text-center text-[13px] text-stone-400">
                    No child profiles yet. Families need to register and add children.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {children.map(child => {
                        const completed = child.lessons_completed_count ?? 0;
                        const total     = child.lessons_total ?? 1;
                        const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
                        const ageGroup  = child.age <= 5 ? 'nursery' : child.age <= 10 ? 'kids' : 'youth';
                        const ageLabel  = child.age <= 5 ? 'Nursery' : child.age <= 10 ? 'Kids' : 'Youth';

                        return (
                            <div
                                key={child.id}
                                className="rounded-[14px] border border-stone-200 bg-white grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 p-4 md:p-5 items-center"
                            >
                                {/* Child info */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[16px] font-bold text-stone-900"
                                        style={{ background: child.avatar_color || '#F59E0B' }}
                                    >
                                        {child.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[14px] text-stone-900">{child.name}</div>
                                        <div className="text-[11px] mb-1 text-stone-400">
                                            {child.user?.family_name || child.user?.name} · Age {child.age}
                                        </div>
                                        <Badge status={ageGroup} size="xs">{ageLabel}</Badge>
                                    </div>
                                </div>

                                {/* Progress bar + stats */}
                                <div>
                                    <ProgressBar value={pct} label={`${completed}/${total} lessons`} color="sage" />
                                    <div className="flex flex-wrap gap-4 mt-2 text-[11px] text-stone-400">
                                        <span className="flex items-center gap-1">
                                            <ClipboardCheck size={11} />
                                            {child.activity_submissions_count ?? 0} activities done
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Trophy size={11} />
                                            {child.badges_count ?? 0} badges earned
                                        </span>
                                    </div>
                                </div>

                                {/* Big % number */}
                                <div
                                    className={`text-[28px] font-bold leading-none text-right flex-shrink-0 ${pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-stone-400'}`}
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {pct}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Pagination links={childrenPaginator.links ?? []} />
        </AdminLayout>
    );
}