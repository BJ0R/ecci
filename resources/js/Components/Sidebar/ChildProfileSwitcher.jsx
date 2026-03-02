import { router } from '@inertiajs/react';
import { Users } from 'lucide-react';

/**
 * ChildProfileSwitcher.jsx — Sidebar bottom chip selector
 * "Who's learning now?" — Tailwind CSS + Lucide icons.
 */
export default function ChildProfileSwitcher({ children = [], activeChildId, onSwitch }) {
    if (!children.length) return null;

    function handleSwitch(childId) {
        if (onSwitch) {
            onSwitch(childId);
        } else {
            const url = new URL(window.location.href);
            url.searchParams.set('child_id', childId);
            router.visit(url.pathname + url.search, { preserveScroll: true });
        }
    }

    const activeChild = children.find(c => c.id === activeChildId);
    const ageGroup = activeChild
        ? activeChild.age <= 5 ? 'Nursery' : activeChild.age <= 10 ? 'Kids' : 'Youth'
        : null;

    return (
        <div
            className="mt-auto px-4 pt-3.5 pb-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-2.5">
                <Users size={9} style={{ color: 'rgba(250,247,242,0.3)' }} />
                <p
                    className="text-[8px] tracking-[0.22em] uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(250,247,242,0.3)' }}
                >
                    Who's Learning
                </p>
            </div>

            {/* Chip grid */}
            <div className="flex flex-wrap gap-1.5">
                {children.map(child => {
                    const isActive = child.id === activeChildId;
                    return (
                        <button
                            key={child.id}
                            onClick={() => handleSwitch(child.id)}
                            title={`Switch to ${child.name}`}
                            className={`
                                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                text-[11px] border transition-all duration-150 leading-none
                                ${isActive
                                    ? 'font-bold'
                                    : 'font-medium hover:bg-white/10'
                                }
                            `}
                            style={{
                                background: isActive ? (child.avatar_color || 'var(--gold)') : 'rgba(255,255,255,0.06)',
                                border: `1px solid ${isActive ? (child.avatar_color || 'var(--gold)') : 'rgba(255,255,255,0.1)'}`,
                                color: isActive ? 'var(--ink)' : 'rgba(250,247,242,0.6)',
                            }}
                        >
                            {/* Initials dot */}
                            <span
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                                style={{
                                    background: isActive ? 'rgba(0,0,0,0.2)' : (child.avatar_color || 'var(--gold)'),
                                    color: isActive ? 'var(--ink)' : 'var(--cream)',
                                }}
                            >
                                {child.name.charAt(0).toUpperCase()}
                            </span>
                            {child.name}
                        </button>
                    );
                })}
            </div>

            {/* Active child meta */}
            {activeChild && (
                <p
                    className="text-[9px] mt-2 tracking-[0.1em]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(250,247,242,0.25)' }}
                >
                    {activeChild.name} · {ageGroup} · Age {activeChild.age}
                </p>
            )}
        </div>
    );
}