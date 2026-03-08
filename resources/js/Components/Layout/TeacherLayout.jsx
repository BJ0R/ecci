// resources/js/Components/Layout/TeacherLayout.jsx
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, BookOpen, BrainCircuit,
    BookMarked, TrendingUp, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

const NAV = [
    { href: '/teacher/dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
    { href: '/teacher/lessons',    label: 'Lessons',       icon: BookOpen        },
    { href: '/teacher/activities', label: 'Activities',    icon: BrainCircuit    },
    { href: '/teacher/verses',     label: 'Memory Verses', icon: BookMarked      },
    { href: '/teacher/progress',   label: 'Progress',      icon: TrendingUp      },
];

export default function TeacherLayout({ title, children }) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    const user     = auth?.user;
    const initials = (user?.name ?? 'T').charAt(0).toUpperCase();

    return (
        <div className="flex min-h-screen" style={{ fontFamily: "'Outfit', sans-serif", backgroundColor: '#eef2fc' }}>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ background: 'rgba(10,20,70,0.55)', backdropFilter: 'blur(4px)' }}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside
                style={{
                    background: 'linear-gradient(175deg, #101e5a 0%, #0a1540 55%, #080f30 100%)',
                    boxShadow: '4px 0 28px rgba(10,20,80,0.40)',
                }}
                className={`
                    fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[230px] pt-6
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg md:hidden"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                    <X size={16} />
                </button>

                {/* ── Logo block ── */}
                <div
                    className="px-5 pb-5 mb-3 flex flex-col items-center"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <div
                        className="w-[76px] h-[76px] rounded-full overflow-hidden mb-3"
                        style={{
                            boxShadow: '0 4px 18px rgba(0,0,0,0.5), 0 0 0 2px rgba(232,160,32,0.35)',
                            background: 'rgba(255,255,255,0.05)',
                        }}
                    >
                        <img
                            src="/ECCSII.jpg"
                            alt="ECCII Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="text-[17px] font-bold tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f5f0e8' }}
                    >
                        ECC<em className="not-italic" style={{ color: '#e8a020' }}>II</em>
                    </div>

                    <div
                        className="mt-0.5 text-[10px] tracking-wide text-center"
                        style={{ color: 'rgba(255,255,255,0.30)', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        Teacher Portal
                    </div>
                </div>

                {/* ── Nav ── */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarLabel>Manage</SidebarLabel>
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = path === href || (href !== '/teacher/dashboard' && path.startsWith(href));
                        return (
                            <SidebarLink key={href} href={href} icon={Icon} active={active}>
                                {label}
                            </SidebarLink>
                        );
                    })}
                </div>

                {/* ── User footer ── */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <SidebarLabel>Account</SidebarLabel>

                    {/* Name pill */}
                    <div className="flex items-center gap-2.5 px-[22px] py-[9px]">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                            style={{ background: '#e8a020', color: '#0d1f5c' }}
                        >
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div
                                className="text-[12px] font-semibold truncate"
                                style={{ color: 'rgba(255,255,255,0.85)' }}
                            >
                                {user?.name ?? 'Teacher'}
                            </div>
                            <div
                                className="text-[9px]"
                                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.30)' }}
                            >
                                teacher
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2.5 w-full px-[22px] py-[9px] text-[13px] border-l-2 border-transparent text-left mb-3"
                        style={{ fontFamily: "'Outfit', sans-serif", color: 'rgba(255,255,255,0.32)', background: 'none' }}
                    >
                        <LogOut size={15} style={{ opacity: 0.6 }} />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* ── Main area ───────────────────────────────────────────────── */}
            <div className="md:ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">

                {/* Topbar */}
                <header
                    className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-7 h-[60px]"
                    style={{
                        background: 'rgba(238,242,252,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(13,31,92,0.09)',
                        boxShadow: '0 1px 10px rgba(13,31,92,0.07)',
                    }}
                >
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="p-2 rounded-lg mr-3 md:hidden"
                        style={{ color: '#0d1f5c' }}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumb */}
                    {title && (
                        <div
                            className="hidden md:flex items-center gap-1.5 text-[11px]"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(13,31,92,0.35)' }}
                        >
                            Teacher Portal
                            <ChevronRight size={11} />
                            <span style={{ color: '#0d1f5c', fontWeight: 600 }}>{title}</span>
                        </div>
                    )}

                    <div className="flex-1" />

                    {/* Greeting */}
                    <span
                        className="hidden md:inline text-sm mr-4"
                        style={{ color: 'rgba(13,31,92,0.45)', fontFamily: "'Outfit', sans-serif" }}
                    >
                        Welcome, {user?.name ?? 'Teacher'}
                    </span>

                    {/* User pill */}
                    <div
                        className="flex items-center gap-2 pl-1.5 pr-4 rounded-full text-xs font-medium"
                        style={{
                            background: '#fff',
                            border: '1px solid rgba(13,31,92,0.12)',
                            color: '#0d1f5c',
                            boxShadow: '0 1px 6px rgba(13,31,92,0.10)',
                        }}
                    >
                        <div
                            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold my-1"
                            style={{ background: '#e8a020', color: '#0d1f5c' }}
                        >
                            {initials}
                        </div>
                        <span className="hidden sm:inline">{user?.name ?? 'Teacher'}</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-7" style={{ backgroundColor: '#eef2fc' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLabel({ children }) {
    return (
        <div
            className="px-[22px] pt-4 pb-1 text-[8px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.22)' }}
        >
            {children}
        </div>
    );
}

function SidebarLink({ href, icon: Icon, children, active }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2.5 px-[22px] py-[9px] text-[13px] my-px border-l-2 transition-all duration-150 no-underline w-full"
            style={{
                fontFamily: "'Outfit', sans-serif",
                borderLeftColor: active ? '#e8a020' : 'transparent',
                background:      active ? 'rgba(232,160,32,0.09)' : 'transparent',
                color:           active ? '#e8c060' : 'rgba(255,255,255,0.50)',
                fontWeight:      active ? '600' : '400',
            }}
        >
            <Icon size={15} style={{ flexShrink: 0, opacity: active ? 0.95 : 0.65 }} />
            {children}
        </Link>
    );
}