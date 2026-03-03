import { CheckCircle2, XCircle, ImageIcon } from 'lucide-react';

/**
 * QuestionBlock.jsx — ECCII logo palette
 * quiz | fill | drawing
 * Hierarchy: number pill → question text → points → answer area → result feedback
 */
export default function QuestionBlock({
    question, index = 0, activityType = 'quiz',
    value = '', onChange, showResult = false,
    disabled = false, totalQuestions = null,
}) {
    if (!question) return null;

    const choices     = Array.isArray(question.choices) ? question.choices : [];
    const isCorrect   = showResult && value === question.correct_answer;
    const isWrong     = showResult && value && value !== question.correct_answer;
    const questionNum = index + 1;

    const headerBg    = isCorrect ? '#ddf0e4' : isWrong ? '#fae0de' : '#f0f4fc';
    const borderColor = isCorrect ? 'rgba(30,110,66,0.25)' : isWrong ? 'rgba(192,32,30,0.25)' : 'rgba(13,31,92,0.10)';
    const pillBg      = isCorrect ? '#ddf0e4' : isWrong ? '#fae0de' : 'rgba(13,31,92,0.07)';
    const pillColor   = isCorrect ? '#145c32' : isWrong ? '#8c1816' : 'rgba(13,31,92,0.50)';

    return (
        <div
            className="rounded-xl overflow-hidden mb-4 transition-all duration-200"
            style={{ border: `1px solid ${borderColor}`, boxShadow: 'var(--shadow-sm)' }}
        >
            {/* ── Question header ── */}
            <div
                className="px-4 md:px-5 py-3.5 flex items-start gap-3"
                style={{
                    background:   headerBg,
                    borderBottom: `1px solid ${borderColor}`,
                }}
            >
                {/* Number pill */}
                <span
                    className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none border mt-0.5"
                    style={{
                        fontFamily:  "'JetBrains Mono', monospace",
                        background:  pillBg,
                        borderColor: borderColor,
                        color:       pillColor,
                    }}
                >
                    {questionNum}{totalQuestions ? ` / ${totalQuestions}` : ''}
                </span>

                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold leading-snug m-0" style={{ color: '#0d1f5c' }}>
                        {question.question_text}
                    </p>
                    {question.points > 0 && (
                        <span
                            className="text-[9px] tracking-[0.12em] uppercase block mt-1 font-bold"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: '#b87010' }}
                        >
                            {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                    )}
                </div>

                {showResult && (
                    isCorrect
                        ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#1e6e42' }} />
                        : <XCircle      size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#c0201e' }} />
                )}
            </div>

            {/* ── Answer area ── */}
            <div className="px-4 md:px-5 py-4" style={{ background: '#ffffff' }}>

                {/* QUIZ: multiple choice */}
                {activityType === 'quiz' && choices.length > 0 && (
                    <div className="flex flex-col gap-2" role="radiogroup" aria-label={question.question_text}>
                        {choices.map((choice, i) => {
                            const isChosen    = value === choice;
                            const isRight     = showResult && choice === question.correct_answer;
                            const isThisWrong = showResult && isChosen && choice !== question.correct_answer;

                            return (
                                <label
                                    key={i}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-150 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                                    style={{
                                        borderColor: isRight      ? 'rgba(30,110,66,0.40)'   :
                                                     isThisWrong  ? 'rgba(192,32,30,0.40)'   :
                                                     isChosen     ? '#e8a020'                 : 'rgba(13,31,92,0.10)',
                                        background:  isRight      ? '#ddf0e4'                 :
                                                     isThisWrong  ? '#fae0de'                 :
                                                     isChosen     ? 'rgba(232,160,32,0.10)'   : '#ffffff',
                                        boxShadow:   isChosen && !isRight && !isThisWrong
                                                       ? '0 0 0 3px rgba(232,160,32,0.15)' : 'none',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={choice}
                                        checked={isChosen}
                                        disabled={disabled}
                                        onChange={() => onChange?.(question.id, choice)}
                                        className="w-4 h-4 flex-shrink-0"
                                        style={{ accentColor: '#e8a020' }}
                                    />
                                    <span
                                        className="text-[13px] flex-1"
                                        style={{
                                            color:      isRight ? '#145c32' : isThisWrong ? '#8c1816' : 'rgba(13,31,92,0.80)',
                                            fontWeight: (isRight || isChosen) ? '600' : '400',
                                        }}
                                    >
                                        {choice}
                                    </span>
                                    {isRight     && <CheckCircle2 size={14} className="flex-shrink-0" style={{ color: '#1e6e42' }} />}
                                    {isThisWrong && <XCircle      size={14} className="flex-shrink-0" style={{ color: '#c0201e' }} />}
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* FILL: text input */}
                {activityType === 'fill' && (
                    <div>
                        <input
                            type="text"
                            value={value || ''}
                            disabled={disabled}
                            placeholder="Type your answer here…"
                            onChange={e => onChange?.(question.id, e.target.value)}
                            aria-label={question.question_text}
                            className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none border transition-all"
                            style={{
                                borderColor: isCorrect ? 'rgba(30,110,66,0.50)' : isWrong ? 'rgba(192,32,30,0.50)' : 'rgba(13,31,92,0.16)',
                                fontFamily:  "'Outfit', sans-serif",
                                color:       '#0d1f5c',
                                background:  disabled ? '#f0f4fc' : '#ffffff',
                            }}
                            onFocus={e  => { if (!disabled) { e.target.style.borderColor = '#e8a020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.18)'; } }}
                            onBlur={e   => {
                                e.target.style.boxShadow   = 'none';
                                e.target.style.borderColor = isCorrect ? 'rgba(30,110,66,0.50)' : isWrong ? 'rgba(192,32,30,0.50)' : 'rgba(13,31,92,0.16)';
                            }}
                        />
                        {showResult && !isCorrect && question.correct_answer && (
                            <p className="flex items-center gap-1.5 text-[12px] mt-2 font-semibold" style={{ color: '#145c32' }}>
                                <CheckCircle2 size={13} />
                                Correct answer: {question.correct_answer}
                            </p>
                        )}
                    </div>
                )}

                {/* DRAWING: file upload */}
                {activityType === 'drawing' && (
                    <div className="flex flex-col gap-3">
                        <label
                            className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed gap-2 transition-all"
                            style={{
                                borderColor: 'rgba(13,31,92,0.15)',
                                background:  disabled ? '#f0f4fc' : '#f8faff',
                                cursor:      disabled ? 'default' : 'pointer',
                            }}
                            onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#e8a020'; e.currentTarget.style.background = 'rgba(232,160,32,0.06)'; } }}
                            onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = 'rgba(13,31,92,0.15)'; e.currentTarget.style.background = '#f8faff'; } }}
                        >
                            <ImageIcon size={28} style={{ color: 'rgba(13,31,92,0.30)' }} />
                            <span className="text-[13px] font-medium" style={{ color: 'rgba(13,31,92,0.50)' }}>
                                Click to upload drawing or photo
                            </span>
                            <span className="text-[11px]" style={{ color: 'rgba(13,31,92,0.35)' }}>
                                PNG · JPG · up to 5 MB
                            </span>
                            <input
                                type="file" accept="image/*" disabled={disabled} className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) onChange?.(question.id, f.name); }}
                            />
                        </label>

                        <textarea
                            rows={2} value={value || ''} disabled={disabled}
                            placeholder="Add a note about your drawing (optional)…"
                            onChange={e => onChange?.(question.id, e.target.value)}
                            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] outline-none border resize-y transition-all"
                            style={{
                                fontFamily:  "'Outfit', sans-serif",
                                color:       '#0d1f5c',
                                borderColor: 'rgba(13,31,92,0.15)',
                                background:  disabled ? '#f0f4fc' : '#ffffff',
                            }}
                            onFocus={e => { if (!disabled) { e.target.style.borderColor = '#e8a020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.18)'; } }}
                            onBlur={e  => { e.target.style.borderColor = 'rgba(13,31,92,0.15)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}