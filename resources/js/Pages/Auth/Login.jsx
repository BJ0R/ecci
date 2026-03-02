import { Head, Link, useForm } from '@inertiajs/react';

/**
 * Login.jsx — Auth page
 *
 * Split-panel layout: left = dark ECCII brand panel, right = form.
 * Matches the ECCII design language: Cormorant Garamond headings,
 * Outfit body, gold focus rings, cream background.
 */
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    }

    return (
        <>
            <Head title="Sign In — ECCII Home Learning" />

            <div className="min-h-screen flex" style={{ fontFamily: "'Outfit', sans-serif", background: 'var(--cream)' }}>

                {/* ── Left brand panel ─────────────────────────────── */}
                <div
                    className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 p-12"
                    style={{ background: 'var(--ink)', color: 'var(--cream)' }}
                >
                    {/* Logo */}
                    <div>
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '32px', fontWeight: 700,
                            letterSpacing: '-0.02em', lineHeight: 1,
                        }}>
                            ECC<em style={{ color: 'var(--gold-lt)', fontStyle: 'italic' }}>II</em>
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.35)', marginTop: '4px', letterSpacing: '0.08em' }}>
                            Home Learning Platform
                        </div>
                    </div>

                    {/* Quote block */}
                    <div>
                        <div style={{
                            width: '32px', height: '2px',
                            background: 'var(--gold)', marginBottom: '24px',
                        }} />
                        <blockquote style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '22px', fontStyle: 'italic',
                            lineHeight: 1.5, color: 'var(--cream)',
                            marginBottom: '16px',
                        }}>
                            "Train up a child in the way he should go; even when he is old he will not depart from it."
                        </blockquote>
                        <cite style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '10px', letterSpacing: '0.18em',
                            color: 'var(--gold-lt)', textTransform: 'uppercase',
                        }}>
                            Proverbs 22:6
                        </cite>
                    </div>

                    {/* Bottom tagline */}
                    <div style={{ fontSize: '12px', color: 'rgba(250,247,242,0.3)' }}>
                        Emmanuelle Christian Church II · Children's Ministry
                    </div>
                </div>

                {/* ── Right form panel ─────────────────────────────── */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="lg:hidden mb-10 text-center">
                            <div style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '28px', fontWeight: 700,
                                color: 'var(--ink)',
                            }}>
                                ECC<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>II</em>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '34px', fontWeight: 700,
                                color: 'var(--ink)', lineHeight: 1.1,
                                letterSpacing: '-0.01em', marginBottom: '8px',
                            }}>
                                Welcome back
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--ink-50)' }}>
                                Sign in to your family account to continue.
                            </p>
                        </div>

                        {/* Status message (e.g. password reset success) */}
                        {status && (
                            <div className="mb-4 p-3 rounded-lg text-sm" style={{
                                background: 'var(--sage-pale)',
                                color: 'var(--sage)',
                                border: '1px solid #C2DEC8',
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-50)', letterSpacing: '0.04em' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: errors.email ? '1.5px solid var(--rose)' : '1.5px solid var(--border)',
                                        borderRadius: '8px', fontSize: '14px',
                                        fontFamily: "'Outfit', sans-serif",
                                        color: 'var(--ink)', background: 'var(--white)',
                                        outline: 'none', transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-50)', letterSpacing: '0.04em' }}>
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: errors.password ? '1.5px solid var(--rose)' : '1.5px solid var(--border)',
                                        borderRadius: '8px', fontSize: '14px',
                                        fontFamily: "'Outfit', sans-serif",
                                        color: 'var(--ink)', background: 'var(--white)',
                                        outline: 'none', transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.password}</p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2.5">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    style={{ accentColor: 'var(--gold)', width: '15px', height: '15px', cursor: 'pointer' }}
                                />
                                <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--ink-80)', cursor: 'pointer' }}>
                                    Keep me signed in
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%', padding: '11px 20px',
                                    background: processing ? 'rgba(13,13,13,0.6)' : 'var(--ink)',
                                    color: 'var(--cream)', border: 'none',
                                    borderRadius: '8px', fontSize: '14px',
                                    fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        {/* Register link */}
                        <p className="mt-6 text-center" style={{ fontSize: '13px', color: 'var(--ink-50)' }}>
                            New family?{' '}
                            <Link
                                href={route('register')}
                                style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}