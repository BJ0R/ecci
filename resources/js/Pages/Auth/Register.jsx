// resources/js/Pages/Auth/Register.jsx
import { Head, Link, useForm } from '@inertiajs/react';

const css = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes stepReveal {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* ── Panel ── */
.eccii-reg-panel {
  animation: slideInLeft 0.75s cubic-bezier(0.22,1,0.36,1) both;
  position: relative; overflow: hidden;
}
.eccii-reg-panel::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,160,32,0.09) 0%, transparent 65%);
  pointer-events: none;
}
.eccii-reg-panel::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 220px; height: 220px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%);
  pointer-events: none;
}

.eccii-reg-wrap {
  animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both;
}

/* ── Staggered fields ── */
.eccii-reg-field { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.eccii-reg-field:nth-child(1) { animation-delay: 0.20s; }
.eccii-reg-field:nth-child(2) { animation-delay: 0.27s; }
.eccii-reg-field:nth-child(3) { animation-delay: 0.33s; }
.eccii-reg-field:nth-child(4) { animation-delay: 0.39s; }
.eccii-reg-field:nth-child(5) { animation-delay: 0.45s; }
.eccii-reg-field:nth-child(6) { animation-delay: 0.50s; }
.eccii-reg-field:nth-child(7) { animation-delay: 0.55s; }

/* ── Step items ── */
.eccii-step {
  animation: stepReveal 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
.eccii-step:nth-child(1) { animation-delay: 0.55s; }
.eccii-step:nth-child(2) { animation-delay: 0.65s; }
.eccii-step:nth-child(3) { animation-delay: 0.75s; }
.eccii-step:nth-child(4) { animation-delay: 0.85s; }

/* ── Logo ── */
.eccii-logo-ring {
  transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  cursor: default;
}
.eccii-logo-ring:hover {
  transform: scale(1.07);
  box-shadow: 0 0 0 5px rgba(232,160,32,0.25);
}

/* ── Input ── */
.eccii-input {
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  outline: none;
}
.eccii-input:focus {
  background: #fafcff !important;
  box-shadow: 0 0 0 3px rgba(232,160,32,0.2) !important;
}

/* ── Button ── */
.eccii-btn {
  position: relative; overflow: hidden;
  transition: transform 0.16s ease, box-shadow 0.18s ease;
}
.eccii-btn::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
  background-size: 200% 100%; opacity: 0; transition: opacity 0.3s;
}
.eccii-btn:hover:not(:disabled)::before {
  opacity: 1;
  animation: shimmer 1.2s ease infinite;
}
.eccii-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13,31,92,0.30);
}
.eccii-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }

/* ── Gold link ── */
.eccii-gold-link {
  position: relative; transition: color 0.15s;
}
.eccii-gold-link::after {
  content: '';
  position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
  background: var(--gold); transform: scaleX(0); transform-origin: left;
  transition: transform 0.22s ease;
}
.eccii-gold-link:hover::after { transform: scaleX(1); }

/* ── Gold bar ── */
.eccii-gold-bar {
  width: 32px; height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-lt));
  margin-bottom: 20px; border-radius: 2px;
  animation: glowPulse 2.5s ease-in-out 1s infinite;
}

/* ── Responsive root ── */
.eccii-auth-root {
  min-height: 100svh; display: flex;
  font-family: 'Outfit', sans-serif; background: var(--cream);
}
.eccii-mobile-bar {
  display: none; background: var(--ink); padding: 12px 18px;
  align-items: center; justify-content: space-between; flex-shrink: 0;
}

@media (max-width: 1023px) {
  .eccii-auth-root   { flex-direction: column; }
  .eccii-mobile-bar  { display: flex; }
  .eccii-reg-panel   { display: none !important; }
  .eccii-form-area {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: clamp(16px, 5vw, 36px); overflow-y: auto;
  }
}
@media (min-width: 1024px) {
  .eccii-form-area {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 40px; overflow-y: auto;
  }
}

/* ── Compact on very short screens ── */
@media (max-height: 700px) {
  .eccii-reg-gap   { gap: 10px !important; }
  .eccii-reg-hdr   { margin-bottom: 14px !important; }
}

