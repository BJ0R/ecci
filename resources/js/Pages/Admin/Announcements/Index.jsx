import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X, Pin, Trash2 } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    FormGroup, FieldInput, FieldTextarea, SubmitButton,
} from '@/Pages/Admin/Dashboard';

export default function AnnouncementsIndex({ announcements }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const deletingAnn = announcements.data?.find(a => a.id === deletingId);

    const { data, setData, post, processing, errors, reset } = useForm({
        title:  '',
        body:   '',
        pinned: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/announcements', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    function handleDelete() {
        router.delete(`/admin/announcements/${deletingId}`, { onSuccess: () => setDeletingId(null) });
    }

    return (
        <AdminLayout title="Announcements">
            <Head title="Announcements — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <PageEyebrow
                    label="Communication"
                    title="Announcements"
                    desc="Broadcast messages to all approved families."
                />
                <button
                    onClick={() => setShowForm(s => !s)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-80 flex-shrink-0 ${showForm ? 'bg-stone-100 text-stone-900' : 'bg-stone-900 text-amber-50'}`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Announcement</>}
                </button>
            </div>

            {/* ── Inline create form ───────────────────────────────── */}
            {showForm && (
                <div className="rounded-[14px] border border-stone-200 bg-white p-5 md:p-6 mb-6">
                    <div
                        className="text-[20px] font-bold mb-5 text-stone-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        New Announcement
                    </div>
                    <form onSubmit={submit}>
                        <FormGroup label="Title *" error={errors.title}>
                            <FieldInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Sunday Service Update" error={errors.title} />
                        </FormGroup>
                        <FormGroup label="Message *" error={errors.body}>
                            <FieldTextarea value={data.body} onChange={e => setData('body', e.target.value)} rows={4} placeholder="Write your announcement here…" error={errors.body} />
                        </FormGroup>

                        {/* Pinned toggle */}
                        <label className="flex items-start gap-3 mb-5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.pinned}
                                onChange={e => setData('pinned', e.target.checked)}
                                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-amber-500"
                            />
                            <div>
                                <div className="text-[13px] font-medium text-stone-900">Pin this announcement</div>
                                <div className="text-[11px] mt-0.5 text-stone-400">
                                    Pinned announcements appear at the top of the parent dashboard.
                                </div>
                            </div>
                        </label>

                        <SubmitButton processing={processing}>Post Announcement</SubmitButton>
                    </form>
                </div>
            )}

            {/* ── Announcements list ───────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {(!announcements.data || announcements.data.length === 0) && (
                    <div className="py-14 text-center text-[13px] text-stone-400">
                        No announcements yet.
                    </div>
                )}

                {announcements.data?.map(ann => (
                    <div
                        key={ann.id}
                        className={`rounded-[14px] border flex items-start justify-between gap-4 px-5 py-4 bg-white ${ann.pinned ? 'border-amber-500 border-[1.5px]' : 'border-stone-200'}`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                <span className="text-[14px] font-bold text-stone-900">{ann.title}</span>
                                {ann.pinned && (
                                    <Badge status="gold" size="xs">
                                        <Pin size={9} className="mr-0.5" />
                                        Pinned
                                    </Badge>
                                )}
                            </div>
                            <p className="text-[13px] leading-relaxed m-0 text-stone-600">{ann.body}</p>
                            <div
                                className="text-[10px] mt-2 text-stone-400"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {ann.created_at ? new Date(ann.created_at).toLocaleDateString() : ''}
                            </div>
                        </div>
                        <button
                            onClick={() => setDeletingId(ann.id)}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none cursor-pointer text-[11px] font-semibold transition-opacity hover:opacity-70 bg-rose-50 text-rose-500"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <Trash2 size={12} />
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <Pagination links={announcements.links ?? []} />

            <Modal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Remove Announcement?"
                confirmLabel="Yes, Remove"
                confirmVariant="danger"
                onConfirm={handleDelete}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    Remove <strong>"{deletingAnn?.title}"</strong>? It will disappear from all family dashboards immediately.
                </p>
            </Modal>
        </AdminLayout>
    );
}