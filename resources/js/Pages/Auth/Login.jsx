// resources/js/Pages/Auth/Login.jsx
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
@keyframes floatLogo {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* ── Panel animations ── */
.eccii-brand-panel {
  animation: slideInLeft 0.75s cubic-bezier(0.22,1,0.36,1) both;
  position: relative;
  overflow: hidden;
}
.eccii-brand-panel::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232,160,32,0.09) 0%, transparent 65%);
  pointer-events: none;
}
.eccii-brand-panel::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%);
  pointer-events: none;
}

.eccii-form-wrap {
  animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both;
}

/* ── Staggered fields ── */
.eccii-field { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.eccii-field:nth-child(1) { animation-delay: 0.22s; }
.eccii-field:nth-child(2) { animation-delay: 0.30s; }
.eccii-field:nth-child(3) { animation-delay: 0.37s; }
.eccii-field:nth-child(4) { animation-delay: 0.44s; }
.eccii-field:nth-child(5) { animation-delay: 0.50s; }

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
  position: relative;
  overflow: hidden;
  transition: transform 0.16s ease, box-shadow 0.18s ease;
}
.eccii-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.3s;
}
.eccii-btn:hover:not(:disabled)::before {
  opacity: 1;
  animation: shimmer 1.2s ease infinite;
}
.eccii-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13,31,92,0.30);
}
.eccii-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

/* ── Gold link underline ── */
.eccii-gold-link {
  position: relative;
  transition: color 0.15s;
}
.eccii-gold-link::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 0;
  height: 1px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s ease;
}
.eccii-gold-link:hover::after { transform: scaleX(1); }

/* ── Gold accent bar ── */
.eccii-gold-bar {
  width: 32px; height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-lt));
  margin-bottom: 24px;
  border-radius: 2px;
  animation: glowPulse 2.5s ease-in-out 1s infinite;
}

/* ── Responsive root ── */
.eccii-auth-root {
  min-height: 100svh;
  display: flex;
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
}

/* ── Mobile top bar ── */
.eccii-mobile-bar {
  display: none;
  background: var(--ink);
  padding: 12px 18px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

@media (max-width: 1023px) {
  .eccii-auth-root    { flex-direction: column; }
  .eccii-mobile-bar   { display: flex; }
  .eccii-brand-panel  { display: none !important; }
  .eccii-form-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 5vw, 40px);
    overflow-y: auto;
  }
}
@media (min-width: 1024px) {
  .eccii-form-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    overflow-y: auto;
  }
}

/* Compact on very short screens */
@media (max-height: 660px) {
  .eccii-form-gap  { gap: 10px !important; }
  .eccii-hdr-mb   { margin-bottom: 14px !important; }
}
`;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    const inputStyle = (hasErr) => ({
        width: '100%', padding: '10px 14px', boxSizing: 'border-box',
        border: `1.5px solid ${hasErr ? 'var(--rose)' : 'var(--border)'}`,
        borderRadius: '8px', fontSize: '14px',
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--ink)', background: 'var(--white)',
    });

    function submit(e) {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    }

    return (
        <>
            <Head title="Sign In — ECCII Home Learning" />
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="eccii-auth-root">



                {/* ── Brand panel (desktop) ─────────────────── */}
                <div
                    className="eccii-brand-panel"
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

                    <div style={{ animation: 'fadeUp 0.8s ease 0.5s both' }}>
                        <div className="eccii-gold-bar" />
                        <blockquote style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '21px', fontStyle: 'italic',
                            lineHeight: 1.6, color: 'var(--cream)',
                            marginBottom: '18px', letterSpacing: '0.01em',
                        }}>
                            "Train up a child in the way he should go; even when he is old he will not depart from it."
                        </blockquote>
                        <cite style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '10px', letterSpacing: '0.18em',
                            color: 'var(--gold-lt)', textTransform: 'uppercase',
                            fontStyle: 'normal',
                        }}>
                            Proverbs 22:6
                        </cite>
                    </div>

                    <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.28)', fontWeight: 300, letterSpacing: '0.02em' }}>
                        Emmanuelle Christian Church II · Children's Ministry
                    </div>
                </div>

                {/* ── Form area ────────────────────────────── */}
                <div className="eccii-form-area">
                    <div className="eccii-form-wrap" style={{ width: '100%', maxWidth: '400px' }}>

                        {/* Header */}
                        <div className="eccii-hdr-mb" style={{ marginBottom: '28px' }}>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 700,
                                color: 'var(--ink)', lineHeight: 1.1,
                                letterSpacing: '-0.01em', marginBottom: '7px',
                            }}>
                                Welcome back
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--ink-50)', lineHeight: 1.5 }}>
                                Sign in to your family account to continue.
                            </p>
                        </div>

                        {status && (
                            <div style={{
                                marginBottom: '16px', padding: '10px 14px',
                                borderRadius: '8px', fontSize: '13px',
                                background: 'var(--sage-pale)', color: 'var(--sage)',
                                border: '1px solid #C2DEC8',
                                animation: 'fadeUp 0.3s ease',
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="eccii-form-gap" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            <div className="eccii-field">
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-50)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email" value={data.email} required
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    className="eccii-input"
                                    style={inputStyle(errors.email)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.email && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--rose)' }}>{errors.email}</p>}
                            </div>

                            <div className="eccii-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-50)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="eccii-gold-link" style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 500, textDecoration: 'none' }}>
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    type="password" value={data.password} required
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    className="eccii-input"
                                    style={inputStyle(errors.password)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.password && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--rose)' }}>{errors.password}</p>}
                            </div>

                            <div className="eccii-field" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    id="remember" type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    style={{ accentColor: 'var(--gold)', width: '15px', height: '15px', cursor: 'pointer', flexShrink: 0 }}
                                />
                                <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--ink-80)', cursor: 'pointer' }}>
                                    Keep me signed in
                                </label>
                            </div>

                            <div className="eccii-field">
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
                                            Signing in…
                                        </span>
                                    ) : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-50)' }}>
                            New family?{' '}
                            <Link href={route('register')} className="eccii-gold-link" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}