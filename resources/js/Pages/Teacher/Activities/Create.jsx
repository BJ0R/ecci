// resources/js/Pages/Teacher/Activities/Create.jsx
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, X, BrainCircuit, PenLine, Trash2 } from 'lucide-react';
import TeacherLayout from '@/Components/Layout/TeacherLayout';
import {
    FlashMessage, FormGroup,
    FieldInput, FieldTextarea, FieldSelect, SubmitButton,
} from '@/Pages/Admin/Dashboard';

const BLANK_QUESTION = () => ({
    question_text:  '',
    choices:        ['', '', '', ''],
    correct_answer: '',
    points:         1,
});

export default function ActivitiesCreate({ lessons = [] }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        lesson_id:    '',
        title:        '',
        type:         'quiz',
        instructions: '',
        max_score:    10,
        questions:    [BLANK_QUESTION()],
    });

    /* ── Question helpers ────────────────────────────── */
    function addQuestion() {
        setData('questions', [...data.questions, BLANK_QUESTION()]);
    }
    function removeQuestion(i) {
        setData('questions', data.questions.filter((_, idx) => idx !== i));
    }
    function updateQuestion(i, field, val) {
        const qs = [...data.questions];
        qs[i] = { ...qs[i], [field]: val };
        setData('questions', qs);
    }
    function updateChoice(qi, ci, val) {
        const qs = [...data.questions];
        const choices = [...qs[qi].choices];
        choices[ci] = val;
        qs[qi] = { ...qs[qi], choices };
        setData('questions', qs);
    }

    function submit(e) {
        e.preventDefault();
        post('/teacher/activities');
    }

    const lessonOptions = lessons.map(l => ({
        value: String(l.id),
        label: `Wk ${l.week_number} — ${l.title}${l.is_published ? '' : ' (draft)'}`,
    }));

    return (
        <TeacherLayout title="New Activity">
            <Head title="Create Activity — ECCII Teacher" />
            <FlashMessage flash={flash} />

            <nav className="flex items-center gap-2 text-[12px] mb-6 text-stone-400">
                <Link href="/teacher/activities" className="inline-flex items-center gap-1 no-underline hover:opacity-70 text-stone-400">
                    <ArrowLeft size={13} />
                    All Activities
                </Link>
                <span className="text-stone-200">/</span>
                <span className="font-semibold text-stone-900">New Activity</span>
            </nav>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                    {/* ── Left ── */}
                    <div className="flex flex-col gap-5">

                        {/* Basic info */}
                        <Card title="Activity Info">
                            <FormGroup label="Title *" error={errors.title}>
                                <FieldInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. David and Goliath Quiz" error={errors.title} />
                            </FormGroup>

                            <FormGroup label="Type *" error={errors.type}>
                                <div className="flex gap-3">
                                    {[
                                        { value: 'quiz', label: 'Quiz',              icon: BrainCircuit, desc: 'Multiple choice with auto-scoring'  },
                                        { value: 'fill', label: 'Fill in the Blank', icon: PenLine,      desc: 'Text answer, reviewed by parent'      },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setData('type', opt.value)}
                                            className={`flex-1 flex flex-col items-start gap-1.5 p-3.5 rounded-[10px] border-2 cursor-pointer text-left transition-all ${
                                                data.type === opt.value
                                                    ? 'border-amber-500 bg-amber-50'
                                                    : 'border-stone-200 bg-white hover:border-stone-300'
                                            }`}
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <opt.icon size={16} className={data.type === opt.value ? 'text-amber-500' : 'text-stone-400'} />
                                            <div className={`text-[12px] font-semibold ${data.type === opt.value ? 'text-stone-900' : 'text-stone-500'}`}>
                                                {opt.label}
                                            </div>
                                            <div className="text-[10px] text-stone-400 leading-snug">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </FormGroup>

                            <FormGroup label="Linked Lesson" error={errors.lesson_id} helper="Optional — leave blank for standalone activities.">
                                <FieldSelect
                                    value={data.lesson_id}
                                    onChange={e => setData('lesson_id', e.target.value)}
                                    options={lessonOptions}
                                    placeholder="— Standalone (no lesson) —"
                                    error={errors.lesson_id}
                                />
                            </FormGroup>

                            <FormGroup label="Instructions" error={errors.instructions} helper="Displayed to the parent before they start.">
                                <FieldTextarea value={data.instructions} onChange={e => setData('instructions', e.target.value)} rows={3} placeholder="Answer the questions based on today's lesson…" error={errors.instructions} />
                            </FormGroup>

                            {/* Fill type max score */}
                            {data.type === 'fill' && (
                                <FormGroup label="Max Score" error={errors.max_score} helper="Points available for this fill-in activity.">
                                    <FieldInput value={data.max_score} onChange={e => setData('max_score', e.target.value)} type="number" error={errors.max_score} />
                                </FormGroup>
                            )}
                        </Card>

                        {/* Quiz questions */}
                        {data.type === 'quiz' && (
                            <Card title={`Questions (${data.questions.length})`}>
                                <p className="text-[12px] text-stone-400 mb-4 leading-relaxed">
                                    Max score is auto-computed from the sum of all question points.
                                </p>

                                {data.questions.map((q, qi) => (
                                    <div key={qi} className="border border-stone-200 rounded-[10px] p-4 mb-3 relative">
                                        {/* Question header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[11px] font-bold text-amber-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                Question {qi + 1}
                                            </span>
                                            {data.questions.length > 1 && (
                                                <button type="button" onClick={() => removeQuestion(qi)} className="p-1 rounded-lg border-none cursor-pointer hover:bg-rose-50 text-rose-400" style={{ background: 'none' }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>

                                        <FormGroup label="Question *" error={errors[`questions.${qi}.question_text`]}>
                                            <FieldInput value={q.question_text} onChange={e => updateQuestion(qi, 'question_text', e.target.value)} placeholder={`Question ${qi + 1}…`} />
                                        </FormGroup>

                                        <div className="mb-3">
                                            <label className="block text-[11px] font-semibold mb-2 tracking-[0.04em] text-stone-400">
                                                Answer Choices (select the correct one)
                                            </label>
                                            {q.choices.map((choice, ci) => (
                                                <div key={ci} className="flex items-center gap-2 mb-1.5">
                                                    <input
                                                        type="radio"
                                                        name={`correct_${qi}`}
                                                        value={choice}
                                                        checked={q.correct_answer === choice && choice !== ''}
                                                        onChange={() => choice && updateQuestion(qi, 'correct_answer', choice)}
                                                        className="flex-shrink-0 accent-amber-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={choice}
                                                        onChange={e => {
                                                            updateChoice(qi, ci, e.target.value);
                                                            // keep correct_answer in sync if it was this choice
                                                            if (q.correct_answer === choice) {
                                                                updateQuestion(qi, 'correct_answer', e.target.value);
                                                            }
                                                        }}
                                                        placeholder={`Choice ${ci + 1}…`}
                                                        className="flex-1 px-3 py-2 rounded-lg text-[12px] border border-stone-200 outline-none focus:border-amber-500 text-stone-900"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    />
                                                </div>
                                            ))}
                                            {errors[`questions.${qi}.correct_answer`] && (
                                                <p className="text-[11px] text-rose-500 mt-1">{errors[`questions.${qi}.correct_answer`]}</p>
                                            )}
                                            <p className="text-[10px] text-stone-400 mt-1.5">Click the radio button next to the correct answer.</p>
                                        </div>

                                        <FormGroup label="Points" error={errors[`questions.${qi}.points`]}>
                                            <FieldInput value={q.points} onChange={e => updateQuestion(qi, 'points', e.target.value)} type="number" />
                                        </FormGroup>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] border-dashed border-2 border-stone-200 text-stone-400 hover:border-amber-500 hover:text-amber-500"
                                    style={{ background: 'none', fontFamily: "'Outfit', sans-serif" }}
                                >
                                    <Plus size={13} />
                                    Add Question
                                </button>

                                {/* Live max score preview */}
                                <div className="mt-3 flex items-center gap-2 text-[12px] text-stone-400">
                                    <span>Total points:</span>
                                    <span className="font-bold text-amber-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {data.questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0)}
                                    </span>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* ── Right: sidebar ── */}
                    <div className="lg:sticky lg:top-[60px] flex flex-col gap-4">
                        <Card title="Publish">
                            <div className="flex flex-col gap-2.5">
                                <SubmitButton processing={processing}>Create Activity</SubmitButton>
                                <Link href="/teacher/activities" className="block text-center py-2.5 rounded-lg text-[13px] no-underline border border-stone-200 bg-amber-50 text-stone-400 hover:bg-stone-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Cancel
                                </Link>
                            </div>
                        </Card>

                        <div className="rounded-[14px] border border-stone-100 bg-stone-50 p-4">
                            <div className="text-[9px] tracking-[0.18em] uppercase mb-2 text-amber-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tips</div>
                            <ul className="text-[11px] leading-relaxed space-y-1 m-0 pl-0 list-none text-stone-400">
                                <li>• Quiz scores are calculated automatically.</li>
                                <li>• Fill activities require parent review.</li>
                                <li>• Link to a lesson so parents find it easily.</li>
                                <li>• Leave choices blank to remove them.</li>
                            </ul>
                        </div>
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