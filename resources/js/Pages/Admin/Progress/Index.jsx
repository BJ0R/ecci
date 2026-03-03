// resources/js/Pages/Admin/Progress/Index.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ClipboardCheck, Trophy, TrendingUp,
    Users, BookOpen, Star, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import {
    FlashMessage, PageEyebrow
} from '@/Pages/Admin/Dashboard';

// Pill-style pagination (matches Activities page button style)
function MiniPagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center gap-1.5">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-stone-500 hover:text-amber-600 disabled:opacity-30 transition-colors"
            >
                « Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;
                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`
                            w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                            ${isActive 
                                ? 'bg-stone-900 text-amber-50 shadow-sm' 
                                : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50'
                            }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-stone-600 hover:text-amber-600 disabled:opacity-30 transition-colors"
            >
                Next »
            </button>
        </div>
    );
}

function AgeBadge({ ageGroup }) {
    const config = {
        nursery: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nursery' },
        kids:    { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Kids'    },
        youth:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Youth' },
    };
    const { bg, text, label } = config[ageGroup] || config.kids;
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${bg} ${text}`}>
            {label}
        </span>
    );
}

function ProgressBar({ value = 0, color = 'amber' }) {
    const clamped = Math.max(0, Math.min(100, value));
    const colors = {
        amber: 'bg-amber-500',
        emerald: 'bg-emerald-500',
    };
    return (
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-500 ${colors[color] || colors.amber}`}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}

export default function ProgressIndex({
    children: childrenPaginator = {},
    summary = {},
    recentSubmissions = [],
}) {
    const { flash } = usePage().props;
    const children = childrenPaginator.data ?? [];
    const links = childrenPaginator.links ?? [];

    // Client-side pagination for recent submissions (5 per page)
    const [submissionsPage, setSubmissionsPage] = useState(1);
    const submissionsPerPage = 5;
    const totalSubmissionPages = Math.ceil(recentSubmissions.length / submissionsPerPage);
    const paginatedSubmissions = recentSubmissions.slice(
        (submissionsPage - 1) * submissionsPerPage,
        submissionsPage * submissionsPerPage
    );

    const statCards = [
        { icon: Users,         value: summary.total_children    ?? 0,    label: 'Total Children',       color: 'text-blue-600',  bg: 'bg-blue-50'   },
        { icon: TrendingUp,     value: `${summary.avg_completion ?? 0}%`, label: 'Avg. Completion',      color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: ClipboardCheck, value: summary.active_this_week  ?? 0,    label: 'Active This Week',     color: 'text-amber-600', bg: 'bg-amber-50'   },
        { icon: BookOpen,       value: summary.total_lessons     ?? 0,    label: 'Total Lessons',        color: 'text-stone-500', bg: 'bg-stone-100'  },
        { icon: Star,           value: summary.total_submissions ?? 0,    label: 'Activities Submitted', color: 'text-amber-600', bg: 'bg-amber-50'   },
        { icon: Trophy,         value: `${summary.avg_score       ?? 0}%`, label: 'Avg Quiz Score',       color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <AdminLayout>
            <Head title="Progress — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <PageEyebrow
                    label="Overview"
                    title="All Children Progress"
                    desc={`${childrenPaginator.total ?? children.length} children`}
                />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-5">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-lg border border-stone-200 p-3 flex items-start gap-2.5 shadow-sm">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${s.bg}`}>
                            <s.icon size={14} className={s.color} />
                        </div>
                        <div>
                            <div className={`text-xl font-bold leading-none mb-0.5 ${s.color}`}>
                                {s.value}
                            </div>
                            <div className="text-[10px] text-stone-500">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Children table */}
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden mb-4 shadow-sm">
                <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-tight">Children Progress</h3>
                    <span className="text-[10px] text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded">
                        {childrenPaginator.total ?? 0} Total Records
                    </span>
                </div>

                {/* Column headers – now using Activities page typography */}
                <div className="grid grid-cols-[180px_1fr] gap-3 px-4 py-2 border-b border-stone-200 bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <div>Child Profile</div>
                    <div>Learning Status</div>
                </div>

                {children.length === 0 ? (
                    <div className="py-10 text-center text-sm text-stone-400 italic">
                        No active students found in this range.
                    </div>
                ) : (
                    children.map((child, idx) => {
                        const completed = child.lessons_completed_count ?? 0;
                        const total = child.lessons_total ?? 0;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                        const ageGroup = child.age <= 5 ? 'nursery' : child.age <= 10 ? 'kids' : 'youth';
                        const isLast = idx === children.length - 1;

                        return (
                            <div
                                key={child.id}
                                className={`grid grid-cols-[180px_1fr] gap-3 px-4 py-3 items-center transition-colors hover:bg-amber-50/50 ${!isLast ? 'border-b border-stone-100' : ''}`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm border border-white"
                                        style={{ backgroundColor: child.avatar_color || '#D4930A', color: '#06091A' }}
                                    >
                                        {child.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/admin/progress/${child.id}`}
                                            className="text-sm font-semibold text-stone-900 truncate block hover:text-amber-600 transition-colors"
                                        >
                                            {child.name}
                                        </Link>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <AgeBadge ageGroup={ageGroup} />
                                            <span className="text-[10px] text-stone-400">Age {child.age}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs text-stone-500">
                                            <strong className="text-stone-700">{completed}</strong> of {total} lessons
                                        </span>
                                        <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${pct >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {pct}%
                                        </span>
                                    </div>
                                    <ProgressBar value={pct} color={pct >= 80 ? 'emerald' : 'amber'} />
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Server‑side pagination for children (pill style) */}
                {links && links.length > 3 && (
                    <div className="px-4 py-4 border-t border-stone-100 bg-stone-50/30 flex justify-center">
                        <div className="flex items-center gap-1.5">
                            {links.map((link, i) => {
                                const label = link.label
                                    .replace('&laquo; Previous', '« Previous')
                                    .replace('Next &raquo;', 'Next »');
                                const isControl = label.includes('Previous') || label.includes('Next');
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        as="button"
                                        disabled={!link.url}
                                        className={`
                                            transition-all duration-200 text-sm font-semibold
                                            ${isControl 
                                                ? 'px-3 py-1.5 text-stone-500 hover:text-amber-600 disabled:opacity-30' 
                                                : `w-8 h-8 flex items-center justify-center rounded-lg border 
                                                   ${link.active 
                                                      ? 'bg-stone-900 border-stone-900 text-amber-50 shadow-md scale-105' 
                                                      : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50'}`}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent submissions table */}
            {recentSubmissions.length > 0 && (
                <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
                    <div className="px-4 py-2 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-600 flex items-center gap-2">
                            <ClipboardCheck size={12} className="text-amber-500" />
                            Recent Activity Submissions
                        </span>
                    </div>

                    <div className="grid grid-cols-[1fr_1fr_50px] gap-3 px-4 py-2 border-b border-stone-200 bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        <div>Child</div>
                        <div>Activity</div>
                        <div className="text-right">Score</div>
                    </div>

                    {paginatedSubmissions.map((sub, i) => {
                        const maxScore = sub.activity?.max_score ?? 0;
                        const pct = maxScore > 0 ? Math.round((sub.score / maxScore) * 100) : null;
                        const isLast = i === paginatedSubmissions.length - 1;

                        return (
                            <div
                                key={i}
                                className={`grid grid-cols-[1fr_1fr_50px] gap-3 px-4 py-2 items-center transition-colors hover:bg-amber-50 ${!isLast ? 'border-b border-stone-100' : ''}`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                                        style={{ backgroundColor: sub.child_profile?.avatar_color || '#D4930A', color: '#06091A' }}
                                    >
                                        {(sub.child_profile?.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-stone-700 truncate">
                                        {sub.child_profile?.name ?? '—'}
                                    </span>
                                </div>
                                <span className="text-sm text-stone-500 truncate">
                                    {sub.activity?.title ?? '—'}
                                </span>
                                <div className="text-right text-sm font-semibold">
                                    {pct}%
                                </div>
                            </div>
                        );
                    })}

                    {/* Client‑side pill pagination for submissions */}
                    {totalSubmissionPages > 1 && (
                        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50/30 flex justify-center">
                            <MiniPagination 
                                currentPage={submissionsPage}
                                totalPages={totalSubmissionPages}
                                onPageChange={setSubmissionsPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}