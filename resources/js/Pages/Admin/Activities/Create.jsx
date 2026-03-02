import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, X, BrainCircuit, PenLine, Check, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';

const EMPTY_QUESTION = { question_text: '', choices: ['', '', '', ''], correct_answer: '', points: 1 };

export default function ActivitiesCreate({ lessons = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        lesson_id:    '',
        title:        '',
        type:         'quiz',
        instructions: '',
        max_score:    10,
        questions:    [{ ...EMPTY_QUESTION, choices: ['', '', '', ''] }],
    });

    const quizMaxScore = data.type === 'quiz'
        ? data.questions.reduce((sum, q) => sum + (parseInt(q.points) || 1), 0)
        : null;

    const blankCount = (data.instructions.match(/___/g) || []).length;

    function submit(e) { e.preventDefault(); post('/admin/activities'); }

    function addQuestion() { setData('questions', [...data.questions, { ...EMPTY_QUESTION, choices: ['', '', '', ''] }]); }
    function removeQuestion(i) { if (data.questions.length > 1) setData('questions', data.questions.filter((_, idx) => idx !== i)); }
    function updateQuestion(i, field, value) { setData('questions', data.questions.map((q, idx) => idx === i ? { ...q, [field]: value } : q)); }
    function updateChoice(qi, ci, value) {
        setData('questions', data.questions.map((q, idx) => {
            if (idx !== qi) return q;
            const choices = [...q.choices];
            const wasCorrect = q.correct_answer === q.choices[ci];
            choices[ci] = value;
            return { ...q, choices, correct_answer: wasCorrect ? value : q.correct_answer };
        }));
    }
    function addChoice(qi) {
        if (data.questions[qi].choices.length >= 6) return;
        setData('questions', data.questions.map((q, idx) => idx === qi ? { ...q, choices: [...q.choices, ''] } : q));
    }
    function removeChoice(qi, ci) {
        if (data.questions[qi].choices.length <= 2) return;
        setData('questions', data.questions.map((q, idx) => {
            if (idx !== qi) return q;
            const removed = q.choices[ci];
            const choices = q.choices.filter((_, cidx) => cidx !== ci);
            return { ...q, choices, correct_answer: q.correct_answer === removed ? '' : q.correct_answer };
        }));
    }

    const types = [
        { key: 'quiz', label: 'Multiple Choice', sub: 'Auto-scored',  Icon: BrainCircuit,
          activeClass: 'border-amber-500 bg-amber-100', iconActive: 'text-amber-500', labelActive: 'text-amber-500' },
        { key: 'fill', label: 'Fill in the Blank', sub: 'Manual review', Icon: PenLine,
          activeClass: 'border-violet-500 bg-violet-50', iconActive: 'text-violet-600', labelActive: 'text-violet-600' },
    ];

    return (
        <AdminLayout title="New Activity">
            <Head title="Create Activity — ECCII Admin" />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] mb-6 text-stone-400">
                <Link href="/admin/activities" className="inline-flex items-center gap-1 no-underline hover:opacity-70 text-stone-400">
                    <ArrowLeft size={13} /> Activities
                </Link>
                <span className="text-stone-200">/</span>
                <span className="font-semibold text-stone-900">New Activity</span>
            </nav>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                    {/* ── Left ─────────────────────────────────────── */}
                    <div className="flex flex-col gap-5">
                        <FormCard title="Activity Info">
                            <FGroup label="Title *" error={errors.title}>
                                <FInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. David and Goliath Quiz" hasError={!!errors.title} />
                            </FGroup>
                            <FGroup label="Link to Lesson" helper="Leave blank for a standalone activity." error={errors.lesson_id}>
                                <FSelect value={data.lesson_id} onChange={e => setData('lesson_id', e.target.value)}>
                                    <option value="">— Standalone (not linked) —</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.is_published ? '' : '[Draft] '}Wk {l.week_number} · {l.title}
                                        </option>
                                    ))}
                                </FSelect>
                            </FGroup>
                            <FGroup
                                label={data.type === 'fill' ? 'Fill-in-the-Blank Text *' : 'Instructions *'}
                                helper={data.type === 'fill' ? 'Use ___ (three underscores) for blanks.' : 'Shown before starting.'}
                                error={errors.instructions}
                            >
                                <textarea
                                    value={data.instructions}
                                    onChange={e => setData('instructions', e.target.value)}
                                    rows={data.type === 'fill' ? 5 : 3}
                                    placeholder={data.type === 'fill' ? "David took ___ smooth stones…" : "Read the lesson then answer below."}
                                    className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] border outline-none resize-y leading-relaxed text-stone-900 bg-white focus:border-amber-500 ${errors.instructions ? 'border-rose-500' : 'border-stone-200'}`}
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                />
                                {data.type === 'fill' && data.instructions && (
                                    <div className={`mt-2 px-3 py-2 rounded-lg text-[11px] border flex items-center gap-1.5 ${blankCount > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-500'}`}>
                                        {blankCount > 0
                                            ? <><Check size={11} /> {blankCount} blank{blankCount !== 1 ? 's' : ''} detected</>
                                            : <><AlertTriangle size={11} /> No blanks found — add ___ to mark them</>
                                        }
                                    </div>
                                )}
                            </FGroup>
                        </FormCard>

                        {/* Quiz questions */}
                        {data.type === 'quiz' && (
                            <FormCard title={`Quiz Questions (${data.questions.length}) · ${quizMaxScore} pts total`}>
                                {errors.questions && (
                                    <div className="px-3 py-2 rounded-lg text-[12px] border mb-4 bg-rose-50 border-rose-200 text-rose-500">
                                        {errors.questions}
                                    </div>
                                )}
                                {data.questions.map((q, qi) => (
                                    <QBlock key={qi} q={q} qi={qi}
                                        canRemove={data.questions.length > 1}
                                        onUpdate={(f, v) => updateQuestion(qi, f, v)}
                                        onUpdateChoice={(ci, v) => updateChoice(qi, ci, v)}
                                        onAddChoice={() => addChoice(qi)}
                                        onRemoveChoice={ci => removeChoice(qi, ci)}
                                        onRemove={() => removeQuestion(qi)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-[10px] text-[12px] border-dashed border-2 border-stone-200 text-stone-400 transition-colors hover:border-amber-500 hover:text-amber-500"
                                    style={{ background: 'none', fontFamily: "'Outfit', sans-serif" }}
                                >
                                    <Plus size={13} />
                                    Add Question
                                </button>
                            </FormCard>
                        )}

                        {data.type === 'fill' && (
                            <FormCard title="How Fill in the Blank Works">
                                <p className="text-[13px] leading-relaxed m-0 text-stone-400">
                                    The parent reads the sentence(s) with the child. The child types answers for each blank.
                                    Answers are saved and reviewed by the pastor. There is no automatic scoring for fill activities.
                                </p>
                            </FormCard>
                        )}
                    </div>

                    {/* ── Right sidebar ─────────────────────────────── */}
                    <div className="lg:sticky lg:top-[80px] flex flex-col gap-4">
                        <FormCard title="Activity Type">
                            {types.map(t => {
                                const isActive = data.type === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setData('type', t.key)}
                                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left mb-2 last:mb-0 border transition-all ${isActive ? t.activeClass : 'border-stone-200 bg-transparent'}`}
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        <t.Icon size={16} className={`flex-shrink-0 ${isActive ? t.iconActive : 'text-stone-400'}`} />
                                        <div className="flex-1">
                                            <div className={`text-[12px] font-semibold ${isActive ? t.labelActive : 'text-stone-900'}`}>{t.label}</div>
                                            <div className="text-[10px] text-stone-400">{t.sub}</div>
                                        </div>
                                        {isActive && <Check size={14} className={`flex-shrink-0 ${t.iconActive}`} />}
                                    </button>
                                );
                            })}
                        </FormCard>

                        <FormCard title="Max Score">
                            {data.type === 'quiz' ? (
                                <div className="text-center py-2">
                                    <div
                                        className="text-[34px] font-bold leading-none text-amber-500"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        {quizMaxScore}
                                    </div>
                                    <div className="text-[10px] mt-1 text-stone-400">auto-calculated</div>
                                </div>
                            ) : (
                                <FGroup label="Score (for display)" helper="Used for badge tracking.">
                                    <FInput type="number" value={data.max_score} onChange={e => setData('max_score', parseInt(e.target.value) || 10)} />
                                </FGroup>
                            )}
                        </FormCard>

                        <FormCard title="Save">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-stone-900 text-amber-50"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {processing ? 'Creating…' : 'Create Activity'}
                            </button>
                            <Link
                                href="/admin/activities"
                                className="block text-center mt-2 py-2.5 rounded-lg text-[13px] no-underline border border-stone-200 bg-amber-50 text-stone-400 transition-colors hover:bg-stone-50"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                Cancel
                            </Link>
                        </FormCard>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

/* ── Question block ──────────────────────────────────────────────────── */
function QBlock({ q, qi, canRemove, onUpdate, onUpdateChoice, onAddChoice, onRemoveChoice, onRemove }) {
    return (
        <div className="rounded-xl border border-stone-200 overflow-hidden mb-4">
            {/* Q header */}
            <div className="px-3.5 py-2.5 flex items-center gap-2 border-b border-stone-100 bg-stone-50">
                <span
                    className="text-[10px] font-bold text-amber-500"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    Q{qi + 1}
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">pts</span>
                    <input
                        type="number"
                        value={q.points}
                        min="1" max="20"
                        onChange={e => onUpdate('points', parseInt(e.target.value) || 1)}
                        className="w-11 px-1.5 py-1 rounded-lg text-[12px] text-center border border-stone-200 outline-none text-stone-900 bg-white"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    />
                    {canRemove && (
                        <button type="button" onClick={onRemove} className="border-none bg-transparent cursor-pointer p-0 leading-none text-rose-500">
                            <X size={15} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4">
                {/* Question text */}
                <FGroup label="Question *">
                    <FInput
                        value={q.question_text}
                        onChange={e => onUpdate('question_text', e.target.value)}
                        placeholder="e.g. How many stones did David pick up?"
                    />
                </FGroup>

                {/* Choices */}
                <div className="mb-2">
                    <div className="text-[11px] font-semibold mb-2 text-stone-900">
                        Choices —{' '}
                        <span className="font-normal text-emerald-600">click circle to mark correct</span>
                    </div>
                    {q.choices.map((choice, ci) => {
                        const isCorrect = q.correct_answer && q.correct_answer === choice;
                        return (
                            <div key={ci} className="flex items-center gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => onUpdate('correct_answer', choice || '')}
                                    className={`w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all cursor-pointer ${isCorrect && choice ? 'border-emerald-600 bg-emerald-600' : 'border-stone-200 bg-transparent'}`}
                                >
                                    {isCorrect && choice && <Check size={9} color="white" strokeWidth={3} />}
                                </button>
                                <input
                                    type="text"
                                    value={choice}
                                    onChange={e => onUpdateChoice(ci, e.target.value)}
                                    placeholder={`Choice ${ci + 1}`}
                                    className={`flex-1 px-2.5 py-1.5 rounded-lg text-[12px] border outline-none transition-colors text-stone-900 ${isCorrect && choice ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-white'}`}
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                />
                                {q.choices.length > 2 && (
                                    <button type="button" onClick={() => onRemoveChoice(ci)} className="border-none bg-transparent cursor-pointer p-0 leading-none text-stone-400">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {q.choices.length < 6 && (
                        <button type="button" onClick={onAddChoice} className="text-[11px] border-none bg-transparent cursor-pointer px-0 py-1 text-stone-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            + Add choice
                        </button>
                    )}
                </div>

                {q.correct_answer
                    ? <div className="flex items-center gap-1 text-[11px] text-emerald-600"><Check size={11} /> Correct: <strong>"{q.correct_answer}"</strong></div>
                    : <div className="flex items-center gap-1 text-[11px] text-rose-500"><AlertTriangle size={11} /> No correct answer selected yet</div>
                }
            </div>
        </div>
    );
}

/* ── Form primitives ─────────────────────────────────────────────────── */
function FormCard({ title, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 text-[12px] font-bold text-stone-900">{title}</div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function FGroup({ label, children, helper, error }) {
    return (
        <div className="mb-3.5">
            {label && <label className="block text-[12px] font-semibold mb-1 text-stone-900">{label}</label>}
            {helper && <p className="text-[11px] mb-1.5 leading-snug text-stone-400">{helper}</p>}
            {children}
            {error && <p className="text-[11px] mt-1 text-rose-500">{error}</p>}
        </div>
    );
}

function FInput({ value, onChange, placeholder, type = 'text', hasError, ...rest }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] border outline-none transition-colors text-stone-900 bg-white focus:border-amber-500 ${hasError ? 'border-rose-500' : 'border-stone-200'}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
            {...rest}
        />
    );
}

function FSelect({ value, onChange, children }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3.5 py-2.5 rounded-lg text-[13px] border border-stone-200 outline-none appearance-none cursor-pointer text-stone-900 bg-white focus:border-amber-500"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {children}
        </select>
    );
}