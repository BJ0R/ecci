// resources/js/Pages/Parent/Lessons/Show.jsx
// ─────────────────────────────────────────────────────────────────
// Rendered by LessonViewController@show
// Props: lesson (with .content, .activities[]), flash
//
// FIXES:
//  1. Mark-complete POST → /lessons/{id}/complete  ← LessonViewController@complete
//     (/lessons/{id}/progress was 404 — wrong route)
//  2. Activity links → /activities/{id}?child_id=X  (Laravel resource route)
//  3. Logo src removed from this page (lives only in AppLayout sidebar)
//  4. Activity step shown ONLY when lesson has activities
//  5. completedSteps array tracked in state so stepper shows ticks properly
// ─────────────────────────────────────────────────────────────────

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, ArrowRight, BookMarked, ScrollText,
    Lightbulb, Heart, ClipboardList, CheckCircle2,
    ChevronRight, Award,
} from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';
import LessonStepper, { LESSON_STEPS } from '@/Components/Lessons/LessonStepper';

// ── ECCSII tokens ──────────────────────────────────────────────────
const T = {
    bg100:     '#060915',
    bg300:     '#101A38',
    bg400:     '#16224A',
    bg500:     '#1D2D5E',
    gold:      '#D4930A',
    goldLt:    '#F0B429',
    goldPale:  'rgba(212,147,10,0.12)',
    cream:     '#EDE6D6',
    muted:     '#8A7F6E',
    faint:     '#3A3224',
    sage:      '#3C7554',
    sageLt:    '#59A472',
    sagePale:  'rgba(60,117,84,0.14)',
    sky:       '#2453A0',
    skyLt:     '#4876CC',
    purple:    '#7A4FC0',
    red:       '#C83030',
    border:    'rgba(212,147,10,0.13)',
    borderDim: 'rgba(237,230,214,0.06)',
};

