import { Trophy, ClipboardCheck, Medal } from 'lucide-react';
import ProgressBar from '@/Components/UI/ProgressBar';
import Badge from '@/Components/UI/Badge';
import BadgeChip from '@/Components/Badges/BadgeChip';

/**
 * ProgressCard.jsx — Tailwind CSS + Lucide icons
 * summary mode: compact stat card for dashboard
 * full mode: detailed card for progress page
 */
export default function ProgressCard({ child, stats = {}, badges = [], mode = 'summary', isActive = false, onClick }) {
    if (!child) return null;

    const {
        lessons_completed = 0,
        lessons_total     = 0,
        quizzes_done      = 0,
        badges_earned     = 0,
    } = stats;

    const completionPct = lessons_total > 0 ? Math.round((lessons_completed / lessons_total) * 100) : 0;
    const ageGroup      = child.age <= 5 ? 'Nursery' : child.age <= 10 ? 'Kids' : 'Youth';

    /* ── SUMMARY MODE ────────────────────────────────────────────────────── */
    if (mode === 'summary') {
        return (
            <div
                onClick={onClick}
                className={`
                    rounded-[14px] p-4 border transition-shadow duration-200
                    ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
                `}
                style={{
                    background:  'var(--white)',
                    borderColor: isActive ? 'var(--gold)' : 'var(--border)',
                    borderWidth:  isActive ? '1.5px' : '1px',
                }}
            >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                            style={{ background: child.avatar_color || 'var(--gold)', color: 'var(--ink)' }}
                        >
                            {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>{child.name}</div>
                            <div className="text-[10px]" style={{ color: 'var(--ink-50)' }}>Age {child.age} · {ageGroup}</div>
                        </div>
                    </div>
                    {isActive && <Badge status="gold" size="xs">Active</Badge>}
                </div>

                <ProgressBar value={completionPct} label="Lessons" color="sage" />

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <StatMini num={quizzes_done}  label="Quizzes" icon={<ClipboardCheck size={12} />} color="var(--sky)"  />
                    <StatMini num={badges_earned} label="Badges"  icon={<Trophy size={12} />}          color="var(--gold)" />
                </div>
            </div>
        );
    }

    /* ── FULL MODE ───────────────────────────────────────────────────────── */
    return (
        <div
            className="rounded-[16px] border overflow-hidden"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
        >
            {/* Header */}
            <div
                className="px-5 md:px-6 py-5 flex items-center gap-3.5"
                style={{ background: 'var(--ink)' }}
            >
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{ background: child.avatar_color || 'var(--gold)', color: 'var(--ink)' }}
                >
                    {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div
                        className="text-[22px] font-bold leading-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream)' }}
                    >
                        {child.name}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(250,247,242,0.45)' }}>
                        Age {child.age} · {ageGroup}
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div
                        className="text-[32px] font-bold leading-none"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: completionPct >= 80 ? 'var(--gold-lt)' : 'var(--cream)',
                        }}
                    >
                        {completionPct}%
                    </div>
                    <div className="text-[10px]" style={{ color: 'rgba(250,247,242,0.4)' }}>complete</div>
                </div>
            </div>

            {/* Stats body */}
            <div className="px-5 md:px-6 py-5">
                <ProgressBar
                    value={completionPct}
                    label={`${lessons_completed} of ${lessons_total} lessons completed`}
                    color="sage"
                    height={8}
                    className="mb-5"
                />

                <div className="grid grid-cols-3 gap-3 mb-5">
                    <StatFull num={lessons_completed} label="Lessons Done"  color="var(--sage)"  icon={<Medal size={14} />} />
                    <StatFull num={quizzes_done}       label="Quizzes Done" color="var(--sky)"   icon={<ClipboardCheck size={14} />} />
                    <StatFull num={badges_earned}      label="Badges"       color="var(--gold)"  icon={<Trophy size={14} />} />
                </div>

                {badges.length > 0 && (
                    <div>
                        <div
                            className="text-[9px] tracking-[0.2em] uppercase mb-2.5"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}
                        >
                            Earned Badges
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {badges.map(badge => (
                                <BadgeChip key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatMini({ num, label, color, icon }) {
    return (
        <div className="rounded-lg px-2.5 py-2" style={{ background: 'var(--cream)' }}>
            <div className="flex items-center gap-1 mb-0.5" style={{ color }}>
                {icon}
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
                    {num}
                </span>
            </div>
            <div className="text-[10px]" style={{ color: 'var(--ink-50)' }}>{label}</div>
        </div>
    );
}

function StatFull({ num, label, color, icon }) {
    return (
        <div className="rounded-[10px] p-3.5 text-center" style={{ background: 'var(--cream)' }}>
            <div className="flex items-center justify-center gap-1 mb-1" style={{ color }}>
                {icon}
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>
                    {num}
                </span>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--ink-50)' }}>{label}</div>
        </div>
    );
}