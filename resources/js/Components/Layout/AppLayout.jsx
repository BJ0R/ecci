import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, BookOpen, BookMarked,
    Users, HeartHandshake, Settings, LogOut, Menu, X,
} from 'lucide-react';
import ChildProfileSwitcher from '@/Components/Sidebar/ChildProfileSwitcher';

/**
 * AppLayout.jsx — Parent-facing authenticated shell
 * Same logo-derived palette as AdminLayout.
 */
export default function AppLayout({ children }) {
    const { auth, children: sharedChildren = [], activeChild: sharedActiveChild } = usePage().props;
    const user   = auth?.user;
    const kids   = sharedChildren;
    const active = sharedActiveChild;

    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive    = (path) => currentPath.startsWith(path);

    const displayName = user?.family_name || user?.name || 'Family';
    const initials    = (user?.name || 'U').charAt(0).toUpperCase();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'    },
        { href: '/lessons',   icon: BookOpen,        label: 'Lessons'      },
        { href: '/verses',    icon: BookMarked,      label: 'Memory Verse' },
        { href: '/children',  icon: Users,           label: 'My Children'  },
        { href: '/prayer',    icon: HeartHandshake,  label: 'Prayer'       },
    ];

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

            {/* ── Sidebar ── */}
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

                {/* ── Logo block — appears ONCE ── */}
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
                            alt="ECCSII Logo"
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
                        style={{ color: 'rgba(255,255,255,0.30)' }}
                    >
                        Home Learning Platform
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarLabel>Learn</SidebarLabel>
                    {navItems.map(item => (
                        <SidebarLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)}>
                            {item.label}
                        </SidebarLink>
                    ))}
                </div>

                {/* Account */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <SidebarLabel>Account</SidebarLabel>
                    <SidebarLink href="/profile" icon={Settings} active={isActive('/profile')}>
                        Settings
                    </SidebarLink>
                    <Link
                        href="/logout" method="post" as="button"
                        className="flex items-center gap-2.5 w-full px-[22px] py-[9px] text-[13px] border-l-2 border-transparent text-left"
                        style={{ fontFamily: "'Outfit', sans-serif", color: 'rgba(255,255,255,0.32)' }}
                    >
                        <LogOut size={15} style={{ opacity: 0.6 }} />
                        Sign Out
                    </Link>
                </div>

                {/* Child profile switcher */}
                <ChildProfileSwitcher children={kids} activeChildId={active?.id} />
            </aside>

            {/* ── Main area ── */}
            <div className="md:ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">

                {/* Topbar — no page title */}
                <header
                    className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-7 h-[60px]"
                    style={{
                        background: 'rgba(238,242,252,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(13,31,92,0.09)',
                        boxShadow: '0 1px 10px rgba(13,31,92,0.07)',
                    }}
                >
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="p-2 rounded-lg mr-3 md:hidden"
                        style={{ color: '#0d1f5c' }}
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1" />

                    {/* Greeting — subtle, not a title */}
                    <span
                        className="hidden md:inline text-sm mr-4"
                        style={{ color: 'rgba(13,31,92,0.45)', fontFamily: "'Outfit', sans-serif" }}
                    >
                        Welcome, {displayName}
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
                        <span className="hidden sm:inline">{user?.name || 'Parent'}</span>
                    </div>
                </header>

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