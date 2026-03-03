import { router } from '@inertiajs/react';
import { Users } from 'lucide-react';

/**
 * ChildProfileSwitcher.jsx — ECCII logo palette
 * Sidebar-bottom "Who's Learning" chip selector
 * Gold active chip · dark inactive chips · avatar initials dot
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
    const ageGroup    = activeChild
        ? activeChild.age <= 5 ? 'Nursery' : activeChild.age <= 10 ? 'Kids' : 'Youth'
        : null;

    return (
        <div
            className="px-4 pt-4 pb-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-2.5">
                <Users size={9} style={{ color: 'rgba(240,244,252,0.28)' }} />
                <p
                    className="text-[8px] tracking-[0.24em] uppercase m-0"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(240,244,252,0.28)' }}
                >
                    Who's Learning
                </p>
            </div>

            {/* Chip grid */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Switch active child profile">
                {children.map(child => {
                    const isActive = child.id === activeChildId;
                    return (
                        <button
                            key={child.id}
                            onClick={() => handleSwitch(child.id)}
                            aria-pressed={isActive}
                            title={`Switch to ${child.name}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all duration-150 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
                            style={{
                                fontWeight:  isActive ? '700' : '500',
                                background:  isActive ? (child.avatar_color || '#e8a020') : 'rgba(255,255,255,0.07)',
                                border:      `1px solid ${isActive ? (child.avatar_color || '#e8a020') : 'rgba(255,255,255,0.11)'}`,
                                color:       isActive ? '#0d1f5c' : 'rgba(240,244,252,0.60)',
                                boxShadow:   isActive ? '0 2px 8px rgba(232,160,32,0.25)' : 'none',
                            }}
                        >
                            {/* Initials dot */}
                            <span
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                                style={{
                                    background: isActive ? 'rgba(0,0,0,0.18)' : (child.avatar_color || '#e8a020'),
                                    color:      isActive ? '#0d1f5c' : '#ffffff',
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
                    className="text-[9px] mt-2.5 tracking-[0.10em] m-0"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(240,244,252,0.22)' }}
                >
                    {activeChild.name} · {ageGroup} · Age {activeChild.age}
                </p>
            )}
        </div>
    );
}