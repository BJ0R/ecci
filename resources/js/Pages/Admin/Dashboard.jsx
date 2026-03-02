import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import {
    Users, Baby, BookOpen, ClipboardList,
    HeartHandshake, TrendingUp, PlusCircle,
    BookMarked, Megaphone, CheckCircle2, XCircle,
    ChevronRight,
} from 'lucide-react';

/**
 * Admin/Dashboard.jsx
 * All shared sub-components are exported from this file and reused
 * across every other admin page.
 */
export default function AdminDashboard({ stats = {}, recentFamilies = [], recentSubmissions = [] }) {
    const { flash } = usePage().props;

    const statCards = [
        { label: 'Total Families',    value: stats.total_families    ?? 0, icon: Users,          colorClass: 'text-amber-500',   badge: stats.pending_approvals ? `${stats.pending_approvals} pending` : null, badgeStatus: 'pending' },
        { label: 'Total Children',    value: stats.total_children    ?? 0, icon: Baby,            colorClass: 'text-sky-500'    },
        { label: 'Published Lessons', value: stats.total_lessons     ?? 0, icon: BookOpen,        colorClass: 'text-emerald-600' },
        { label: 'Submissions Today', value: stats.submissions_today ?? 0, icon: ClipboardList,   colorClass: 'text-amber-600'  },
        { label: 'Prayer Requests',   value: stats.prayer_requests   ?? 0, icon: HeartHandshake,  colorClass: 'text-rose-500',    badge: stats.prayer_requests > 0 ? 'Needs response' : null, badgeStatus: 'pending' },
    ];

    const quickActions = [
        { href: '/admin/lessons/create', label: 'New Lesson',     icon: BookOpen,       bgClass: 'bg-stone-900 text-amber-50'    },
        { href: '/admin/verses',          label: 'Post Verse',      icon: BookMarked,     bgClass: 'bg-amber-500 text-stone-900'   },
        { href: '/admin/announcements',   label: 'Announcement',    icon: Megaphone,      bgClass: 'bg-emerald-600 text-white'     },
        { href: '/admin/users',           label: 'Manage Families', icon: Users,          bgClass: 'bg-sky-500 text-white'         },
        { href: '/admin/prayer',          label: 'Prayer Requests', icon: HeartHandshake, bgClass: 'bg-rose-500 text-white'        },
    ];

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Dashboard — ECCII Admin" />
            <FlashMessage flash={flash} />

            <PageEyebrow label="Overview" title="Church Dashboard" />

            {/* ── Stat cards ───────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
                {statCards.map((s, i) => (
                    <div key={i} className="rounded-[14px] border border-stone-200 bg-white p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between mb-1">
                            <s.icon size={16} className={`${s.colorClass} opacity-70`} />
                        </div>
                        <div
                            className={`text-[34px] font-bold leading-none ${s.colorClass}`}
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {s.value}
                        </div>
                        <div className="text-[11px] text-stone-400">{s.label}</div>
                        {s.badge && (
                            <div className="mt-1">
                                <Badge status={s.badgeStatus} size="xs">{s.badge}</Badge>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Quick actions ────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2.5 mb-7">
                {quickActions.map((a, i) => (
                    <Link
                        key={i}
                        href={a.href}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold no-underline transition-opacity hover:opacity-80 ${a.bgClass}`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <a.icon size={14} />
                        {a.label}
                    </Link>
                ))}
            </div>

            {/* ── Two-column panels ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">

                {/* Recent families */}
                <Panel
                    title="Recent Families"
                    icon={<Users size={13} className="text-stone-400" />}
                    action={<PanelLink href="/admin/users">View all</PanelLink>}
                >
                    {recentFamilies.length === 0 ? (
                        <EmptyState icon={<Users size={28} />} text="No families registered yet." />
                    ) : recentFamilies.map(f => (
                        <div key={f.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-amber-500 text-stone-900">
                                    {(f.family_name || f.name).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-[13px] font-semibold text-stone-900">
                                        {f.family_name || f.name}
                                    </div>
                                    <div className="text-[11px] text-stone-400">
                                        {f.child_profiles_count} {f.child_profiles_count === 1 ? 'child' : 'children'}
                                    </div>
                                </div>
                            </div>
                            <Badge status={f.is_approved ? 'completed' : 'pending'} size="xs">
                                {f.is_approved ? 'Approved' : 'Pending'}
                            </Badge>
                        </div>
                    ))}
                </Panel>

                {/* Recent submissions */}
                <Panel
                    title="Recent Submissions"
                    icon={<ClipboardList size={13} className="text-stone-400" />}
                    action={<PanelLink href="/admin/progress">View all</PanelLink>}
                >
                    {recentSubmissions.length === 0 ? (
                        <EmptyState icon={<ClipboardList size={28} />} text="No submissions yet." />
                    ) : recentSubmissions.map(s => (
                        <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                            <div>
                                <div className="text-[13px] font-semibold text-stone-900">{s.child?.name ?? '—'}</div>
                                <div className="text-[11px] text-stone-400">{s.activity?.title ?? '—'}</div>
                            </div>
                            <div className="text-right">
                                <div
                                    className="text-[14px] font-bold text-amber-500"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {s.score}/{s.activity?.max_score ?? '?'}
                                </div>
                            </div>
                        </div>
                    ))}
                </Panel>
            </div>
        </AdminLayout>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SHARED EXPORTS — imported by every other admin page
   ═══════════════════════════════════════════════════════════════════════════ */

/** Flash success / error banner */
export function FlashMessage({ flash }) {
    if (!flash?.success && !flash?.error) return null;
    const ok = !!flash.success;
    return (
        <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-[13px] border ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-500'}`}>
            {ok
                ? <CheckCircle2 size={15} className="flex-shrink-0 mt-px" />
                : <XCircle      size={15} className="flex-shrink-0 mt-px" />
            }
            <span>{flash.success || flash.error}</span>
        </div>
    );
}

/** Page eyebrow + H1 */
export function PageEyebrow({ label, title, desc }) {
    return (
        <div className="mb-6">
            <div
                className="flex items-center gap-2 text-[9px] tracking-[0.22em] uppercase mb-1.5 text-amber-500"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
                <span className="w-4 h-px flex-shrink-0 inline-block bg-amber-500" />
                {label}
            </div>
            <h1
                className="text-[28px] font-bold leading-tight m-0 text-stone-900"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                {title}
            </h1>
            {desc && (
                <p className="text-[13px] mt-1 leading-relaxed text-stone-400">
                    {desc}
                </p>
            )}
        </div>
    );
}

/** White card panel with header */
export function Panel({ title, icon, action, children }) {
    return (
        <div className="rounded-[14px] border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                    {icon}
                    <span
                        className="text-[12px] font-bold tracking-[0.02em] text-stone-900"
                    >
                        {title}
                    </span>
                </div>
                {action}
            </div>
            <div className="px-4 md:px-5 py-1">{children}</div>
        </div>
    );
}

/** "View all →" link used in panel headers */
function PanelLink({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium no-underline transition-opacity hover:opacity-70 text-amber-500"
        >
            {children}
            <ChevronRight size={12} />
        </Link>
    );
}

/** Section label (mono uppercase) */
export function SectionLabel({ children }) {
    return (
        <div
            className="text-[9px] tracking-[0.2em] uppercase text-stone-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {children}
        </div>
    );
}

/** Empty state placeholder */
export function EmptyState({ icon, text }) {
    return (
        <div className="flex flex-col items-center py-10 gap-3 text-stone-400">
            <div className="opacity-30">{icon}</div>
            <p className="text-[12px] text-center">{text}</p>
        </div>
    );
}

/** Table thead */
export function TableHeader({ columns }) {
    return (
        <thead>
            <tr>
                {columns.map((col, i) => (
                    <th
                        key={i}
                        className="px-3.5 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap border-b border-stone-200 bg-stone-50 text-stone-400"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

/** Table td */
export function TableCell({ children, mono = false, muted = false }) {
    return (
        <td
            className={`px-3.5 py-2.5 align-middle border-b border-stone-100 ${muted ? 'text-stone-400' : 'text-stone-600'}`}
            style={{
                fontSize:   mono ? '11px' : '13px',
                fontFamily: mono ? "'JetBrains Mono', monospace" : "'Outfit', sans-serif",
            }}
        >
            {children}
        </td>
    );
}

/** Laravel paginator links */
export function Pagination({ links = [] }) {
    if (links.length <= 3) return null;
    return (
        <div className="flex justify-center flex-wrap gap-1 mt-5">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`px-3 py-1.5 rounded-lg text-[12px] border no-underline transition-colors ${link.active ? 'bg-stone-900 text-amber-50 border-stone-900 font-semibold' : 'bg-white text-stone-600 border-stone-200 font-normal'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="px-3 py-1.5 text-[12px] cursor-not-allowed text-stone-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}

/** Form field group with label + optional error/helper */
export function FormGroup({ label, error, children, helper }) {
    return (
        <div className="mb-[18px]">
            <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-stone-400">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-[11px] mt-1 text-rose-500">{error}</p>
            )}
            {!error && helper && (
                <p className="text-[11px] mt-1 text-stone-400">{helper}</p>
            )}
        </div>
    );
}

const fieldBase = "w-full px-3.5 py-2.5 rounded-lg text-[13px] outline-none transition-colors border focus:border-amber-500";

export function FieldInput({ value, onChange, type = 'text', placeholder = '', disabled = false, error }) {
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${fieldBase} text-stone-900 ${disabled ? 'cursor-not-allowed bg-stone-50' : 'bg-white'} ${error ? 'border-rose-500' : 'border-stone-200'}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        />
    );
}

export function FieldTextarea({ value, onChange, rows = 4, placeholder = '', error }) {
    return (
        <textarea
            rows={rows}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`${fieldBase} resize-y leading-relaxed text-stone-900 bg-white ${error ? 'border-rose-500' : 'border-stone-200'}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        />
    );
}

export function FieldSelect({ value, onChange, options = [], placeholder, error }) {
    return (
        <select
            value={value ?? ''}
            onChange={onChange}
            className={`${fieldBase} cursor-pointer appearance-none text-stone-900 bg-white ${error ? 'border-rose-500' : 'border-stone-200'}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}

export function SubmitButton({ processing, children }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="px-7 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-stone-900 text-amber-50"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {processing ? 'Saving…' : children}
        </button>
    );
}

export function DeleteButton({ onClick, label = 'Delete' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-75 bg-rose-50 text-rose-500"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {label}
        </button>
    );
}