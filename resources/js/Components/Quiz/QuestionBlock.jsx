import { CheckCircle2, XCircle, Upload, ImageIcon } from 'lucide-react';

/**
 * QuestionBlock.jsx — Tailwind CSS + Lucide icons
 * Supports: quiz (multiple choice), fill (text input), drawing (file upload)
 */
export default function QuestionBlock({
    question,
    index          = 0,
    activityType   = 'quiz',
    value          = '',
    onChange,
    showResult     = false,
    disabled       = false,
    totalQuestions = null,
}) {
    if (!question) return null;

    const choices     = Array.isArray(question.choices) ? question.choices : [];
    const isCorrect   = showResult && value === question.correct_answer;
    const isWrong     = showResult && value && value !== question.correct_answer;
    const questionNum = index + 1;

    return (
        <div
            className="rounded-xl overflow-hidden mb-4 border transition-colors duration-200"
            style={{ borderColor: isCorrect ? '#C2DEC8' : isWrong ? '#F5C6C6' : 'var(--border)' }}
        >
            {/* Question header */}
            <div
                className="px-4 md:px-[18px] py-3.5 flex items-start gap-3 border-b"
                style={{
                    background:  isCorrect ? 'var(--sage-pale)' : isWrong ? 'var(--rose-pale)' : 'var(--cream-2)',
                    borderColor: 'var(--border-lt)',
                }}
            >
                {/* Number pill */}
                <span
                    className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold leading-relaxed border"
                    style={{
                        fontFamily:  "'JetBrains Mono', monospace",
                        background:  isCorrect ? 'var(--sage-pale)' : isWrong ? 'var(--rose-pale)' : 'var(--cream-3)',
                        borderColor: isCorrect ? '#C2DEC8' : isWrong ? '#F5C6C6' : 'var(--border)',
                        color:       isCorrect ? 'var(--sage)' : isWrong ? 'var(--rose)' : 'var(--ink-50)',
                    }}
                >
                    {questionNum}{totalQuestions ? ` / ${totalQuestions}` : ''}
                </span>

                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold leading-snug m-0" style={{ color: 'var(--ink)' }}>
                        {question.question_text}
                    </p>
                    {question.points > 0 && (
                        <span
                            className="text-[9px] tracking-[0.1em] uppercase block mt-1"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}
                        >
                            {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                    )}
                </div>

                {showResult && (
                    isCorrect
                        ? <CheckCircle2 size={18} className="flex-shrink-0" style={{ color: 'var(--sage)' }} />
                        : <XCircle     size={18} className="flex-shrink-0" style={{ color: 'var(--rose)' }} />
                )}
            </div>

            {/* Answer area */}
            <div className="px-4 md:px-[18px] py-4">

                {/* ── QUIZ: multiple choice ────────────────────────────── */}
                {activityType === 'quiz' && choices.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {choices.map((choice, i) => {
                            const isChosen   = value === choice;
                            const isRight    = showResult && choice === question.correct_answer;
                            const isThisWrong= showResult && isChosen && choice !== question.correct_answer;

                            return (
                                <label
                                    key={i}
                                    className={`
                                        flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border
                                        transition-all duration-150
                                        ${disabled ? 'cursor-default' : 'cursor-pointer'}
                                    `}
                                    style={{
                                        borderColor: isRight ? '#6A9E7F' : isThisWrong ? '#D47070' : isChosen ? 'var(--gold)' : 'var(--border)',
                                        background:  isRight ? 'var(--sage-pale)' : isThisWrong ? 'var(--rose-pale)' : isChosen ? 'var(--gold-pale)' : 'var(--white)',
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
                                        style={{ accentColor: 'var(--gold)' }}
                                    />
                                    <span
                                        className={`text-[13px] flex-1 ${isRight || isChosen ? 'font-semibold' : 'font-normal'}`}
                                        style={{ color: isRight ? 'var(--sage)' : isThisWrong ? 'var(--rose)' : 'var(--ink-80)' }}
                                    >
                                        {choice}
                                    </span>
                                    {isRight     && <CheckCircle2 size={14} style={{ color: 'var(--sage)' }} className="flex-shrink-0" />}
                                    {isThisWrong && <XCircle      size={14} style={{ color: 'var(--rose)' }} className="flex-shrink-0" />}
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* ── FILL: text input ──────────────────────────────────── */}
                {activityType === 'fill' && (
                    <div>
                        <input
                            type="text"
                            value={value || ''}
                            disabled={disabled}
                            placeholder="Type your answer here…"
                            onChange={e => onChange?.(question.id, e.target.value)}
                            className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none border transition-colors"
                            style={{
                                borderColor: isCorrect ? '#6A9E7F' : isWrong ? '#D47070' : 'var(--border)',
                                fontFamily:  "'Outfit', sans-serif",
                                color:       'var(--ink)',
                                background:  disabled ? 'var(--cream-2)' : 'var(--white)',
                            }}
                            onFocus={e => { if (!disabled) e.target.style.borderColor = 'var(--gold)'; }}
                            onBlur={e => {
                                e.target.style.borderColor = isCorrect ? '#6A9E7F' : isWrong ? '#D47070' : 'var(--border)';
                            }}
                        />
                        {showResult && !isCorrect && question.correct_answer && (
                            <p className="text-[12px] mt-1.5" style={{ color: 'var(--sage)' }}>
                                Correct answer: <strong>{question.correct_answer}</strong>
                            </p>
                        )}
                    </div>
                )}

                {/* ── DRAWING: file upload ──────────────────────────────── */}
                {activityType === 'drawing' && (
                    <div className="flex flex-col gap-2.5">
                        <label
                            className="flex flex-col items-center justify-center p-6 rounded-[10px] border-2 border-dashed gap-2 transition-colors cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--gold-pale)]"
                            style={{
                                borderColor: 'var(--border)',
                                background:  'var(--cream)',
                                cursor:      disabled ? 'default' : 'pointer',
                            }}
                        >
                            <ImageIcon size={24} style={{ color: 'var(--ink-50)' }} />
                            <span className="text-[13px]" style={{ color: 'var(--ink-50)' }}>Click to upload drawing or photo</span>
                            <span className="text-[11px]" style={{ color: 'var(--ink-50)' }}>PNG, JPG up to 5MB</span>
                            <input
                                type="file"
                                accept="image/*"
                                disabled={disabled}
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) onChange?.(question.id, file.name);
                                }}
                            />
                        </label>

                        <textarea
                            rows={2}
                            value={value || ''}
                            disabled={disabled}
                            placeholder="Add a note about your drawing (optional)…"
                            onChange={e => onChange?.(question.id, e.target.value)}
                            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] outline-none border resize-y transition-colors"
                            style={{
                                fontFamily:  "'Outfit', sans-serif",
                                color:       'var(--ink)',
                                borderColor: 'var(--border)',
                                background:  disabled ? 'var(--cream-2)' : 'var(--white)',
                            }}
                            onFocus={e => { if (!disabled) e.target.style.borderColor = 'var(--gold)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}