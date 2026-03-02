import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    BookMarked,
    Megaphone,
    Users2,
    TrendingUp,
    MessageSquareHeart,
    Award,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
} from 'lucide-react';

/**
 * AdminLayout.jsx — Pastor / Admin authenticated shell
 * Tailwind CSS + Lucide icons, fully responsive.
 */
export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Exact match for /admin and /admin/dashboard; prefix match for everything else
    const isActive = (href) => {
        if (href === '/admin' || href === '/admin/dashboard') {
            return currentPath === '/admin' || currentPath === '/admin/dashboard';
        }
        return currentPath.startsWith(href);
    };

    const navGroups = [
        {
            label: 'Content',
            items: [
                // FIX: was '/admin' — changed to '/admin/dashboard' to match the route
                { href: '/admin/dashboard',      icon: LayoutDashboard,     label: 'Dashboard'      },
                { href: '/admin/lessons',         icon: BookOpen,            label: 'Lessons'        },
                { href: '/admin/activities',      icon: ClipboardList,       label: 'Activities'     },
                { href: '/admin/verses',          icon: BookMarked,          label: 'Memory Verses'  },
                { href: '/admin/announcements',   icon: Megaphone,           label: 'Announcements'  },
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
        <div className="flex min-h-screen bg-amber-50" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                />
            )}

            {/* ── Sidebar ────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[230px] pt-6
                    bg-stone-900
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 md:hidden transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Logo + Admin badge */}
                <div className="px-[22px] pb-[22px] mb-4 border-b border-white/[0.06]">
                    <div
                        className="text-[22px] font-bold tracking-[-0.01em] text-amber-50"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        ECC<em className="italic text-amber-400">II</em>
                    </div>
                    <div className="mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-amber-500 text-stone-900">
                            <ShieldCheck size={10} />
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
                                <SidebarLink
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    active={isActive(item.href)}
                                >
                                    {item.label}
                                </SidebarLink>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Account at bottom */}
                <div className="border-t border-white/[0.06]">
                    <SidebarLabel>Account</SidebarLabel>
                    <SidebarLink href="/profile" icon={Settings} active={currentPath.startsWith('/profile')}>
                        Settings
                    </SidebarLink>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2.5 w-full px-[22px] py-[9px] mb-5 text-[13px] border-l-2 border-transparent text-left transition-colors hover:bg-white/5 text-white/40"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <LogOut size={15} className="opacity-70" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* ── Main area ──────────────────────────────────────────── */}
            <div className="md:ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">

                {/* Topbar */}
                <header
                    className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-7 h-[60px] border-b border-stone-100 bg-amber-50/90 backdrop-blur-md"
                >
                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="p-2 rounded-lg mr-3 md:hidden hover:bg-black/5 transition-colors text-stone-900"
                    >
                        <Menu size={20} />
                    </button>

                    <div
                        className="text-xl font-bold text-stone-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {title || 'Admin Panel'}
                    </div>

                    {/* Admin user pill */}
                    <div className="flex items-center gap-2 pl-2 pr-4 rounded-full text-xs font-medium ml-4 flex-shrink-0 bg-stone-900 text-amber-50">
                        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold bg-amber-500 text-stone-900">
                            {initials}
                        </div>
                        <span className="hidden sm:inline">{user?.name || 'Admin'}</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-7 bg-amber-50">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SidebarLabel({ children }) {
    return (
        <div
            className="px-[22px] pt-3 pb-1 text-[8px] tracking-[0.22em] uppercase text-white/25"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {children}
        </div>
    );
}

function SidebarLink({ href, icon: Icon, active, children }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-2.5 px-[22px] py-[9px] text-[13px] my-px
                border-l-2 transition-all duration-150 no-underline
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