/* ── Password grid: stack on tiny screens ── */
@media (max-width: 420px) {
  .eccii-pw-grid { grid-template-columns: 1fr !important; }
}
`;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        family_name:           '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });

    const inputStyle = (hasErr) => ({
        width: '100%', padding: '10px 14px', boxSizing: 'border-box',
        border: `1.5px solid ${hasErr ? 'var(--rose)' : 'var(--border)'}`,
        borderRadius: '8px', fontSize: '14px',
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--ink)', background: 'var(--white)',
    });

    const labelStyle = {
        fontSize: '11px', fontWeight: 600,
        color: 'var(--ink-50)', letterSpacing: '0.05em',
        textTransform: 'uppercase', display: 'block', marginBottom: '6px',
    };

    function submit(e) {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    }

    const steps = [
        ['01', 'Register your family account'],
        ['02', 'Admin approves your account'],
        ['03', 'Add your children as profiles'],
        ['04', 'Start guided Bible lessons together'],
    ];

    return (
        <>
            <Head title="Register — ECCII Home Learning" />
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="eccii-auth-root">


                {/* ── Brand panel (desktop) ─────────────────── */}
                <div
                    className="eccii-reg-panel"
                    style={{
                        background: 'var(--ink)', color: 'var(--cream)',
                        width: '420px', flexShrink: 0,
                        padding: '48px 44px',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <div className="eccii-logo-ring" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            padding: '8px', borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
                            marginBottom: '12px',
                        }}>
                            <img src="/ECCSII.jpg" alt="ECCSII" style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(250,247,242,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                            Home Learning Platform
                        </div>
                    </div>

                    {/* Steps */}
                    <div>
                        <div className="eccii-gold-bar" />
                        <p style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-lt)', marginBottom: '20px' }}>
                            How it works
                        </p>
                        {steps.map(([num, text]) => (
                            <div key={num} className="eccii-step" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '10px', color: 'var(--gold)', fontWeight: 700,
                                    flexShrink: 0, marginTop: '2px',
                                    minWidth: '20px',
                                }}>{num}</span>
                                <span style={{ fontSize: '13px', color: 'rgba(250,247,242,0.65)', lineHeight: 1.55 }}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.28)', fontWeight: 300, letterSpacing: '0.02em' }}>
                        Emmanuelle Christian Church II · Children's Ministry
                    </div>
                </div>

                {/* ── Form area ────────────────────────────── */}
                <div className="eccii-form-area">
                    <div className="eccii-reg-wrap" style={{ width: '100%', maxWidth: '420px' }}>

                        {/* Header */}
                        <div className="eccii-reg-hdr" style={{ marginBottom: '24px' }}>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700,
                                color: 'var(--ink)', lineHeight: 1.1,
                                letterSpacing: '-0.01em', marginBottom: '7px',
                            }}>
                                Create family account
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--ink-50)', lineHeight: 1.5 }}>
                                One account for your whole family. Add each child as a profile after registering.
                            </p>
                        </div>

                        <form onSubmit={submit} className="eccii-reg-gap" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                            {/* Parent name */}
                            <div className="eccii-reg-field">
                                <label style={labelStyle}>Your Name (Parent / Guardian)</label>
                                <input
                                    type="text" value={data.name} required
                                    onChange={e => setData('name', e.target.value)}
                                    autoComplete="name" placeholder="e.g. Maria Santos"
                                    className="eccii-input" style={inputStyle(errors.name)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.name ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.name && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--rose)' }}>{errors.name}</p>}
                            </div>

                            {/* Family name */}
                            <div className="eccii-reg-field">
                                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Family Name
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', background: '#FDF2F2', color: '#B45309', padding: '1px 6px', borderRadius: '4px', border: '1px solid #FDE68A', textTransform: 'uppercase', fontWeight: 700 }}>
                                        ECCII
                                    </span>
                                </label>
                                <input
                                    type="text" value={data.family_name}
                                    onChange={e => setData('family_name', e.target.value)}
                                    placeholder="e.g. Santos Family"
                                    className="eccii-input" style={inputStyle(errors.family_name)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.family_name ? 'var(--rose)' : 'var(--border)'}
                                />
                                <p style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '4px' }}>
                                    Shown in the sidebar and on the admin dashboard.
                                </p>
                                {errors.family_name && <p style={{ marginTop: '2px', fontSize: '12px', color: 'var(--rose)' }}>{errors.family_name}</p>}
                            </div>

                            {/* Email */}
                            <div className="eccii-reg-field">
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email" value={data.email} required
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    className="eccii-input" style={inputStyle(errors.email)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.email && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--rose)' }}>{errors.email}</p>}
                            </div>

                            {/* Password row */}
                            <div className="eccii-reg-field eccii-pw-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Password</label>
                                    <input
                                        type="password" value={data.password} required
                                        onChange={e => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        className="eccii-input" style={inputStyle(errors.password)}
                                        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                        onBlur={e => e.target.style.borderColor = errors.password ? 'var(--rose)' : 'var(--border)'}
                                    />
                                    {errors.password && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--rose)' }}>{errors.password}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Confirm</label>
                                    <input
                                        type="password" value={data.password_confirmation} required
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        className="eccii-input" style={inputStyle(errors.password_confirmation)}
                                        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                        onBlur={e => e.target.style.borderColor = errors.password_confirmation ? 'var(--rose)' : 'var(--border)'}
                                    />
                                </div>
                            </div>

                            {/* Approval notice */}
                            <div className="eccii-reg-field" style={{
                                background: '#FFFBEB', border: '1px solid #FDE68A',
                                borderRadius: '8px', padding: '11px 14px',
                                fontSize: '12px', color: '#92400E', lineHeight: 1.55,
                                display: 'flex', gap: '10px', alignItems: 'flex-start',
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: '1px' }}>
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <span><strong>Approval required.</strong> Your account will be reviewed by the church admin before you can sign in.</span>
                            </div>

                            {/* Submit */}
                            <div className="eccii-reg-field">
                                <button
                                    type="submit" disabled={processing}
                                    className="eccii-btn"
                                    style={{
                                        width: '100%', padding: '12px 20px',
                                        background: processing ? 'rgba(13,31,92,0.55)' : 'var(--ink)',
                                        color: 'var(--cream)', border: 'none',
                                        borderRadius: '8px', fontSize: '14px',
                                        fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {processing ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Creating account…
                                        </span>
                                    ) : 'Create Family Account'}
                                </button>
                            </div>
                        </form>

                        <p style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-50)' }}>
                            Already have an account?{' '}
                            <Link href={route('login')} className="eccii-gold-link" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}