export default function LessonShow({ lesson = {} }) {
    const { flash } = usePage().props;

    const content    = lesson.content    ?? {};
    const activities = lesson.activities ?? [];
    const hasActs    = activities.length > 0;

    // Build active step list
    const availableSteps = LESSON_STEPS.filter(s => {
        if (s.key === 'activity') return hasActs;
        return true;
    });

    const [stepIndex,       setStepIndex]       = useState(0);
    const [completedSteps,  setCompletedSteps]  = useState([]);
    const [markingComplete, setMarkingComplete] = useState(false);

    // Restore child_id from URL
    const childId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('child_id')
        : null;

    const currentStep = availableSteps[stepIndex];
    const isFirst     = stepIndex === 0;
    const isLast      = stepIndex === availableSteps.length - 1;

    // Mark current step as "completed" when we advance past it
    function advance() {
        if (isLast) return;
        setCompletedSteps(prev => [...new Set([...prev, currentStep.key])]);
        setStepIndex(i => i + 1);
    }

    function retreat() {
        if (!isFirst) setStepIndex(i => i - 1);
    }

    function jumpTo(key) {
        const idx = availableSteps.findIndex(s => s.key === key);
        if (idx >= 0) setStepIndex(idx);
    }

    // ── POST to /lessons/{id}/complete to mark as complete ─────────
    // Route: POST /lessons/{lesson}/complete  → LessonViewController@complete
    // This stores/updates a lesson_progresses row with status='completed'
    function markComplete() {
        if (!childId) return;
        setMarkingComplete(true);
        router.post(
            `/lessons/${lesson.id}/complete`,
            { child_profile_id: childId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMarkingComplete(false);
                    setCompletedSteps(prev => [...new Set([...prev, 'completed'])]);
                },
                onError: () => setMarkingComplete(false),
            }
        );
    }

    // Keyboard nav
    useEffect(() => {
        function onKey(e) {
            if (e.key === 'ArrowRight') advance();
            if (e.key === 'ArrowLeft')  retreat();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [stepIndex, availableSteps.length]);

    const stepDef  = LESSON_STEPS.find(s => s.key === currentStep?.key) ?? LESSON_STEPS[0];
    const StepIcon = stepDef.Icon ?? BookMarked;

    return (
        <AppLayout>
            <Head title={`${lesson.title ?? 'Lesson'} — ECCSII`} />

            {/* Flash */}
            {flash?.success && (
                <div style={{
                    padding: '11px 16px', borderRadius: '10px', marginBottom: '18px',
                    border: `1px solid rgba(60,117,84,0.35)`, background: T.sagePale,
                    fontSize: '13px', color: T.sageLt,
                    display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    <CheckCircle2 size={14} /> {flash.success}
                </div>
            )}

            {/* ── Back + header ──────────────────────────────────── */}
            <div style={{ marginBottom: '22px' }}>
                <Link
                    href={childId ? `/lessons?child_id=${childId}` : '/lessons'}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', color: T.faint, textDecoration: 'none',
                        marginBottom: '12px', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = T.muted}
                    onMouseLeave={e => e.currentTarget.style.color = T.faint}
                >
                    <ArrowLeft size={12} /> Back to Lessons
                </Link>

                <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: T.gold, marginBottom: '5px',
                }}>
                    Week {lesson.week_number}{lesson.series ? ` · ${lesson.series}` : ''}
                </div>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '26px', fontWeight: 700, color: T.cream, margin: 0,
                }}>
                    {lesson.title}
                </h1>
            </div>

            {/* ── Stepper ────────────────────────────────────────── */}
            <LessonStepper
                currentStep={currentStep?.key}
                onStepClick={jumpTo}
                completedSteps={completedSteps}
                hasActivities={hasActs}
            />

            {/* ── Step card ──────────────────────────────────────── */}
            <div style={{
                borderRadius: '18px', overflow: 'hidden', minHeight: '380px',
                background: `linear-gradient(145deg, ${T.bg400} 0%, ${T.bg300} 100%)`,
                border: `1px solid ${T.border}`,
                boxShadow: `0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
                marginBottom: '18px',
            }}>
                {/* Step header strip */}
                <div style={{
                    padding: '16px 26px',
                    background: `linear-gradient(135deg, rgba(${stepDef.colorRgb ?? '212,147,10'},0.14) 0%, transparent 100%)`,
                    borderBottom: `1px solid ${T.borderDim}`,
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                        background: `rgba(${stepDef.colorRgb ?? '212,147,10'},0.18)`,
                        border: `1px solid rgba(${stepDef.colorRgb ?? '212,147,10'},0.35)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <StepIcon size={17} style={{ color: stepDef.color ?? T.gold }} />
                    </div>
                    <div>
                        <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '8px', letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: stepDef.color ?? T.gold,
                            marginBottom: '2px',
                        }}>
                            Step {stepIndex + 1} of {availableSteps.length}
                        </div>
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '19px', fontWeight: 700, color: T.cream,
                        }}>
                            {currentStep?.label}
                        </div>
                    </div>
                </div>

                {/* Step body */}
                <div style={{ padding: '26px 26px 22px' }}>
                    {currentStep?.key === 'scripture'  && <ScriptureStep  content={content} />}
                    {currentStep?.key === 'lesson'     && <LessonStep     content={content} />}
                    {currentStep?.key === 'reflection' && <ReflectionStep content={content} />}
                    {currentStep?.key === 'prayer'     && <PrayerStep     content={content} />}
                    {currentStep?.key === 'activity'   && <ActivityStep   activities={activities} childId={childId} />}
                    {currentStep?.key === 'completed'  && (
                        <CompletedStep
                            lesson={lesson}
                            childId={childId}
                            onMarkComplete={markComplete}
                            marking={markingComplete}
                        />
                    )}
                </div>
            </div>

            {/* ── Nav buttons ────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <button onClick={retreat} disabled={isFirst} style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '10px 20px', borderRadius: '10px',
                    border: `1px solid ${T.border}`,
                    background: T.bg400,
                    color: isFirst ? T.faint : T.cream,
                    fontSize: '13px', fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                    cursor: isFirst ? 'not-allowed' : 'pointer',
                    opacity: isFirst ? 0.4 : 1, transition: 'all 0.15s',
                }}>
                    <ArrowLeft size={14} /> Previous
                </button>

                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px', color: T.faint, letterSpacing: '0.1em',
                }}>
                    {stepIndex + 1} / {availableSteps.length}
                </span>

                {!isLast && (
                    <button onClick={advance} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '10px 22px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #D4930A 0%, #A0701A 100%)',
                        color: '#060915', fontSize: '13px', fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(212,147,10,0.28)',
                        transition: 'all 0.15s',
                    }}>
                        Next <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </AppLayout>
    );
}

/* ══════════════════════════════════════════════════════════
   STEP CONTENT COMPONENTS
══════════════════════════════════════════════════════════ */

/* ── Scripture ──────────────────────────────────────────── */
function ScriptureStep({ content }) {
    return (
        <div>
            {content.bible_reference && (
                <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4930A', marginBottom: '7px' }}>
                        Bible Reference
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px', borderRadius: '100px',
                        background: 'rgba(212,147,10,0.12)', border: '1px solid rgba(212,147,10,0.25)',
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', fontWeight: 600,
                        color: '#F0B429',
                    }}>
                        <BookMarked size={13} style={{ color: '#D4930A' }} />
                        {content.bible_reference}
                    </div>
                </div>
            )}

            {content.bible_text ? (
                <div style={{
                    padding: '24px 28px', borderRadius: '14px', position: 'relative',
                    background: 'linear-gradient(145deg, rgba(212,147,10,0.07) 0%, rgba(36,83,160,0.07) 100%)',
                    border: '1px solid rgba(212,147,10,0.18)', borderLeft: `4px solid #D4930A`,
                    boxShadow: 'inset 0 0 40px rgba(212,147,10,0.04)',
                }}>
                    <div style={{
                        position: 'absolute', top: '8px', right: '18px',
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '80px',
                        fontWeight: 700, color: 'rgba(212,147,10,0.07)', lineHeight: 1,
                        pointerEvents: 'none', userSelect: 'none',
                    }}>"</div>
                    <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '20px', fontStyle: 'italic', lineHeight: 1.78,
                        color: '#EDE6D6', margin: '0 0 14px', position: 'relative',
                    }}>
                        {content.bible_text}
                    </p>
                    {content.bible_reference && (
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, color: '#D4930A' }}>
                            — {content.bible_reference}
                        </div>
                    )}
                </div>
            ) : (
                <EmptyNote text="No scripture text has been added to this lesson yet." />
            )}

            <HintBox>
                Read this scripture aloud together as a family before moving on.
            </HintBox>
        </div>
    );
}

