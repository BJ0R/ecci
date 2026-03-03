import { Link } from '@inertiajs/react';
import { ClipboardCheck, Pencil, Palette, CheckCircle2, Star } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';

/**
 * ActivityCard.jsx — ECCII logo palette
 * Gold-tinted header strip · scored result block · hierarchy: type > title > meta > CTA
 */
export default function ActivityCard({ activity, submission, childId, childName, onStart }) {
    const isSubmitted = !!submission;

    const typeConfig = {
        quiz:    { label: 'Quiz',    Icon: ClipboardCheck },
        drawing: { label: 'Drawing', Icon: Palette        },
        fill:    { label: 'Fill-In', Icon: Pencil         },
    };
    const tc   = typeConfig[activity.type] || typeConfig.quiz;
    const href = childId ? `/activities/${activity.id}?child_id=${childId}` : `/activities/${activity.id}`;

    const scorePercent = isSubmitted && activity.max_score
        ? Math.round((submission.score / activity.max_score) * 100) : null;

    const scoreColor  = scorePercent === null ? '' :
                        scorePercent >= 80 ? '#145c32' :
                        scorePercent >= 50 ? '#7a4800' : '#8c1816';

    const scoreBg     = scorePercent === null ? '' :
                        scorePercent >= 80 ? '#ddf0e4' :
                        scorePercent >= 50 ? '#fdefd4' : '#fae0de';

    return (
        <article
            className={`rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${isSubmitted ? 'opacity-85' : ''}`}
            style={{
                background: '#ffffff',
                border:     '1px solid rgba(13,31,92,0.10)',
                boxShadow:  'var(--shadow-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
        >
            {/* ── Gold header strip ── */}
            <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{
                    background:   'rgba(232,160,32,0.10)',
                    borderBottom: '1px solid rgba(232,160,32,0.20)',
                }}
            >
                <Badge status={activity.type} size="sm">
                    <tc.Icon size={10} />
                    {tc.label}
                </Badge>
                <div className="flex items-center gap-1" style={{ color: '#b87010' }}>
                    <Star size={10} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700 }}>
                        {activity.max_score} pts
                    </span>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="p-4">
                {/* Title — primary hierarchy */}
                <h3 className="text-[15px] font-bold mb-1 leading-snug" style={{ color: '#0d1f5c' }}>
                    {activity.title}
                </h3>

                {/* From lesson — secondary */}
                {activity.lesson?.title && (
                    <p className="text-[11px] mb-2" style={{ color: 'rgba(13,31,92,0.45)' }}>
                        From: <span className="font-medium">{activity.lesson.title}</span>
                    </p>
                )}

                {/* Instructions — tertiary */}
                {activity.instructions && (
                    <p className="text-[12px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(13,31,92,0.65)' }}>
                        {activity.instructions}
                    </p>
                )}

                {/* ── Submitted result block ── */}
                {isSubmitted ? (
                    <div
                        className="rounded-lg p-3 flex justify-between items-center"
                        style={{ background: '#ddf0e4', border: '1px solid rgba(30,110,66,0.20)' }}
                    >
                        <div>
                            <div className="flex items-center gap-1.5 text-[12px] font-bold mb-0.5" style={{ color: '#145c32' }}>
                                <CheckCircle2 size={13} />
                                Completed by {childName || 'child'}
                            </div>
                            {submission.submitted_at && (
                                <p className="text-[10px]" style={{ color: 'rgba(13,31,92,0.42)' }}>
                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        {scorePercent !== null && (
                            <div
                                className="rounded-lg px-3 py-1.5 text-center"
                                style={{ background: scoreBg }}
                            >
                                <div
                                    className="text-[22px] font-bold leading-none"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: scoreColor }}
                                >
                                    {submission.score}
                                </div>
                                <div className="text-[9px] tracking-wide" style={{ color: scoreColor, opacity: 0.7 }}>
                                    / {activity.max_score}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    onStart ? (
                        <Button variant="gold" size="sm" onClick={onStart} className="w-full mt-1">
                            Start Activity
                        </Button>
                    ) : (
                        <Link href={href} className="block mt-1">
                            <Button variant="gold" size="sm" className="w-full">
                                Start Activity
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </article>
    );
}