// resources/js/Pages/Parent/Activities/Show.jsx
// Rendered by: App\Http\Controllers\Parent\ActivityViewController@show
// Route:   GET  /activities/{activity}
// Submits: POST /activities/{activity}/submit

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Components/Layout/AppLayout';

/**
 * Props:
 *   activity — {
 *     id, title, type, instructions, max_score,
 *     lesson: { id, title } | null,
 *     questions: [{ id, question_text, choices: string[], correct_answer, points }]
 *   }
 *   children            — ChildProfile[] { id, name, avatar_color }
 *   existingSubmissions — { [child_profile_id]: { score, answers, submitted_at } }
 *
 * Multi-child flow:
 *  1. Page loads → active child defaults to first child without a submission.
 *  2. Parent can click any child tab to switch who is active.
 *  3. Active child answers the quiz / fills in the blank.
 *  4. "Submit" posts for that child → page reloads via Inertia → submission recorded.
 *  5. SubmittedBanner shows score + "Next child" buttons for remaining children.
 *  6. Parent clicks a pending child → fresh form, repeat.
 */
export default function ActivitiesShow({
    activity         = {},
    children: kids   = [],
    existingSubmissions = {},
}) {
    const { flash } = usePage().props;
    const questions = activity.questions ?? [];
    const isQuiz    = activity.type === 'quiz';
    const isFill    = activity.type === 'fill';

    // Default active child = first child without a submission
    const firstPending = kids.findIndex(c => !existingSubmissions[c.id]);
    const [activeIdx, setActiveIdx]       = useState(firstPending >= 0 ? firstPending : 0);
    const [processing, setProcessing]     = useState(false);
    const [formErrors, setFormErrors]     = useState({});

    // Per-child answer state stored locally so switching doesn't reset other children
    const [quizAnswers, setQuizAnswers]   = useState({});  // { [childId]: { [qId]: choice } }
    const [fillAnswers, setFillAnswers]   = useState({});  // { [childId]: string }

    const activeChild   = kids[activeIdx] ?? null;
    const childId       = activeChild?.id ?? null;
    const currentSub    = childId ? (existingSubmissions[childId] ?? null) : null;
    const myAnswers     = (childId && quizAnswers[childId]) || {};
    const myFillAnswer  = (childId && fillAnswers[childId]) || '';

    const answeredCount = isQuiz ? questions.filter(q => myAnswers[q.id]).length : 0;
    const allAnswered   = isQuiz
        ? answeredCount === questions.length
        : myFillAnswer.trim().length > 0;

    const pendingKids   = kids.filter(c => !existingSubmissions[c.id]);
    const allDone       = kids.length > 0 && pendingKids.length === 0;

    /* ── Answer helpers ── */
    function selectQuizAnswer(qId, choice) {
        setQuizAnswers(prev => ({
            ...prev,
            [childId]: { ...(prev[childId] ?? {}), [qId]: choice },
        }));
    }

    function updateFillAnswer(val) {
        setFillAnswers(prev => ({ ...prev, [childId]: val }));
    }

    /* ── Submit via router.post (direct, no useForm) ── */
    function handleSubmit(e) {
        e.preventDefault();
        if (!childId || !allAnswered || processing) return;

        setProcessing(true);
        setFormErrors({});

        const answers = isFill ? { fill: myFillAnswer } : myAnswers;

        router.post(`/activities/${activity.id}/submit`, {
            child_profile_id: childId,
            answers,
        }, {
            onError:   (errors) => { setFormErrors(errors); setProcessing(false); },
            onFinish:  () => setProcessing(false),
            // onSuccess: Inertia refreshes props automatically (existingSubmissions updated)
        });
    }

    const typeConfig = {
        quiz: { icon: '🧠', label: 'Multiple Choice Quiz', color: 'var(--gold)' },
        fill: { icon: '✏️', label: 'Fill in the Blank',     color: '#6B5EA8'     },
    };
    const tc = typeConfig[activity.type] ?? typeConfig.quiz;

    return (
        <AppLayout>
            <Head title={`${activity.title} — ECCII`} />

            {/* Flash */}
            {flash?.success && (
                <div style={{ background: '#EBF7EE', border: '1px solid #C2DEC8', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#3E6B52' }}>
                    🎉 {flash.success}
                </div>
            )}

            {/* Breadcrumb */}
            <nav style={{ fontSize: '12px', color: 'var(--ink-50)', marginBottom: '22px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/lessons" style={{ color: 'var(--ink-50)', textDecoration: 'none' }}>Lessons</Link>
                {activity.lesson && (
                    <>
                        <span>/</span>
                        <Link href={`/lessons/${activity.lesson.id}`} style={{ color: 'var(--ink-50)', textDecoration: 'none' }}>
                            {activity.lesson.title}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span style={{ color: 'var(--ink)' }}>{activity.title}</span>
            </nav>

            {/* Activity hero */}
            <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '24px 28px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                        padding: '3px 10px', borderRadius: '100px', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                        background: `${tc.color}28`, color: tc.color,
                    }}>
                        {tc.icon} {tc.label}
                    </span>
                    {activity.lesson && (
                        <span style={{ fontSize: '10px', color: 'rgba(250,247,242,0.4)' }}>· {activity.lesson.title}</span>
                    )}
                    <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--gold)' }}>
                        {activity.max_score} pts max
                    </span>
                </div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1.1, margin: '0 0 10px' }}>
                    {activity.title}
                </h1>
                {activity.instructions && (
                    <p style={{ fontSize: '13px', color: 'rgba(250,247,242,0.6)', lineHeight: 1.65, margin: 0 }}>
                        {activity.instructions}
                    </p>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════
                CHILD SELECTOR — always visible at the top
                Shows all children, highlights active one,
                shows ✓ + score on those already submitted.
            ══════════════════════════════════════════════════════ */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>

                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-lt)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-50)', marginBottom: '2px' }}>
                            Step 1
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                            Select which child is taking this activity
                        </div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-50)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {kids.filter(c => existingSubmissions[c.id]).length}/{kids.length} done
                    </div>
                </div>

                {kids.length === 0 ? (
                    <div style={{ padding: '28px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: 'var(--ink-50)', marginBottom: '14px' }}>No children added yet.</p>
                        <Link href="/children/create" style={{ padding: '8px 18px', background: 'var(--ink)', color: 'var(--cream)', borderRadius: '7px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                            + Add a Child
                        </Link>
                    </div>
                ) : (
                    <div style={{ padding: '16px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {kids.map((child, idx) => {
                            const sub      = existingSubmissions[child.id];
                            const isActive = idx === activeIdx;
                            const isDone   = !!sub;
                            const pct      = isDone && activity.max_score > 0
                                ? Math.round((sub.score / activity.max_score) * 100) : null;

                            return (
                                <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => setActiveIdx(idx)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '12px 16px', borderRadius: '12px', minWidth: '150px',
                                        border: `2px solid ${
                                            isActive ? 'var(--ink)'
                                            : isDone ? '#C2DEC8'
                                            : 'var(--border)'}`,
                                        background: isActive ? 'var(--ink)'
                                            : isDone ? '#EBF7EE'
                                            : 'var(--cream)',
                                        cursor: 'pointer', textAlign: 'left',
                                        fontFamily: "'Outfit', sans-serif",
                                        transition: 'all 0.18s',
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                                        background: child.avatar_color || 'var(--gold)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', fontWeight: 700,
                                        color: isActive ? '#fff' : 'var(--ink)',
                                    }}>
                                        {child.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? 'var(--cream)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {child.name}
                                        </div>
                                        <div style={{ fontSize: '10px', marginTop: '2px', color: isActive ? 'rgba(250,247,242,0.55)' : isDone ? '#3E6B52' : 'var(--ink-50)', fontWeight: isDone ? 600 : 400 }}>
                                            {isDone
                                                ? (isQuiz ? `✓ ${sub.score}/${activity.max_score} (${pct}%)` : '✓ Submitted')
                                                : isActive ? 'Taking now…' : 'Not started'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* All done banner */}
                {allDone && (
                    <div style={{ margin: '0 20px 16px', padding: '12px 16px', background: '#EBF7EE', border: '1px solid #C2DEC8', borderRadius: '10px', fontSize: '13px', color: '#3E6B52', fontWeight: 600 }}>
                        🎉 All {kids.length} {kids.length === 1 ? 'child has' : 'children have'} completed this activity!
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════
                MAIN CONTENT for the currently-active child
            ══════════════════════════════════════════════════════ */}
            {activeChild && (
                <>
                    {/* Already submitted — show score + next prompt */}
                    {currentSub && (
                        <SubmittedPanel
                            child={activeChild}
                            sub={currentSub}
                            activity={activity}
                            isQuiz={isQuiz}
                            questions={questions}
                            pendingKids={pendingKids}
                            allKids={kids}
                            onSelectChild={kid => setActiveIdx(kids.findIndex(c => c.id === kid.id))}
                        />
                    )}

                    {/* Not yet submitted — show the form */}
                    {!currentSub && (
                        <form onSubmit={handleSubmit}>
                            {/* Step 2 label */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-50)', marginBottom: '3px' }}>
                                    Step 2 — {activeChild.name}
                                </div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                                    {isQuiz
                                        ? `Answer all ${questions.length} question${questions.length !== 1 ? 's' : ''}`
                                        : 'Fill in the blanks'}
                                </div>
                            </div>

                            {/* ── QUIZ ── */}
                            {isQuiz && (
                                <>
                                    {/* Progress indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {questions.map((q, i) => (
                                                <div key={i} style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: myAnswers[q.id] ? '#3E6B52' : 'var(--border)',
                                                    transition: 'background 0.2s',
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '11px', color: 'var(--ink-50)' }}>
                                            {answeredCount} / {questions.length} answered
                                        </span>
                                    </div>

                                    {questions.map((q, qi) => (
                                        <QuestionCard
                                            key={q.id}
                                            q={q}
                                            qi={qi}
                                            selected={myAnswers[q.id]}
                                            onSelect={choice => selectQuizAnswer(q.id, choice)}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ── FILL IN THE BLANK ── */}
                            {isFill && (
                                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-lt)', fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                                        ✏️ Fill in the blanks
                                    </div>
                                    <div style={{ padding: '18px' }}>
                                        {/* Sentence with blanks visualised */}
                                        <div style={{ padding: '14px 16px', background: 'var(--cream)', borderRadius: '10px', border: '1px solid var(--border-lt)', marginBottom: '16px', fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontStyle: 'italic', lineHeight: 1.8, color: 'var(--ink)' }}>
                                            {(activity.instructions || '').split('___').map((part, i, arr) => (
                                                <span key={i}>
                                                    {part}
                                                    {i < arr.length - 1 && (
                                                        <span style={{ display: 'inline-block', minWidth: '60px', borderBottom: '2px solid var(--gold)', margin: '0 4px', verticalAlign: 'bottom', textAlign: 'center', fontSize: '13px', color: 'var(--ink-50)' }}>___</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                                            {activeChild.name}'s Answer
                                        </label>
                                        <textarea
                                            value={myFillAnswer}
                                            onChange={e => updateFillAnswer(e.target.value)}
                                            rows={3}
                                            placeholder="Type the missing words here…"
                                            style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', resize: 'vertical', fontFamily: "'Outfit', sans-serif", color: 'var(--ink)', background: 'var(--cream)', lineHeight: 1.6 }}
                                        />
                                        <p style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '6px', lineHeight: 1.5 }}>
                                            The pastor will review this response manually.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div style={{ background: 'var(--white)', border: `1px solid ${allAnswered ? 'var(--border)' : 'var(--border)'}`, borderRadius: '12px', padding: '18px' }}>
                                {formErrors.child_profile_id && (
                                    <p style={{ fontSize: '12px', color: '#E05050', marginBottom: '10px' }}>{formErrors.child_profile_id}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!allAnswered || processing}
                                    style={{
                                        width: '100%', padding: '13px', border: 'none', borderRadius: '8px',
                                        fontSize: '14px', fontWeight: 700, fontFamily: "'Outfit', sans-serif",
                                        background: allAnswered && !processing ? '#3E6B52' : 'rgba(62,107,82,0.3)',
                                        color: 'var(--white)',
                                        cursor: allAnswered && !processing ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {processing
                                        ? 'Submitting…'
                                        : isQuiz
                                            ? `✓ Submit ${activeChild.name}'s Answers`
                                            : `✓ Submit ${activeChild.name}'s Response`}
                                </button>

                                <p style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '8px', textAlign: 'center', lineHeight: 1.4 }}>
                                    {!allAnswered
                                        ? isQuiz
                                            ? `Answer ${questions.length - answeredCount} more question${questions.length - answeredCount !== 1 ? 's' : ''} to continue`
                                            : 'Write a response above to continue'
                                        : `Submitting for ${activeChild.name} — this cannot be undone.`}
                                </p>
                            </div>
                        </form>
                    )}
                </>
            )}
        </AppLayout>
    );
}

/* ── Submitted panel: score + answer review + "next child" buttons ───────── */
function SubmittedPanel({ child, sub, activity, isQuiz, questions, pendingKids, allKids, onSelectChild }) {
    const score    = sub?.score ?? 0;
    const maxScore = activity.max_score ?? 0;
    const pct      = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const praise   = pct === 100 ? '🌟 Perfect score!' : pct >= 80 ? '🎉 Great job!' : pct >= 60 ? '👍 Good effort!' : '✓ Submitted!';

    return (
        <div>
            {/* Score banner */}
            <div style={{ background: 'var(--white)', border: '2px solid #C2DEC8', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ padding: '20px 22px', background: '#EBF7EE', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: child.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                        {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#3E6B52', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '3px' }}>{praise}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                            {child.name}
                        </div>
                        {isQuiz ? (
                            <div style={{ fontSize: '18px', fontWeight: 700, color: pct >= 80 ? '#3E6B52' : pct >= 60 ? '#D4A853' : 'var(--ink-50)', marginTop: '4px' }}>
                                {score} / {maxScore} pts <span style={{ fontSize: '13px', fontWeight: 400 }}>({pct}%)</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: '13px', color: '#3E6B52', marginTop: '4px' }}>Response saved — pastor will review.</div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#3E6B52' }}>
                            {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : 'Just now'}
                        </div>
                    </div>
                </div>

                {/* Next child CTA */}
                {pendingKids.length > 0 && (
                    <div style={{ padding: '14px 22px', borderTop: '1px solid #C2DEC8' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                            {pendingKids.length === 1
                                ? `${pendingKids[0].name} still needs to take this activity:`
                                : `${pendingKids.length} children still need to take this:`}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {pendingKids.map(kid => (
                                <button key={kid.id} type="button" onClick={() => onSelectChild(kid)} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '9px 16px', borderRadius: '8px',
                                    border: '1.5px solid var(--ink)', background: 'var(--ink)',
                                    color: 'var(--cream)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                    fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                                }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: kid.avatar_color || 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
                                        {kid.name.charAt(0).toUpperCase()}
                                    </div>
                                    Take for {kid.name} →
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Answer review for quiz */}
            {isQuiz && questions.length > 0 && (
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                        Review — {child.name}'s Answers
                    </div>
                    {questions.map((q, qi) => {
                        const given   = sub.answers?.[q.id];
                        const isRight = given === q.correct_answer;
                        return (
                            <div key={q.id} style={{ background: 'var(--white)', border: `1px solid ${isRight ? '#C2DEC8' : '#FECACA'}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>{qi + 1}.</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '13px', color: 'var(--ink)', margin: '0 0 8px', fontWeight: 500 }}>{q.question_text}</p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', background: isRight ? '#EBF7EE' : '#FEF2F2', color: isRight ? '#3E6B52' : '#E05050', border: `1px solid ${isRight ? '#C2DEC8' : '#FECACA'}`, fontWeight: 500 }}>
                                                {isRight ? '✓' : '✗'} {given || '—'}
                                            </span>
                                            {!isRight && (
                                                <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', background: '#EBF7EE', color: '#3E6B52', border: '1px solid #C2DEC8', fontWeight: 500 }}>
                                                    ✓ {q.correct_answer}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Single question card ────────────────────────────────────────────────── */
function QuestionCard({ q, qi, selected, onSelect }) {
    return (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border-lt)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1, flexShrink: 0 }}>
                    {qi + 1}.
                </span>
                <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 500, flex: 1 }}>
                    {q.question_text}
                </p>
                <span style={{ fontSize: '10px', color: 'var(--ink-50)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {q.points} pt{q.points !== 1 ? 's' : ''}
                </span>
            </div>
            <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(q.choices ?? []).map((choice, ci) => {
                    const isSelected = selected === choice;
                    return (
                        <button key={ci} type="button" onClick={() => onSelect(choice)} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '11px 16px', borderRadius: '10px',
                            border: `2px solid ${isSelected ? 'var(--ink)' : 'var(--border)'}`,
                            background: isSelected ? 'var(--ink)' : 'var(--cream)',
                            cursor: 'pointer', textAlign: 'left',
                            fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                        }}>
                            <span style={{
                                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                                background: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--cream-2)',
                                color: isSelected ? 'var(--gold)' : 'var(--ink-50)',
                            }}>
                                {String.fromCharCode(65 + ci)}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--cream)' : 'var(--ink)', flex: 1 }}>
                                {choice}
                            </span>
                            {isSelected && <span style={{ color: 'var(--gold)', fontSize: '14px' }}>✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}