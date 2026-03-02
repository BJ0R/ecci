import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, BookOpen, Eye } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    TableHeader, TableCell, DeleteButton,
} from '@/Pages/Admin/Dashboard';

export default function LessonsIndex({ lessons }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const deletingLesson = lessons.data?.find(l => l.id === deletingId);

    function handleDelete() {
        router.delete(`/admin/lessons/${deletingId}`, { onSuccess: () => setDeletingId(null) });
    }

    const ageGroupColors = { nursery: 'amber', kids: 'sky', youth: 'sage' };

    return (
        <AdminLayout title="Lessons">
            <Head title="Lessons — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* ── Page header ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <PageEyebrow
                    label="Content"
                    title="All Lessons"
                    desc={`${lessons.meta?.total ?? lessons.data?.length ?? 0} lessons total`}
                />
                <Link
                    href="/admin/lessons/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold no-underline flex-shrink-0 transition-opacity hover:opacity-80 bg-stone-900 text-amber-50"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    <Plus size={15} />
                    New Lesson
                </Link>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="rounded-[14px] border border-stone-200 bg-white overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHeader columns={['', 'Title', 'Series', 'Week', 'Age Group', 'Activities', 'Views', 'Status', '']} />
                    <tbody>
                        {(!lessons.data || lessons.data.length === 0) && (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-[13px] text-stone-400">
                                    No lessons yet.{' '}
                                    <Link href="/admin/lessons/create" className="no-underline font-medium text-amber-500">
                                        Create the first one →
                                    </Link>
                                </td>
                            </tr>
                        )}

                        {lessons.data?.map(lesson => (
                            <tr
                                key={lesson.id}
                                className="transition-colors duration-100 hover:bg-amber-50"
                            >
                                {/* Publish dot */}
                                <TableCell>
                                    <div
                                        className={`w-2 h-2 rounded-full ${lesson.is_published ? 'bg-emerald-600' : 'bg-stone-200'}`}
                                        title={lesson.is_published ? 'Published' : 'Draft'}
                                    />
                                </TableCell>

                                <TableCell>
                                    <div className="font-semibold text-[13px] text-stone-900">
                                        {lesson.title}
                                    </div>
                                    {lesson.creator && (
                                        <div className="text-[10px] mt-0.5 text-stone-400">
                                            by {lesson.creator.name}
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell muted>{lesson.series || '—'}</TableCell>

                                <TableCell mono>
                                    <span className="flex items-center gap-1 text-stone-400">
                                        Wk {lesson.week_number}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <Badge status={ageGroupColors[lesson.age_group] || 'kids'} size="xs">
                                        {lesson.age_group}
                                    </Badge>
                                </TableCell>

                                <TableCell mono muted>{lesson.activities_count ?? 0}</TableCell>

                                <TableCell mono>
                                    <span className="flex items-center gap-1 text-stone-400">
                                        <Eye size={10} />
                                        {lesson.lesson_progresses_count ?? 0}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <Badge status={lesson.is_published ? 'published' : 'draft'} size="xs">
                                        {lesson.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Link
                                            href={`/admin/lessons/${lesson.id}/edit`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold no-underline border border-stone-200 bg-stone-50 text-stone-900 transition-colors hover:bg-stone-100"
                                        >
                                            <Pencil size={10} />
                                            Edit
                                        </Link>
                                        <DeleteButton onClick={() => setDeletingId(lesson.id)} />
                                    </div>
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={lessons.links ?? []} />

            <Modal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Archive Lesson?"
                confirmLabel="Yes, Archive"
                confirmVariant="danger"
                onConfirm={handleDelete}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    Archive <strong>{deletingLesson?.title}</strong>? The lesson will be hidden from parents
                    but all child progress data will be preserved.
                </p>
            </Modal>
        </AdminLayout>
    );
}