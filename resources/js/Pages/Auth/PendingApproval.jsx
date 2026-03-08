// resources/js/Pages/Auth/PendingApproval.jsx
import { Head, Link } from '@inertiajs/react';

export default function PendingApproval() {
    return (
        <>
            <Head title="Awaiting Approval — ECCII" />
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%       { opacity: 1;   transform: scale(1.08); }
                }
                .pa-wrap  { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
                .pa-icon  { animation: pulse 2.4s ease-in-out infinite; }
            `}} />

            <div style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #faf7f0 100%)',
                fontFamily: "'Outfit', sans-serif",
                padding: '24px',
            }}>
                <div className="pa-wrap" style={{
                    width: '100%', maxWidth: '440px',
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1px solid rgba(13,31,92,0.10)',
                    boxShadow: '0 8px 40px rgba(13,31,92,0.10)',
                    padding: '48px 40px',
                    textAlign: 'center',
                }}>
                    {/* Logo */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '72px', height: '72px', borderRadius: '50%',
                            border: '1px solid rgba(232,160,32,0.3)',
                            background: 'rgba(232,160,32,0.07)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            marginBottom: '4px',
                        }}>
                            <img
                                src="/ECCSII.jpg"
                                alt="ECCII"
                                style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Hourglass icon */}
                    <div className="pa-icon" style={{ fontSize: '40px', marginBottom: '16px', lineHeight: 1 }}>
                        ⏳
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '28px', fontWeight: 700,
                        color: '#0d1f5c', lineHeight: 1.15,
                        marginBottom: '12px',
                    }}>
                        Awaiting Approval
                    </h1>

                    {/* Body */}
                    <p style={{
                        fontSize: '14px', color: 'rgba(13,31,92,0.55)',
                        lineHeight: 1.65, marginBottom: '28px',
                    }}>
                        Your account has been created and is currently being reviewed
                        by the church admin. You'll be able to sign in once it's approved.
                    </p>

                    {/* Info box */}
                    <div style={{
                        background: '#FFFBEB', border: '1px solid #FDE68A',
                        borderRadius: '10px', padding: '14px 16px',
                        fontSize: '13px', color: '#92400E',
                        lineHeight: 1.6, marginBottom: '28px',
                        textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: '1px' }}>
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>
                            Please check back later or contact your church coordinator
                            if you have not been approved within 24 hours.
                        </span>
                    </div>

                    {/* Sign out link */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        style={{
                            width: '100%', padding: '11px 20px',
                            background: '#0d1f5c', color: '#faf7f2',
                            border: 'none', borderRadius: '9px',
                            fontSize: '14px', fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                            cursor: 'pointer', letterSpacing: '0.02em',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        Sign Out
                    </Link>

                    <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(13,31,92,0.35)' }}>
                        Emmanuelle Christian Church II · Children's Ministry
                    </p>
                </div>
            </div>
        </>
    );
}