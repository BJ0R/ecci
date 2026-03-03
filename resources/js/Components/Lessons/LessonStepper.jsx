import React from 'react';
import { BookOpen, ScrollText, HeartHandshake, Flame, ClipboardCheck, CheckCircle2 } from 'lucide-react';

export const LESSON_STEPS = [
    { key: 'scripture',   label: 'Scripture',   Icon: BookOpen,        color: '#e8a020' },
    { key: 'lesson',      label: 'Lesson',      Icon: ScrollText,      color: '#1a5c8a' },
    { key: 'reflection',  label: 'Reflection',  Icon: HeartHandshake, color: '#b87010' },
    { key: 'prayer',      label: 'Prayer',      Icon: Flame,           color: '#c0201e' },
    { key: 'activity',    label: 'Activity',    Icon: ClipboardCheck, color: '#1e6e42' },
    { key: 'completed',   label: 'Completed',   Icon: CheckCircle2,    color: '#0d1f5c' },
];

export default function LessonStepper({ currentStep = 'scripture', onStepClick, completedSteps = [] }) {
    const currentIdx  = LESSON_STEPS.findIndex(s => s.key === currentStep);
    const stepCount   = LESSON_STEPS.length;
    const progressPercent = ((currentIdx + 1) / stepCount) * 100;

    return (
        <div className="w-full mb-6">
            {/* ── Desktop Stepper ─────────────────────────────── */}
            <div className="hidden md:block">
                <div 
                    className="rounded-xl overflow-hidden shadow-lg border border-white/10"
                    style={{ background: 'linear-gradient(135deg, #101e5a 0%, #080f30 100%)' }}
                >
                    <div className="flex items-stretch">
                        {LESSON_STEPS.map((step, idx) => {
                            const isActive    = step.key === currentStep;
                            const isCompleted = completedSteps.includes(step.key);
                            const isPast      = idx < currentIdx;
                            const isLast      = idx === stepCount - 1;
                            const isClickable = onStepClick && (isCompleted || isPast || isActive);

                            return (
                                <div key={step.key} className="flex-1 relative flex items-stretch">
                                    <button
                                        onClick={() => isClickable && onStepClick(step.key)}
                                        disabled={!isClickable}
                                        className={`
                                            w-full flex flex-col items-center justify-center gap-2
                                            px-2 py-4 relative z-10 transition-all duration-300
                                            ${isActive ? 'bg-white/5' : 'hover:bg-white/[0.02]'}
                                            ${isClickable ? 'cursor-pointer' : 'cursor-default opacity-40'}
                                        `}
                                        style={{
                                            borderBottom: isActive ? `3px solid ${step.color}` : '3px solid transparent',
                                        }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                                            style={{
                                                background: isActive ? step.color : 'rgba(255,255,255,0.08)',
                                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: isActive ? `0 0 15px rgba(${hexToRgb(step.color)}, 0.4)` : 'none'
                                            }}
                                        >
                                            <step.Icon size={14} color={isActive ? "#fff" : "rgba(255,255,255,0.5)"} />
                                        </div>

                                        <span className="text-[10px] tracking-widest uppercase font-bold text-white/90" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {step.label}
                                        </span>
                                    </button>
                                    
                                    {!isLast && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-20">
                                            <svg width="8" height="12" viewBox="0 0 8 12"><path d="M1 1l5 5-5 5" fill="none" stroke="white" strokeWidth="2"/></svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Mobile Stepper (Decreased Size & Optimized) ── */}
            <div className="md:hidden">
                <div 
                    className="rounded-lg p-1 shadow-xl border border-white/5"
                    style={{ background: '#080f30' }}
                >
                    {/* flex-nowrap with justify-between fits all steps on most modern screens */}
                    <div className="flex flex-nowrap items-center justify-between px-1">
                        {LESSON_STEPS.map((step, idx) => {
                            const isActive    = step.key === currentStep;
                            const isCompleted = completedSteps.includes(step.key);
                            const isPast      = idx < currentIdx;

                            return (
                                <button
                                    key={step.key}
                                    onClick={() => onStepClick && (isCompleted || isPast || isActive) && onStepClick(step.key)}
                                    className={`
                                        flex flex-col items-center gap-1.5 py-2 px-1 
                                        transition-all duration-300 flex-1
                                    `}
                                    style={{
                                        background: isActive ? `rgba(${hexToRgb(step.color)}, 0.15)` : 'transparent',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                                        style={{
                                            background: isActive ? step.color : (isCompleted || isPast) ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                                            border: isActive ? `1.5px solid rgba(255,255,255,0.3)` : 'none'
                                        }}
                                    >
                                        {/* Reduced icon size from 16 to 12 */}
                                        <step.Icon size={12} style={{ color: isActive ? '#fff' : (isCompleted || isPast) ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }} />
                                    </div>
                                    
                                    {/* Text is only shown for the active step to save space, or use an even smaller font */}
                                    <span className={`text-[8px] font-bold uppercase tracking-tight transition-opacity duration-300 ${isActive ? 'text-white opacity-100' : 'text-white/30 opacity-0 hidden'}`}>
                                        {step.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Progress Bar Mini - tightened margin */}
                    <div className="h-1 w-full bg-white/5 rounded-full mt-0.5 overflow-hidden">
                        <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                                width: `${progressPercent}%`, 
                                background: LESSON_STEPS[currentIdx].color,
                                boxShadow: `0 0 8px ${LESSON_STEPS[currentIdx].color}`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Note */}
            {currentStep === 'completed' && (
                <div className="text-center mt-3 animate-pulse">
                    <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#e8a020' }}>
                        ↻ Cycles back to next week's Scripture
                    </span>
                </div>
            )}
        </div>
    );
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '13,31,92';
}