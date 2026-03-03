import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, BookOpen, ClipboardList, BookMarked,
    Megaphone, Users2, TrendingUp, MessageSquareHeart,
    Settings, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react';

/**
 * AdminLayout.jsx — Color scheme from ECCSII logo
 *   • Deep royal blue  #0d1f5c  (globe)
 *   • Crimson red      #c0201e  (cross → admin badge)
 *   • Gold / amber     #e8a020  (flame → active states)
 *   • Ice blue         #eef2fc  (page surface)
 */
export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (href) => {
        if (href === '/admin' || href === '/admin/dashboard')
            return currentPath === '/admin' || currentPath === '/admin/dashboard';
        return currentPath.startsWith(href);
    };

    const navGroups = [
        {
            label: 'Content',
            items: [
                { href: '/admin/dashboard',    icon: LayoutDashboard,     label: 'Dashboard'      },
                { href: '/admin/lessons',       icon: BookOpen,            label: 'Lessons'        },
                { href: '/admin/activities',    icon: ClipboardList,       label: 'Activities'     },
                { href: '/admin/verses',        icon: BookMarked,          label: 'Memory Verses'  },
                { href: '/admin/announcements', icon: Megaphone,           label: 'Announcements'  },
            ],
        },
        {
            label: 'People',
            items: [
                { href: '/admin/users',    icon: Users2,             label: 'Families'        },
                { href: '/admin/progress', icon: TrendingUp,         label: 'Progress View'   },
                { href: '/admin/prayer',   icon: MessageSquareHeart, label: 'Prayer Requests' },
            ],
        },
    ];

    const initials = (user?.name || 'A').charAt(0).toUpperCase();

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

                    <div className="mt-2">
                        <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase"
                            style={{ background: '#c0201e', color: '#fff' }}
                        >
                            <ShieldCheck size={9} />
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav groups */}
                <div className="flex-1 overflow-y-auto">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <SidebarLabel>{group.label}</SidebarLabel>
                            {group.items.map(item => (
                                <SidebarLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)}>
                                    {item.label}
                                </SidebarLink>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Account */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <SidebarLabel>Account</SidebarLabel>
                    <SidebarLink href="/profile" icon={Settings} active={currentPath.startsWith('/profile')}>
                        Settings
                    </SidebarLink>
                    <Link
                        href="/logout" method="post" as="button"
                        className="flex items-center gap-2.5 w-full px-[22px] py-[9px] mb-5 text-[13px] border-l-2 border-transparent text-left"
                        style={{ fontFamily: "'Outfit', sans-serif", color: 'rgba(255,255,255,0.32)' }}
                    >
                        <LogOut size={15} style={{ opacity: 0.6 }} />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className="md:ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">

                {/* Topbar — no page title shown */}
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

                    {/* User pill */}
                    <div
                        className="flex items-center gap-2 pl-1.5 pr-4 rounded-full text-xs font-medium"
                        style={{
                            background: 'linear-gradient(135deg, #101e5a, #1a3380)',
                            color: '#f5f0e8',
                            boxShadow: '0 2px 10px rgba(13,31,92,0.28)',
                        }}
                    >
                        <div
                            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold my-1"
                            style={{ background: '#e8a020', color: '#0d1f5c' }}
                        >
                            {initials}
                        </div>
                        <span className="hidden sm:inline">{user?.name || 'Admin'}</span>
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

function SidebarLink({ href, icon: Icon, active, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2.5 px-[22px] py-[9px] text-[13px] my-px border-l-2 transition-all duration-150 no-underline"
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