/* ── Lesson ─────────────────────────────────────────────── */
function LessonStep({ content }) {
    // DB column is `explanation` — not `lesson_text`
    const text = content.explanation;
    return (
        <div>
            {text ? (
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', lineHeight: 1.85, color: '#EDE6D6' }}>
                    {text.split('\n').filter(p => p.trim()).map((para, i) => (
                        <p key={i} style={{ margin: '0 0 16px' }}>{para}</p>
                    ))}
                </div>
            ) : (
                <EmptyNote text="Lesson content has not been added yet." />
            )}
        </div>
    );
}

/* ── Reflection ─────────────────────────────────────────── */
function ReflectionStep({ content }) {
    const rawQ = content.reflection_questions;
    const questions = rawQ
        ? (typeof rawQ === 'string' ? rawQ.split('\n').filter(q => q.trim()) : rawQ)
        : [];

    return (
        <div>
            <p style={{ fontSize: '14px', color: '#8A7F6E', lineHeight: 1.65, marginTop: 0, marginBottom: '20px' }}>
                Use these questions to guide a family discussion about today's lesson.
            </p>
            {questions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {questions.map((q, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '12px',
                            padding: '14px 18px', borderRadius: '12px',
                            background: 'rgba(122,79,192,0.08)', border: '1px solid rgba(122,79,192,0.2)',
                            borderLeft: '3px solid #7A4FC0',
                        }}>
                            <div style={{
                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                background: 'rgba(122,79,192,0.18)', border: '1px solid rgba(122,79,192,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#7A4FC0',
                            }}>
                                {i + 1}
                            </div>
                            <p style={{ fontSize: '14px', color: '#EDE6D6', lineHeight: 1.65, margin: 0, paddingTop: '2px' }}>
                                {q}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyNote text="No reflection questions have been added." />
            )}
        </div>
    );
}

/* ── Prayer ─────────────────────────────────────────────── */
function PrayerStep({ content }) {
    return (
        <div>
            <p style={{ fontSize: '14px', color: '#8A7F6E', lineHeight: 1.65, marginTop: 0, marginBottom: '20px' }}>
                Close this section in prayer. Use this guide or pray in your own words.
            </p>

            {/* DB column is `prayer` — not `prayer_text` */}
            {content.prayer ? (
                <div style={{
                    padding: '22px 26px', borderRadius: '14px', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(200,48,48,0.09) 0%, rgba(200,48,48,0.04) 100%)',
                    border: '1px solid rgba(200,48,48,0.25)',
                    borderLeft: '4px solid #C83030',
                }}>
                    {/* Decorative cross */}
                    <svg style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04, pointerEvents: 'none' }} width="50" height="66" viewBox="0 0 26 34">
                        <rect x="10" y="0" width="6" height="34" rx="1.5" fill="#C83030" />
                        <rect x="0" y="9" width="26" height="6" rx="1.5" fill="#C83030" />
                    </svg>

                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E05050', marginBottom: '12px' }}>
                        🙏 Prayer Guide
                    </div>
                    <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '17px', fontStyle: 'italic', lineHeight: 1.8, color: '#EDE6D6',
                        margin: 0, position: 'relative',
                    }}>
                        {content.prayer}
                    </p>
                </div>
            ) : (
                <EmptyNote text="No prayer guide has been added for this lesson." />
            )}

            <HintBox>
                Encourage every family member to add their own thanksgiving or requests.
            </HintBox>
        </div>
    );
}

