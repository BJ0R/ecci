import { Link } from '@inertiajs/react';
import { BookOpen, Layers, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import ProgressBar from '@/Components/UI/ProgressBar';

/**
 * LessonCard.jsx — Tailwind CSS + Lucide icons
 * Dark ink header, cream body, responsive grid-friendly card.
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
    const ageGroupLabel  = ageGroupLabels[lesson.age_group] || lesson.age_group;

    const href = childId ? `/lessons/${lesson.id}?child_id=${childId}` : `/lessons/${lesson.id}`;

    const card = (
        <div
            className="group flex flex-col rounded-[14px] border overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
                background:   'var(--cream)',
                borderColor:  'var(--border)',
                boxShadow:    'var(--shadow-sm)',
            }}
        >
            {/* Dark header */}
            <div className="px-4 pt-3.5 pb-3" style={{ background: 'var(--ink)' }}>
                <div
                    className="text-[9px] tracking-[0.15em] uppercase mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold-lt)' }}
                >
                    Week {lesson.week_number} · {lesson.series}
                </div>
                <div
                    className="text-[17px] font-bold leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream)' }}
                >
                    {lesson.title}
                </div>
            </div>

            {/* Body */}
            <div className="px-4 py-3.5 flex-1">
                {lesson.content?.bible_reference && (
                    <div
                        className="text-[10px] tracking-[0.1em] uppercase mb-1.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}
                    >
                        {lesson.content.bible_reference}
                    </div>
                )}

                {lesson.content?.bible_text && (
                    <p
                        className="text-[13px] italic leading-relaxed mb-2.5 line-clamp-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink-80)' }}
                    >
                        {lesson.content.bible_text}
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

            {/* Footer */}
            <div
                className="px-4 py-2.5 flex items-center justify-between text-[11px] border-t"
                style={{ borderColor: 'var(--border-lt)', color: 'var(--ink-50)' }}
            >
                <div className="flex items-center gap-1.5">
                    <Badge status={lesson.age_group || 'kids'} size="xs">{ageGroupLabel}</Badge>
                    {lesson.activities_count > 0 && (
                        <span className="flex items-center gap-1">
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
        </div>
    );

    if (onClick) return <div onClick={onClick}>{card}</div>;
    return <Link href={href} className="block no-underline">{card}</Link>;
}