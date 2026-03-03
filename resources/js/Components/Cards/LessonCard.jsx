import { Link } from '@inertiajs/react';
import { Layers, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import ProgressBar from '@/Components/UI/ProgressBar';

/**
 * LessonCard.jsx — ECCII logo palette
 * Navy gradient header · ice-blue body · gold accent strip
 * Hierarchy: week/series (mono XS) → title (serif LG) → verse (serif italic) → footer meta
 */
export default function LessonCard({ lesson, progress, childId, showProgress = false, onClick }) {
    const prog   = progress || lesson.progress;
    const status = prog?.status || null;

    const statusConfig = {
        completed: { label: 'Done',        badgeStatus: 'completed', Icon: CheckCircle2 },
        viewed:    { label: 'In Progress', badgeStatus: 'viewed',    Icon: Eye          },
    };
    const sc = statusConfig[status] || { label: 'New', badgeStatus: 'new', Icon: Sparkles };

    const ageGroupLabels = { nursery: 'Nursery', kids: 'Kids', youth: 'Youth' };
    const href = childId ? `/lessons/${lesson.id}?child_id=${childId}` : `/lessons/${lesson.id}`;

    const card = (
        <article
            className="group flex flex-col rounded-[14px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
                background:  '#ffffff',
                border:      '1px solid rgba(13,31,92,0.10)',
                boxShadow:   'var(--shadow-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
        >
            {/* ── Navy gradient header — primary visual weight ── */}
            <div
                className="px-4 pt-4 pb-3.5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d1f5c 0%, #162a7a 100%)' }}
            >
                {/* Subtle texture dot */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '14px 14px' }}
                />

                {/* Week / series — mono micro label */}
                <div
                    className="flex items-center gap-2 text-[9px] tracking-[0.20em] uppercase mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e8a020' }}
                >
                    <span className="inline-block w-3 h-px" style={{ background: 'rgba(232,160,32,0.50)' }} />
                    Week {lesson.week_number}{lesson.series ? ` · ${lesson.series}` : ''}
                </div>

                {/* Title — serif, largest weight on card */}
                <h3
                    className="text-[18px] font-bold leading-snug m-0"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0f4fc', letterSpacing: '-0.01em' }}
                >
                    {lesson.title}
                </h3>
            </div>

            {/* ── Body ── */}
            <div className="px-4 py-3.5 flex-1">
                {lesson.content?.bible_reference && (
                    <p
                        className="text-[10px] tracking-[0.12em] uppercase font-bold mb-1.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: '#b87010' }}
                    >
                        {lesson.content.bible_reference}
                    </p>
                )}

                {lesson.content?.bible_text && (
                    <p
                        className="text-[13px] italic leading-relaxed mb-2.5 line-clamp-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(13,31,92,0.68)' }}
                    >
                        "{lesson.content.bible_text}"
                    </p>
                )}

                {showProgress && prog && (
                    <ProgressBar
                        value={status === 'completed' ? 100 : status === 'viewed' ? 50 : 0}
                        label="Progress"
                        color="sage"
                    />
                )}
            </div>

            {/* ── Footer — lightest visual weight ── */}
            <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(13,31,92,0.06)', background: '#f0f4fc' }}
            >
                <div className="flex items-center gap-1.5">
                    <Badge status={lesson.age_group || 'kids'} size="xs">
                        {ageGroupLabels[lesson.age_group] || lesson.age_group}
                    </Badge>
                    {lesson.activities_count > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'rgba(13,31,92,0.38)' }}>
                            <Layers size={10} />
                            {lesson.activities_count}
                        </span>
                    )}
                </div>
                <Badge status={sc.badgeStatus} size="xs">
                    <sc.Icon size={9} className="mr-0.5" />
                    {sc.label}
                </Badge>
            </div>
        </article>
    );

    if (onClick) return <div onClick={onClick}>{card}</div>;
    return <Link href={href} className="block no-underline">{card}</Link>;
}