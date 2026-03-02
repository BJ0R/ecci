import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import {
    PageEyebrow, FormGroup,
    FieldInput, FieldTextarea, FieldSelect, SubmitButton,
} from '@/Pages/Admin/Dashboard';

export default function LessonsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title:                '',
        series:               '',
        week_number:          '',
        age_group:            '',
        is_published:         false,
        bible_reference:      '',
        bible_text:           '',
        explanation:          '',
        reflection_questions: [''],
        prayer:               '',
    });

    function addReflection() {
        setData('reflection_questions', [...(data.reflection_questions || []), '']);
    }
    function updateReflection(i, val) {
        const updated = [...(data.reflection_questions || [])];
        updated[i] = val;
        setData('reflection_questions', updated);
    }
    function removeReflection(i) {
        setData('reflection_questions', (data.reflection_questions || []).filter((_, idx) => idx !== i));
    }
    function submit(e) {
        e.preventDefault();
        post('/admin/lessons');
    }

    const ageGroups = [
        { value: 'nursery', label: 'Nursery (Ages 3–5)' },
        { value: 'kids',    label: 'Kids (Ages 6–10)'   },
        { value: 'youth',   label: 'Youth (Ages 11–15)' },
    ];

    return (
        <AdminLayout title="New Lesson">
            <Head title="Create Lesson — ECCII Admin" />

            {/* ── Breadcrumb ───────────────────────────────────────── */}
            <nav className="flex items-center gap-2 text-[12px] mb-6 text-stone-400">
                <Link
                    href="/admin/lessons"
                    className="inline-flex items-center gap-1 no-underline transition-colors hover:opacity-70 text-stone-400"
                >
                    <ArrowLeft size={13} />
                    All Lessons
                </Link>
                <span className="text-stone-200">/</span>
                <span className="font-semibold text-stone-900">New Lesson</span>
            </nav>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                    {/* ── Left: main content ──────────────────────── */}
                    <div className="flex flex-col gap-5">

                        <SectionCard title="Lesson Info">
                            <FormGroup label="Title *" error={errors.title}>
                                <FieldInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. David and Goliath" error={errors.title} />
                            </FormGroup>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <FormGroup label="Series" error={errors.series}>
                                    <FieldInput value={data.series} onChange={e => setData('series', e.target.value)} placeholder="e.g. Heroes of Faith" error={errors.series} />
                                </FormGroup>
                                <FormGroup label="Week Number *" error={errors.week_number}>
                                    <FieldInput value={data.week_number} onChange={e => setData('week_number', e.target.value)} type="number" placeholder="1" error={errors.week_number} />
                                </FormGroup>
                            </div>
                            <FormGroup label="Age Group *" error={errors.age_group}>
                                <FieldSelect value={data.age_group} onChange={e => setData('age_group', e.target.value)} options={ageGroups} placeholder="Select age group…" error={errors.age_group} />
                            </FormGroup>
                        </SectionCard>

                        <SectionCard title="Bible Content">
                            <FormGroup label="Bible Reference" error={errors.bible_reference} helper="e.g. 1 Samuel 17:45-47">
                                <FieldInput value={data.bible_reference} onChange={e => setData('bible_reference', e.target.value)} placeholder="John 3:16" error={errors.bible_reference} />
                            </FormGroup>
                            <FormGroup label="Bible Text" error={errors.bible_text} helper="Paste or type the scripture passage.">
                                <FieldTextarea value={data.bible_text} onChange={e => setData('bible_text', e.target.value)} rows={5} placeholder="For God so loved the world…" error={errors.bible_text} />
                            </FormGroup>
                            <FormGroup label="Explanation / Lesson Body" error={errors.explanation}>
                                <FieldTextarea value={data.explanation} onChange={e => setData('explanation', e.target.value)} rows={6} placeholder="Explain the lesson in simple, age-appropriate language…" error={errors.explanation} />
                            </FormGroup>
                        </SectionCard>

                        <SectionCard title="Reflection Questions">
                            <p className="text-[12px] leading-relaxed mb-3.5 text-stone-400">
                                Add discussion questions for families to explore together after the lesson.
                            </p>
                            {(data.reflection_questions || ['']).map((q, i) => (
                                <div key={i} className="flex items-start gap-2 mb-2.5">
                                    <span
                                        className="text-[10px] font-bold pt-3 min-w-[18px] flex-shrink-0 text-amber-500"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        {i + 1}.
                                    </span>
                                    <FieldInput value={q} onChange={e => updateReflection(i, e.target.value)} placeholder={`Question ${i + 1}…`} />
                                    {(data.reflection_questions || []).length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeReflection(i)}
                                            className="flex-shrink-0 p-1.5 mt-1 rounded-lg border-none cursor-pointer transition-colors hover:bg-rose-50 text-rose-500"
                                            style={{ background: 'none' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addReflection}
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] border-dashed border-2 border-stone-200 text-stone-400 transition-colors hover:border-amber-500 hover:text-amber-500"
                                style={{ background: 'none', fontFamily: "'Outfit', sans-serif" }}
                            >
                                <Plus size={13} />
                                Add Question
                            </button>
                        </SectionCard>

                        <SectionCard title="Closing Prayer">
                            <FormGroup label="Prayer Text" error={errors.prayer}>
                                <FieldTextarea value={data.prayer} onChange={e => setData('prayer', e.target.value)} rows={3} placeholder="Dear Lord, thank you for…" error={errors.prayer} />
                            </FormGroup>
                        </SectionCard>
                    </div>

                    {/* ── Right: publish sidebar ───────────────────── */}
                    <div className="lg:sticky lg:top-[80px] flex flex-col gap-4">
                        <SectionCard title="Publish Settings">
                            <ToggleField
                                label="Publish this lesson"
                                helper="Families can only see published lessons."
                                checked={data.is_published}
                                onChange={val => setData('is_published', val)}
                            />
                            <div className="flex flex-col gap-2.5 mt-5">
                                <SubmitButton processing={processing}>
                                    {data.is_published ? 'Publish Lesson' : 'Save as Draft'}
                                </SubmitButton>
                                <Link
                                    href="/admin/lessons"
                                    className="block text-center py-2.5 rounded-lg text-[13px] no-underline border border-stone-200 bg-amber-50 text-stone-400 transition-colors hover:bg-stone-50"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    Cancel
                                </Link>
                            </div>
                        </SectionCard>

                        {/* Tips card */}
                        <div className="rounded-[14px] border border-stone-100 bg-stone-50 p-4">
                            <div
                                className="text-[9px] tracking-[0.18em] uppercase mb-2 text-amber-500"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                Tips
                            </div>
                            <ul className="text-[11px] leading-relaxed space-y-1 m-0 pl-0 list-none text-stone-400">
                                <li>• Drafts are not visible to parents.</li>
                                <li>• Reflection questions help family discussion.</li>
                                <li>• Add activities after saving the lesson.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

/* ── Local sub-components ─────────────────────────────────────────────── */

function SectionCard({ title, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 text-[12px] font-bold tracking-[0.02em] text-stone-900">
                {title}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function ToggleField({ label, helper, checked, onChange }) {
    return (
        <label className="flex items-start gap-3 cursor-pointer">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`flex-shrink-0 mt-0.5 border-none bg-transparent cursor-pointer p-0 transition-colors ${checked ? 'text-emerald-600' : 'text-stone-200'}`}
            >
                {checked
                    ? <ToggleRight size={32} strokeWidth={1.5} />
                    : <ToggleLeft  size={32} strokeWidth={1.5} />
                }
            </button>
            <div>
                <div className="text-[13px] font-medium text-stone-900">{label}</div>
                {helper && <div className="text-[11px] mt-0.5 text-stone-400">{helper}</div>}
            </div>
        </label>
    );
}