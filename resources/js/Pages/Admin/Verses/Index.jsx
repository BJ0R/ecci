import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X, BookOpen, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    FormGroup, FieldInput, FieldTextarea, SubmitButton, DeleteButton,
} from '@/Pages/Admin/Dashboard';

export default function VersesIndex({ verses }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const deletingVerse = verses.data?.find(v => v.id === deletingId);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        verse_text:   '',
        reference:    '',
        week_number:  '',
        context_note: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/verses', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    function handleDelete() {
        router.delete(`/admin/verses/${deletingId}`, { onSuccess: () => setDeletingId(null) });
    }

    return (
        <AdminLayout title="Memory Verses">
            <Head title="Memory Verses — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <PageEyebrow
                    label="Content"
                    title="Memory Verses"
                    desc="Weekly scripture verses sent to all families."
                />
                <button
                    onClick={() => setShowForm(s => !s)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-80 flex-shrink-0 ${showForm ? 'bg-stone-100 text-stone-900' : 'bg-amber-500 text-stone-900'}`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Post Verse</>}
                </button>
            </div>

            {/* ── Inline create form ───────────────────────────────── */}
            {showForm && (
                <div className="rounded-[14px] border border-stone-200 bg-white p-5 md:p-6 mb-6">
                    <div
                        className="text-[20px] font-bold mb-5 text-stone-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Post New Memory Verse
                    </div>
                    <form onSubmit={submit}>
                        <FormGroup label="Verse Text *" error={errors.verse_text}>
                            <FieldTextarea value={data.verse_text} onChange={e => setData('verse_text', e.target.value)} rows={3} placeholder="For God so loved the world…" error={errors.verse_text} />
                        </FormGroup>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <FormGroup label="Reference *" error={errors.reference}>
                                <FieldInput value={data.reference} onChange={e => setData('reference', e.target.value)} placeholder="John 3:16" error={errors.reference} />
                            </FormGroup>
                            <FormGroup label="Week Number *" error={errors.week_number}>
                                <FieldInput value={data.week_number} onChange={e => setData('week_number', e.target.value)} type="number" placeholder="1" error={errors.week_number} />
                            </FormGroup>
                        </div>
                        <FormGroup label="Context Note" error={errors.context_note} helper="Optional: add context or memory tips for parents.">
                            <FieldTextarea value={data.context_note} onChange={e => setData('context_note', e.target.value)} rows={2} placeholder="This verse reminds us…" error={errors.context_note} />
                        </FormGroup>
                        <SubmitButton processing={processing}>Post Verse</SubmitButton>
                    </form>
                </div>
            )}

            {/* ── Verses list ──────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {(!verses.data || verses.data.length === 0) && (
                    <div className="py-14 text-center text-[13px] text-stone-400">
                        No memory verses posted yet. Click "Post Verse" to add one.
                    </div>
                )}

                {verses.data?.map(verse => (
                    <div
                        key={verse.id}
                        className="rounded-[14px] border border-stone-200 bg-white overflow-hidden flex flex-col sm:flex-row sm:items-stretch"
                    >
                        {/* Gold left accent bar */}
                        <div className="hidden sm:block w-2 flex-shrink-0 bg-amber-500" />

                        {/* Main verse content */}
                        <div className="flex-1 px-5 py-4 border-b border-stone-100 sm:border-b-0">
                            {/* Week label */}
                            <div
                                className="flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase mb-2 text-amber-500"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                <BookOpen size={10} />
                                Week {verse.week_number}
                            </div>

                            {/* Verse text */}
                            <blockquote
                                className="text-[15px] italic leading-relaxed m-0 mb-2 text-stone-900"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                "{verse.verse_text}"
                            </blockquote>

                            {/* Reference */}
                            <div className="text-[11px] font-bold tracking-[0.06em] text-amber-500">
                                — {verse.reference}
                            </div>

                            {verse.context_note && (
                                <p className="text-[12px] leading-relaxed mt-2 m-0 text-stone-400">
                                    {verse.context_note}
                                </p>
                            )}
                        </div>

                        {/* Actions sidebar */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between px-4 sm:px-5 py-3 sm:py-4 sm:border-l border-stone-100 gap-3 sm:min-w-[140px]">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                <Badge status="sage" size="sm">
                                    {verse.completions_count ?? 0} done
                                </Badge>
                            </div>
                            <div
                                className="text-[10px] text-stone-400"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {verse.created_at ? new Date(verse.created_at).toLocaleDateString() : ''}
                            </div>
                            <DeleteButton onClick={() => setDeletingId(verse.id)} label="Remove" />
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={verses.links ?? []} />

            <Modal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Remove Verse?"
                confirmLabel="Yes, Remove"
                confirmVariant="danger"
                onConfirm={handleDelete}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    Remove <strong>{deletingVerse?.reference}</strong>? Completion records for this verse will also be deleted.
                </p>
            </Modal>
        </AdminLayout>
    );
}