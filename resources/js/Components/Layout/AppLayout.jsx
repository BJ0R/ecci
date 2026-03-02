import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    BookMarked,
    Users,
    HeartHandshake,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import ChildProfileSwitcher from '@/Components/Sidebar/ChildProfileSwitcher';

/**
 * AppLayout.jsx — Parent-facing authenticated shell
 * Tailwind CSS + Lucide icons, fully responsive.
 *
 * Shared props: auth.user, children[], activeChild
 */
export default function AppLayout({ children, title }) {
    const { auth, children: sharedChildren = [], activeChild: sharedActiveChild } = usePage().props;
    const user   = auth?.user;
    const kids   = sharedChildren;
    const active = sharedActiveChild;

    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive    = (path) => currentPath.startsWith(path);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    })();

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
        <div className="flex min-h-screen bg-amber-50" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                />
            )}

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 z-50 flex flex-col
                    w-[230px] pt-6 bg-stone-900
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Close button (mobile) */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 md:hidden transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Logo */}
                <div className="px-[22px] pb-[22px] mb-4 border-b border-white/[0.06]">
                    <div
                        className="text-[22px] font-bold tracking-[-0.01em] text-amber-50"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        ECC<em className="italic text-amber-400">II</em>
                    </div>
                    <div className="mt-0.5 text-[10px] tracking-wide text-white/35">
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
                <div className="border-t border-white/[0.06]">
                    <SidebarLabel>Account</SidebarLabel>
                    <SidebarLink href="/profile" icon={Settings} active={isActive('/profile')}>
                        Settings
                    </SidebarLink>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2.5 w-full px-[22px] py-[9px] text-[13px] border-l-2 border-transparent text-left transition-colors duration-150 hover:bg-white/5 text-white/40"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <LogOut size={15} className="flex-shrink-0 opacity-70" />
                        Sign Out
                    </Link>
                </div>

                {/* Child profile switcher */}
                <ChildProfileSwitcher children={kids} activeChildId={active?.id} />
            </aside>

            {/* ── Main area ─────────────────────────────────────────── */}
            <div className="md:ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">

                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-7 h-[60px] border-b border-stone-100 bg-amber-50/90 backdrop-blur-md">

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="p-2 rounded-lg mr-3 md:hidden transition-colors hover:bg-black/5 text-stone-900"
                    >
                        <Menu size={20} />
                    </button>

                    <div
                        className="text-xl font-bold truncate text-stone-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {title || `${greeting}, ${displayName}`}
                    </div>

                    {/* User pill */}
                    <div className="flex items-center gap-2 pl-2 pr-4 rounded-full border border-stone-200 bg-white text-xs font-medium ml-4 flex-shrink-0">
                        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-amber-500 text-stone-900">
                            {initials}
                        </div>
                        <span className="hidden sm:inline text-stone-900">{user?.name || 'Parent'}</span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-7 bg-amber-50">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SidebarLabel({ children, className = '' }) {
    return (
        <div
            className={`px-[22px] pt-3 pb-1 text-[8px] tracking-[0.22em] uppercase text-white/25 ${className}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {children}
        </div>
    );
}

function SidebarLink({ href, icon: Icon, children, active }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-2.5 px-[22px] py-[9px] text-[13px] my-px
                border-l-2 transition-all duration-150 no-underline w-full text-left
                ${active
                    ? 'font-semibold border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'font-normal border-transparent text-white/55 hover:bg-white/5 hover:text-white/90 hover:border-amber-500/40'
                }
            `}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <Icon size={15} className="flex-shrink-0 opacity-80" />
            {children}
        </Link>
    );
}