// resources/js/Pages/Teacher/Lessons/Edit.jsx
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import TeacherLayout from '@/Components/Layout/TeacherLayout';
import {
    FlashMessage, FormGroup,
    FieldInput, FieldTextarea, FieldSelect, SubmitButton,
} from '@/Pages/Admin/Dashboard';

export default function LessonsEdit({ lesson }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        title:                lesson.title        ?? '',
        series:               lesson.series       ?? '',
        week_number:          lesson.week_number  ?? '',
        age_group:            lesson.age_group    ?? '',
        is_published:         lesson.is_published ?? false,
        bible_reference:      lesson.content?.bible_reference      ?? '',
        bible_text:           lesson.content?.bible_text           ?? '',
        explanation:          lesson.content?.explanation          ?? '',
        reflection_questions: lesson.content?.reflection_questions ?? [''],
        prayer:               lesson.content?.prayer               ?? '',
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
        put(`/teacher/lessons/${lesson.id}`);
    }

    const ageGroups = [
        { value: 'nursery', label: 'Nursery (Ages 3–5)' },
        { value: 'kids',    label: 'Kids (Ages 6–10)'   },
        { value: 'youth',   label: 'Youth (Ages 11–15)' },
    ];

    return (
        <TeacherLayout title={`Edit: ${lesson.title}`}>
            <Head title={`Edit ${lesson.title} — ECCII Teacher`} />
            <FlashMessage flash={flash} />

            <nav className="flex items-center gap-2 text-[12px] mb-6 text-stone-400">
                <Link href="/teacher/lessons" className="inline-flex items-center gap-1 no-underline transition-opacity hover:opacity-70 text-stone-400">
                    <ArrowLeft size={13} />
                    Lessons
                </Link>
                <span className="text-stone-200">/</span>
                <span className="truncate max-w-[180px] text-stone-900 font-semibold">{lesson.title}</span>
                <span className="text-stone-200">/</span>
                <span>Edit</span>
            </nav>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                    <div className="flex flex-col gap-5">
                        <Card title="Lesson Info">
                            <FormGroup label="Title *" error={errors.title}>
                                <FieldInput value={data.title} onChange={e => setData('title', e.target.value)} error={errors.title} />
                            </FormGroup>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <FormGroup label="Series" error={errors.series}>
                                    <FieldInput value={data.series} onChange={e => setData('series', e.target.value)} error={errors.series} />
                                </FormGroup>
                                <FormGroup label="Week Number *" error={errors.week_number}>
                                    <FieldInput value={data.week_number} onChange={e => setData('week_number', e.target.value)} type="number" error={errors.week_number} />
                                </FormGroup>
                            </div>
                            <FormGroup label="Age Group *" error={errors.age_group}>
                                <FieldSelect value={data.age_group} onChange={e => setData('age_group', e.target.value)} options={ageGroups} error={errors.age_group} />
                            </FormGroup>
                        </Card>

                        <Card title="Bible Content">
                            <FormGroup label="Bible Reference" error={errors.bible_reference}>
                                <FieldInput value={data.bible_reference} onChange={e => setData('bible_reference', e.target.value)} placeholder="John 3:16" error={errors.bible_reference} />
                            </FormGroup>
                            <FormGroup label="Bible Text" error={errors.bible_text}>
                                <FieldTextarea value={data.bible_text} onChange={e => setData('bible_text', e.target.value)} rows={5} error={errors.bible_text} />
                            </FormGroup>
                            <FormGroup label="Explanation" error={errors.explanation}>
                                <FieldTextarea value={data.explanation} onChange={e => setData('explanation', e.target.value)} rows={6} error={errors.explanation} />
                            </FormGroup>
                        </Card>

                        <Card title="Reflection Questions">
                            {(data.reflection_questions || ['']).map((q, i) => (
                                <div key={i} className="flex items-start gap-2 mb-2.5">
                                    <span className="text-[10px] font-bold pt-3 min-w-[18px] flex-shrink-0 text-amber-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {i + 1}.
                                    </span>
                                    <FieldInput value={q} onChange={e => updateReflection(i, e.target.value)} placeholder={`Question ${i + 1}…`} />
                                    {(data.reflection_questions || []).length > 1 && (
                                        <button type="button" onClick={() => removeReflection(i)} className="flex-shrink-0 p-1.5 mt-1 rounded-lg cursor-pointer hover:bg-rose-50 border-none text-rose-500" style={{ background: 'none' }}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addReflection} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] border-dashed border-2 border-stone-200 text-stone-400 hover:border-amber-500 hover:text-amber-500" style={{ background: 'none', fontFamily: "'Outfit', sans-serif" }}>
                                <Plus size={13} />
                                Add Question
                            </button>
                        </Card>

                        <Card title="Closing Prayer">
                            <FormGroup label="Prayer Text" error={errors.prayer}>
                                <FieldTextarea value={data.prayer} onChange={e => setData('prayer', e.target.value)} rows={3} error={errors.prayer} />
                            </FormGroup>
                        </Card>
                    </div>

                    <div className="lg:sticky lg:top-[60px] flex flex-col gap-4">
                        <Card title="Publish Settings">
                            <Toggle
                                label="Published"
                                helper="Families can only see published lessons."
                                checked={data.is_published}
                                onChange={val => setData('is_published', val)}
                            />
                            <div className="flex flex-col gap-2.5 mt-5">
                                <SubmitButton processing={processing}>
                                    {processing ? 'Saving…' : 'Update Lesson'}
                                </SubmitButton>
                                <Link href="/teacher/lessons" className="block text-center py-2.5 rounded-lg text-[13px] no-underline border border-stone-200 bg-amber-50 text-stone-400 hover:bg-stone-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Cancel
                                </Link>
                            </div>
                        </Card>

                        <Card title="Lesson Details">
                            <InfoRow label="ID">#{lesson.id}</InfoRow>
                            <InfoRow label="Created">
                                {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : '—'}
                            </InfoRow>
                            {lesson.published_at && (
                                <InfoRow label="Published">
                                    {new Date(lesson.published_at).toLocaleDateString()}
                                </InfoRow>
                            )}
                        </Card>
                    </div>
                </div>
            </form>
        </TeacherLayout>
    );
}

function Card({ title, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 text-[12px] font-bold text-stone-900">{title}</div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function Toggle({ label, helper, checked, onChange }) {
    return (
        <label className="flex items-start gap-3 cursor-pointer">
            <button type="button" onClick={() => onChange(!checked)} className={`flex-shrink-0 mt-0.5 border-none bg-transparent cursor-pointer p-0 transition-colors ${checked ? 'text-emerald-600' : 'text-stone-200'}`}>
                {checked ? <ToggleRight size={32} strokeWidth={1.5} /> : <ToggleLeft size={32} strokeWidth={1.5} />}
            </button>
            <div>
                <div className="text-[13px] font-medium text-stone-900">{label}</div>
                {helper && <div className="text-[11px] mt-0.5 text-stone-400">{helper}</div>}
            </div>
        </label>
    );
}

function InfoRow({ label, children }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 last:border-b-0">
            <span className="text-[11px] text-stone-400">{label}</span>
            <span className="text-[12px] text-stone-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{children}</span>
        </div>
    );
}