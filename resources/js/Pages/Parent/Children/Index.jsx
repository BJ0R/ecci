// resources/js/Pages/Parent/Children/Index.jsx
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus, BookOpen, TrendingUp, Trophy,
    Trash2, CheckCircle2, XCircle, X, Users,
} from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

export default function ChildrenIndex({ children = [] }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const deletingChild = children.find(c => c.id === deletingId);

    function handleDelete() {
        router.delete(`/children/${deletingId}`, { onSuccess: () => setDeletingId(null) });
    }

    return (
        <AppLayout>
            <Head title="My Children — ECCII" />

            {/* ── Flash ───────────────────────────────────────────── */}
            {flash?.success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 text-[13px]"
                    style={{ background: 'var(--sage-pale)', borderColor: '#C2DEC8', color: 'var(--sage)' }}>
                    <CheckCircle2 size={14} /> {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 text-[13px]"
                    style={{ background: 'var(--rose-pale)', borderColor: '#F5C6C6', color: 'var(--rose)' }}>
                    <XCircle size={14} /> {flash.error}
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
                <div>
                    <div className="text-[10px] tracking-[0.16em] uppercase mb-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                        Family
                    </div>
                    <h1 className="text-[28px] font-bold m-0 mb-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                        My Children
                    </h1>
                    <p className="text-[13px] m-0" style={{ color: 'var(--ink-50)' }}>
                        {children.length === 0
                            ? 'No children added yet.'
                            : `${children.length} child profile${children.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link href="/children/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold no-underline flex-shrink-0 transition-opacity hover:opacity-80"
                    style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                    <Plus size={15} />
                    Add Child
                </Link>
            </div>

            {/* ── Empty state ─────────────────────────────────────── */}
            {children.length === 0 && (
                <div className="rounded-[16px] border p-14 text-center"
                    style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                    <Users size={40} className="mx-auto mb-4 opacity-20" />
                    <h3 className="text-[22px] font-bold mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                        Add your first child
                    </h3>
                    <p className="text-[13px] leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: 'var(--ink-50)' }}>
                        Create a profile for each child so you can track their lessons, verses, and progress separately.
                    </p>
                    <Link href="/children/create"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-semibold no-underline"
                        style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                        <Plus size={14} />
                        Add Child Profile
                    </Link>
                </div>
            )}

            {/* ── Children grid ───────────────────────────────────── */}
            {children.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children.map(child => (
                        <ChildCard key={child.id} child={child} onDelete={() => setDeletingId(child.id)} />
                    ))}
                </div>
            )}

            {/* ── Delete confirm modal ─────────────────────────────── */}
            {deletingId && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-5"
                    style={{ background: 'rgba(25,22,18,0.55)' }}
                    onClick={e => { if (e.target === e.currentTarget) setDeletingId(null); }}
                >
                    <div className="rounded-[16px] w-full max-w-[420px] overflow-hidden shadow-2xl"
                        style={{ background: 'var(--white)' }}>
                        <div className="flex items-center justify-between px-6 py-5 border-b"
                            style={{ borderColor: 'var(--border-lt)' }}>
                            <span className="text-[20px] font-bold"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                                Remove Child Profile?
                            </span>
                            <button onClick={() => setDeletingId(null)}
                                className="p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors hover:bg-[var(--cream-2)]"
                                style={{ color: 'var(--ink-50)' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--ink-80)' }}>
                                Are you sure you want to remove <strong>{deletingChild?.name}</strong>?{' '}
                                All of their lesson progress, quiz scores, and badges will be permanently deleted.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t"
                            style={{ borderColor: 'var(--border-lt)' }}>
                            <button onClick={() => setDeletingId(null)}
                                className="px-5 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors hover:bg-[var(--cream-2)]"
                                style={{ background: 'var(--cream)', borderColor: 'var(--border)', color: 'var(--ink)', fontFamily: "'Outfit', sans-serif" }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-80"
                                style={{ background: 'var(--rose)', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

/* ── Child card ──────────────────────────────────────────────────────── */
function ChildCard({ child, onDelete }) {
    const ageGroup = child.age <= 5 ? 'Nursery' : child.age <= 10 ? 'Kids' : 'Youth';
    const color    = child.avatar_color || '#B8923A';
    const ageBadgeColors = { Nursery: { bg: 'var(--amber-pale)', color: 'var(--amber)' }, Kids: { bg: 'var(--sky-pale)', color: 'var(--sky)' }, Youth: { bg: 'var(--sage-pale)', color: 'var(--sage)' } };
    const ageBadge = ageBadgeColors[ageGroup] || ageBadgeColors.Kids;

    return (
        <div className="rounded-[16px] border overflow-hidden transition-shadow hover:shadow-md"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
            {/* Color strip */}
            <div className="h-[5px]" style={{ background: color }} />

            <div className="p-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-[20px] font-bold border-2"
                        style={{ background: color, color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontFamily: "'Cormorant Garamond', serif" }}>
                        {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px] truncate" style={{ color: 'var(--ink)' }}>
                            {child.name}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-50)' }}>
                            Age {child.age}{child.grade ? ` · ${child.grade}` : ` · ${ageGroup}`}
                        </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex-shrink-0"
                        style={{ fontFamily: "'JetBrains Mono', monospace", background: ageBadge.bg, color: ageBadge.color, letterSpacing: '0.06em' }}>
                        {ageGroup}
                    </span>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <StatPill icon={<BookOpen size={13} />} value={child.lesson_progresses_count ?? 0} label="Lessons" />
                    <StatPill icon={<CheckCircle2 size={13} />} value={child.activity_submissions_count ?? 0} label="Quizzes" />
                    <StatPill icon={<Trophy size={13} />} value={child.badges_count ?? 0} label="Badges" />
                </div>

                {/* Quick links */}
                <div className="flex gap-1.5 mb-2.5">
                    <Link href={`/lessons?child_id=${child.id}`}
                        className="flex-1 text-center px-2 py-2 rounded-lg text-[11px] font-semibold no-underline inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
                        style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                        <BookOpen size={11} />
                        Lessons
                    </Link>
                    <Link href={`/progress/${child.id}`}
                        className="flex-1 text-center px-2 py-2 rounded-lg text-[11px] font-semibold no-underline border inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-[var(--cream-2)]"
                        style={{ background: 'var(--cream)', borderColor: 'var(--border)', color: 'var(--ink)', fontFamily: "'Outfit', sans-serif" }}>
                        <TrendingUp size={11} />
                        Progress
                    </Link>
                </div>

                {/* Remove */}
                <button onClick={onDelete}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] border cursor-pointer transition-colors hover:bg-[var(--rose-pale)] hover:border-[#FECACA]"
                    style={{ background: 'none', borderColor: 'var(--border)', color: 'var(--rose)', fontFamily: "'Outfit', sans-serif" }}>
                    <Trash2 size={12} />
                    Remove Profile
                </button>
            </div>
        </div>
    );
}

function StatPill({ icon, value, label }) {
    return (
        <div className="rounded-lg p-2 text-center border"
            style={{ background: 'var(--cream)', borderColor: 'var(--border-lt)' }}>
            <div className="flex justify-center mb-1 opacity-40" style={{ color: 'var(--ink)' }}>{icon}</div>
            <div className="text-[14px] font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink)' }}>
                {value}
            </div>
            <div className="text-[9px]" style={{ color: 'var(--ink-50)' }}>{label}</div>
        </div>
    );
}