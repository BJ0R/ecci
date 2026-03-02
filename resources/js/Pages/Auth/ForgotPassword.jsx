import { Head, Link, useForm } from '@inertiajs/react';

/**
 * ForgotPassword.jsx — Auth page
 *
 * Sends the Laravel password reset link email.
 * Minimal layout — centred card with brand mark.
 */
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    function submit(e) {
        e.preventDefault();
        post(route('password.email'));
    }

    return (
        <>
            <Head title="Reset Password — ECCII Home Learning" />

            <div
                className="min-h-screen flex items-center justify-center p-6"
                style={{ fontFamily: "'Outfit', sans-serif", background: 'var(--cream)' }}
            >
                <div className="w-full max-w-sm">

                    {/* Logo */}
                    <div className="text-center mb-10">
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '30px', fontWeight: 700,
                            color: 'var(--ink)', letterSpacing: '-0.02em',
                        }}>
                            ECC<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>II</em>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '3px', letterSpacing: '0.06em' }}>
                            Home Learning Platform
                        </div>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'var(--white)', border: '1px solid var(--border)',
                        borderRadius: '16px', padding: '36px 32px',
                        boxShadow: 'var(--shadow-md)',
                    }}>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '26px', fontWeight: 700,
                            color: 'var(--ink)', marginBottom: '10px',
                        }}>
                            Forgot your password?
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: '24px' }}>
                            Enter the email address registered with your family account and we'll send you a reset link.
                        </p>

                        {/* Success status */}
                        {status && (
                            <div className="mb-4 p-3 rounded-lg text-sm" style={{
                                background: 'var(--sage-pale)', color: 'var(--sage)',
                                border: '1px solid #C2DEC8', fontSize: '13px', lineHeight: 1.55,
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label style={{
                                    fontSize: '11px', fontWeight: 600,
                                    color: 'var(--ink-50)', letterSpacing: '0.04em',
                                    display: 'block', marginBottom: '6px',
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    autoFocus
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
                                {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.email}</p>}
                            </div>

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
                                }}
                            >
                                {processing ? 'Sending…' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>

                    {/* Back to login */}
                    <p className="mt-5 text-center" style={{ fontSize: '13px', color: 'var(--ink-50)' }}>
                        Remembered your password?{' '}
                        <Link href={route('login')} style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}