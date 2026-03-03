import { Trophy, ClipboardCheck, Medal } from 'lucide-react';
import ProgressBar from '@/Components/UI/ProgressBar';
import Badge from '@/Components/UI/Badge';
import BadgeChip from '@/Components/Badges/BadgeChip';

/**
 * ProgressCard.jsx — ECCII logo palette
 * summary: compact dashboard tile | full: detailed progress view
 * Hierarchy: avatar+name → completion% → stats grid → badges
 */
export default function ProgressCard({ child, stats = {}, badges = [], mode = 'summary', isActive = false, onClick }) {
    if (!child) return null;

    const { lessons_completed = 0, lessons_total = 0, quizzes_done = 0, badges_earned = 0 } = stats;
    const completionPct = lessons_total > 0 ? Math.round((lessons_completed / lessons_total) * 100) : 0;
    const ageGroup = child.age <= 5 ? 'Nursery' : child.age <= 10 ? 'Kids' : 'Youth';

    /* ── SUMMARY MODE ── */
    if (mode === 'summary') {
        return (
            <div
                onClick={onClick}
                className={`rounded-[14px] p-4 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
                style={{
                    background:  '#ffffff',
                    border:      `${isActive ? '2px' : '1px'} solid ${isActive ? '#e8a020' : 'rgba(13,31,92,0.10)'}`,
                    boxShadow:   isActive
                        ? '0 4px 20px rgba(232,160,32,0.18), var(--shadow-sm)'
                        : 'var(--shadow-sm)',
                }}
                onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = isActive ? '0 4px 20px rgba(232,160,32,0.18), var(--shadow-sm)' : 'var(--shadow-sm)'; }}
            >
                {/* Header: avatar + name + age */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 shadow-sm"
                            style={{ background: child.avatar_color || '#e8a020', color: '#0d1f5c' }}
                        >
                            {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[14px] font-bold leading-tight" style={{ color: '#0d1f5c' }}>
                                {child.name}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(13,31,92,0.45)' }}>
                                Age {child.age} · {ageGroup}
                            </p>
                        </div>
                    </div>
                    {isActive && <Badge status="gold" size="xs">Active</Badge>}
                </div>

                <ProgressBar value={completionPct} label="Lessons" color="sage" />

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <StatMini num={quizzes_done}  label="Quizzes" icon={<ClipboardCheck size={12} />} color="var(--sky)"  bg="#dbeaf8" />
                    <StatMini num={badges_earned} label="Badges"  icon={<Trophy size={12} />}          color="#b87010"    bg="#fdefd4" />
                </div>
            </div>
        );
    }

    /* ── FULL MODE ── */
    return (
        <div
            className="rounded-[16px] overflow-hidden"
            style={{
                background:  '#ffffff',
                border:      '1px solid rgba(13,31,92,0.10)',
                boxShadow:   'var(--shadow-md)',
            }}
        >
            {/* Navy header — top hierarchy */}
            <div
                className="px-5 md:px-6 py-5 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #0d1f5c 0%, #162a7a 100%)' }}
            >
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ background: child.avatar_color || '#e8a020', color: '#0d1f5c', boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}
                >
                    {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h2
                        className="text-[24px] font-bold leading-tight m-0"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0f4fc' }}
                    >
                        {child.name}
                    </h2>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(240,244,252,0.45)' }}>
                        Age {child.age} · {ageGroup}
                    </p>
                </div>
                {/* Completion % — strong visual anchor */}
                <div className="text-right flex-shrink-0">
                    <div
                        className="text-[36px] font-bold leading-none"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: completionPct >= 80 ? '#f2bc50' : '#f0f4fc',
                        }}
                    >
                        {completionPct}%
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(240,244,252,0.38)' }}>complete</p>
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
                    <StatFull num={lessons_completed} label="Lessons Done"  color="#145c32" bg="#ddf0e4" icon={<Medal size={15} />} />
                    <StatFull num={quizzes_done}       label="Quizzes Done" color="#154e78" bg="#dbeaf8" icon={<ClipboardCheck size={15} />} />
                    <StatFull num={badges_earned}      label="Badges"       color="#7a4800" bg="#fdefd4" icon={<Trophy size={15} />} />
                </div>

                {badges.length > 0 && (
                    <div>
                        <p
                            className="text-[9px] tracking-[0.22em] uppercase mb-3"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(13,31,92,0.40)' }}
                        >
                            Earned Badges
                        </p>
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

function StatMini({ num, label, color, bg, icon }) {
    return (
        <div className="rounded-lg px-3 py-2.5" style={{ background: bg || '#f0f4fc' }}>
            <div className="flex items-center gap-1.5 mb-0.5" style={{ color }}>
                {icon}
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
                    {num}
                </span>
            </div>
            <p className="text-[10px] font-medium" style={{ color: 'rgba(13,31,92,0.45)' }}>{label}</p>
        </div>
    );
}

function StatFull({ num, label, color, bg, icon }) {
    return (
        <div className="rounded-[10px] p-3.5 text-center" style={{ background: bg || '#f0f4fc' }}>
            <div className="flex items-center justify-center gap-1.5 mb-1.5" style={{ color }}>
                {icon}
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 700, lineHeight: 1 }}>
                    {num}
                </span>
            </div>
            <p className="text-[11px] font-medium" style={{ color: 'rgba(13,31,92,0.48)' }}>{label}</p>
        </div>
    );
}