import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, BrainCircuit, PenLine } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    TableHeader, TableCell, DeleteButton,
} from '@/Pages/Admin/Dashboard';

export default function ActivitiesIndex({ activities }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const deletingActivity = activities.data?.find(a => a.id === deletingId);

    function handleDelete() {
        router.delete(`/admin/activities/${deletingId}`, { onSuccess: () => setDeletingId(null) });
    }

    const typeConfig = {
        quiz: { label: 'Quiz',             Icon: BrainCircuit, colorClass: 'text-amber-500 bg-amber-100'   },
        fill: { label: 'Fill in the Blank', Icon: PenLine,     colorClass: 'text-violet-600 bg-violet-50'  },
    };

    return (
        <AdminLayout title="Activities">
            <Head title="Activities — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <PageEyebrow
                    label="Content"
                    title="All Activities"
                    desc={`${activities.meta?.total ?? activities.data?.length ?? 0} activities`}
                />
                <Link
                    href="/admin/activities/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold no-underline flex-shrink-0 transition-opacity hover:opacity-80 bg-stone-900 text-amber-50"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    <Plus size={15} />
                    New Activity
                </Link>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="rounded-[14px] border border-stone-200 bg-white overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHeader columns={['Title', 'Type', 'Linked Lesson', 'Submissions', 'Max Score', '']} />
                    <tbody>
                        {(!activities.data || activities.data.length === 0) && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-[13px] text-stone-400">
                                    No activities yet.{' '}
                                    <Link href="/admin/activities/create" className="no-underline font-medium text-amber-500">
                                        Create the first one →
                                    </Link>
                                </td>
                            </tr>
                        )}
                        {activities.data?.map(activity => {
                            const tc = typeConfig[activity.type] ?? typeConfig.quiz;
                            return (
                                <tr
                                    key={activity.id}
                                    className="transition-colors duration-100 hover:bg-amber-50"
                                >
                                    <TableCell>
                                        <span className="font-semibold text-[13px] text-stone-900">
                                            {activity.title}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${tc.colorClass}`}
                                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                        >
                                            <tc.Icon size={11} />
                                            {tc.label}
                                        </span>
                                    </TableCell>
                                    <TableCell muted>
                                        {activity.lesson ? (
                                            <Link
                                                href={`/admin/lessons/${activity.lesson.id}/edit`}
                                                className="text-[12px] no-underline font-medium hover:underline text-amber-500"
                                            >
                                                {activity.lesson.title}
                                            </Link>
                                        ) : (
                                            <span className="text-[11px] italic text-stone-400">
                                                Standalone
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell mono muted>{activity.submissions_count ?? 0}</TableCell>
                                    <TableCell mono muted>{activity.max_score}</TableCell>
                                    <TableCell>
                                        <DeleteButton onClick={() => setDeletingId(activity.id)} />
                                    </TableCell>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination links={activities.links ?? []} />

            <Modal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Delete Activity?"
                confirmLabel="Yes, Delete"
                confirmVariant="danger"
                onConfirm={handleDelete}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    Delete <strong>{deletingActivity?.title}</strong>?
                    All child submission records will be permanently removed.
                </p>
            </Modal>
        </AdminLayout>
    );
}