/* ── Activity ───────────────────────────────────────────── */
// ── FIX: Links now go to /activities/{id}?child_id={childId}
//         which maps to Route::get('/activities/{activity}', ...)
function ActivityStep({ activities, childId }) {
    return (
        <div>
            <p style={{ fontSize: '14px', color: '#8A7F6E', lineHeight: 1.65, marginTop: 0, marginBottom: '20px' }}>
                Complete the {activities.length === 1 ? 'activity' : 'activities'} below to finish this lesson.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activities.map(activity => {
                    const isQuiz = activity.type === 'quiz';
                    // ── Correct route: /activities/{id}  ──────────────────────
                    const href = `/activities/${activity.id}${childId ? `?child_id=${childId}` : ''}`;

                    return (
                        <Link key={activity.id} href={href} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '15px 18px', borderRadius: '12px', cursor: 'pointer',
                                background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(212,147,10,0.13)`,
                                transition: 'all 0.18s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,147,10,0.08)'; e.currentTarget.style.border = `1px solid rgba(212,147,10,0.28)`; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = `1px solid rgba(212,147,10,0.13)`; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: '10px', flexShrink: 0,
                                    background: isQuiz ? 'rgba(30,122,80,0.18)' : 'rgba(212,147,10,0.14)',
                                    border: `1px solid ${isQuiz ? 'rgba(30,122,80,0.3)' : 'rgba(212,147,10,0.25)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                }}>
                                    {isQuiz ? '🧠' : '✏️'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#EDE6D6', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {activity.title}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: isQuiz ? '#59A472' : '#D4930A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {isQuiz ? 'Quiz' : 'Fill-In'}
                                        </span>
                                        {activity.max_score > 0 && (
                                            <span style={{ fontSize: '10px', color: '#3A3224', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                <Award size={9} /> {activity.questions_count ?? 0}q · {activity.max_score}pts
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={16} style={{ color: '#3A3224', flexShrink: 0 }} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <HintBox>
                After completing all activities, go to the <strong style={{ color: '#59A472' }}>Completed</strong> step to mark this lesson done.
            </HintBox>
        </div>
    );
}

/* ── Completed ──────────────────────────────────────────── */
function CompletedStep({ lesson, childId, onMarkComplete, marking }) {
    const alreadyDone = lesson.progress?.status === 'completed';
    const hasChild    = Boolean(childId);

    return (
        <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 18px',
                background: 'linear-gradient(135deg, rgba(212,147,10,0.20) 0%, rgba(212,147,10,0.08) 100%)',
                border: '2px solid rgba(212,147,10,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', boxShadow: '0 0 36px rgba(212,147,10,0.14)',
            }}>
                🎉
            </div>

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: '#EDE6D6', marginBottom: '8px' }}>
                Lesson Complete!
            </div>
            <p style={{ fontSize: '14px', color: '#8A7F6E', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 28px' }}>
                You've gone through all sections of <em style={{ color: '#D4930A' }}>{lesson.title}</em>.
                {hasChild ? ' Mark it as completed to save your progress.' : ''}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                {/* ── Mark complete button → POST /lessons/{id}/complete ── */}
                {hasChild && !alreadyDone && (
                    <button onClick={onMarkComplete} disabled={marking} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #59A472 0%, #3C7554 100%)',
                        color: '#060915', fontSize: '14px', fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        boxShadow: '0 4px 18px rgba(60,117,84,0.3)',
                        opacity: marking ? 0.7 : 1, transition: 'all 0.15s',
                    }}>
                        <CheckCircle2 size={16} />
                        {marking ? 'Saving…' : 'Mark as Completed'}
                    </button>
                )}

                {alreadyDone && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '9px 20px', borderRadius: '100px',
                        background: 'rgba(60,117,84,0.14)', border: '1px solid rgba(60,117,84,0.3)',
                        fontSize: '12px', fontWeight: 600, color: '#59A472',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        <CheckCircle2 size={13} /> Already marked complete ✓
                    </div>
                )}

                <Link
                    href={childId ? `/lessons?child_id=${childId}` : '/lessons'}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        padding: '9px 20px', borderRadius: '10px',
                        border: `1px solid rgba(212,147,10,0.2)`,
                        background: 'rgba(255,255,255,0.04)',
                        color: '#8A7F6E', fontSize: '13px', fontWeight: 600,
                        textDecoration: 'none', fontFamily: "'Outfit', sans-serif",
                    }}
                >
                    <ArrowLeft size={13} /> Back to Lessons
                </Link>
            </div>
        </div>
    );
}

/* ── Shared helpers ─────────────────────────────────────── */
function EmptyNote({ text }) {
    return (
        <div style={{
            padding: '28px', textAlign: 'center', borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(237,230,214,0.1)',
            color: '#3A3224', fontSize: '13px',
        }}>
            {text}
        </div>
    );
}

function HintBox({ children }) {
    return (
        <div style={{
            marginTop: '18px', padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(237,230,214,0.07)`,
            fontSize: '12px', color: '#3A3224', lineHeight: 1.6,
        }}>
            💡 {children}
        </div>
    );
}