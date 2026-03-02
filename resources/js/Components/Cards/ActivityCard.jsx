import { Link } from '@inertiajs/react';
import { ClipboardCheck, Pencil, Palette, CheckCircle2, Star } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';

/**
 * ActivityCard.jsx — Tailwind CSS + Lucide icons
 */
export default function ActivityCard({ activity, submission, childId, childName, onStart }) {
    const isSubmitted = !!submission;

    const typeConfig = {
        quiz:    { label: 'Quiz',      Icon: ClipboardCheck, status: 'quiz'    },
        drawing: { label: 'Drawing',   Icon: Palette,        status: 'drawing' },
        fill:    { label: 'Fill-In',   Icon: Pencil,         status: 'fill'    },
    };
    const tc = typeConfig[activity.type] || typeConfig.quiz;

    const href = childId ? `/activities/${activity.id}?child_id=${childId}` : `/activities/${activity.id}`;

    const scorePercent = isSubmitted && activity.max_score
        ? Math.round((submission.score / activity.max_score) * 100)
        : null;

    const scoreColor = scorePercent === null
        ? ''
        : scorePercent >= 80
        ? 'var(--sage)'
        : scorePercent >= 50
        ? 'var(--amber)'
        : 'var(--rose)';

    return (
        <div
            className={`
                rounded-[14px] border overflow-hidden transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-lg
                ${isSubmitted ? 'opacity-80' : ''}
            `}
            style={{ background: 'var(--white)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
            {/* Header */}
            <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ background: 'var(--gold-pale)', borderColor: '#E8D5A4' }}
            >
                <Badge status={activity.type} size="sm">
                    <tc.Icon size={10} className="mr-1" />
                    {tc.label}
                </Badge>
                <div className="flex items-center gap-1" style={{ color: 'var(--amber)' }}>
                    <Star size={10} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.08em' }}>
                        {activity.max_score} pts
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="text-[15px] font-semibold mb-1.5 leading-snug" style={{ color: 'var(--ink)' }}>
                    {activity.title}
                </div>

                {activity.lesson?.title && (
                    <div className="text-[11px] mb-2" style={{ color: 'var(--ink-50)' }}>
                        From: {activity.lesson.title}
                    </div>
                )}

                {activity.instructions && (
                    <p className="text-[12px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--ink-80)' }}>
                        {activity.instructions}
                    </p>
                )}

                {/* Submitted state */}
                {isSubmitted ? (
                    <div
                        className="rounded-lg p-2.5 flex justify-between items-center border"
                        style={{ background: 'var(--sage-pale)', borderColor: '#C2DEC8' }}
                    >
                        <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-0.5" style={{ color: 'var(--sage)' }}>
                                <CheckCircle2 size={12} />
                                Completed by {childName || 'child'}
                            </div>
                            {submission.submitted_at && (
                                <div className="text-[10px]" style={{ color: 'var(--ink-50)' }}>
                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        {scorePercent !== null && (
                            <div
                                className="text-[22px] font-bold leading-none"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: scoreColor }}
                            >
                                {submission.score}/{activity.max_score}
                            </div>
                        )}
                    </div>
                ) : (
                    onStart ? (
                        <Button variant="gold" size="sm" onClick={onStart} className="w-full justify-center">
                            Start Activity
                        </Button>
                    ) : (
                        <Link href={href} className="block">
                            <Button variant="gold" size="sm" className="w-full justify-center">
                                Start Activity
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}