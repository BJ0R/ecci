import { Head, Link, useForm } from '@inertiajs/react';

/**
 * Register.jsx — Extended Breeze registration page
 *
 * Added fields beyond Breeze default:
 *   family_name — e.g. "Santos Family" — displayed in sidebar and admin views
 *
 * Note on is_approved: New accounts default to false (unapproved).
 * The parent will see a "pending approval" message after registering.
 * Admin must approve their account before they can log in.
 * This message is shown by IsParent middleware redirect.
 */
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:        '',
        family_name: '',
        email:       '',
        password:    '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    // Reusable field style builder
    const inputStyle = (hasError) => ({
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${hasError ? 'var(--rose)' : 'var(--border)'}`,
        borderRadius: '8px', fontSize: '14px',
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--ink)', background: 'var(--white)',
        outline: 'none', transition: 'border-color 0.15s',
    });

    const labelStyle = {
        fontSize: '11px', fontWeight: 600,
        color: 'var(--ink-50)', letterSpacing: '0.04em',
        display: 'block', marginBottom: '6px',
    };

    return (
        <>
            <Head title="Register — ECCII Home Learning" />

            <div className="min-h-screen flex" style={{ fontFamily: "'Outfit', sans-serif", background: 'var(--cream)' }}>

                {/* ── Left brand panel ─────────────────────────────── */}
                <div
                    className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 p-12"
                    style={{ background: 'var(--ink)' }}
                >
                    {/* Logo */}
                    <div>
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '32px', fontWeight: 700,
                            letterSpacing: '-0.02em', lineHeight: 1,
                            color: 'var(--cream)',
                        }}>
                            ECC<em style={{ color: 'var(--gold-lt)', fontStyle: 'italic' }}>II</em>
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(250,247,242,0.35)', marginTop: '4px', letterSpacing: '0.08em' }}>
                            Home Learning Platform
                        </div>
                    </div>

                    {/* How it works steps */}
                    <div>
                        <div style={{ width: '32px', height: '2px', background: 'var(--gold)', marginBottom: '24px' }} />
                        <p style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-lt)', marginBottom: '20px' }}>
                            How it works
                        </p>
                        {[
                            ['01', 'Register your family account'],
                            ['02', 'Admin approves your account'],
                            ['03', 'Add your children as profiles'],
                            ['04', 'Start guided Bible lessons together'],
                        ].map(([num, text]) => (
                            <div key={num} className="flex items-start gap-3 mb-4">
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '10px', color: 'var(--gold)',
                                    fontWeight: 700, flexShrink: 0,
                                    marginTop: '1px',
                                }}>{num}</span>
                                <span style={{ fontSize: '13px', color: 'rgba(250,247,242,0.65)', lineHeight: 1.5 }}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(250,247,242,0.3)' }}>
                        Emmanuelle Christian Church II · Children's Ministry
                    </div>
                </div>

                {/* ── Right form panel ─────────────────────────────── */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="lg:hidden mb-10 text-center">
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: 'var(--ink)' }}>
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
                                Create family account
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--ink-50)' }}>
                                One account for your whole family. Add each child as a profile after registering.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Parent's name */}
                            <div>
                                <label style={labelStyle}>Your Name (Parent / Guardian)</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    autoComplete="name"
                                    required
                                    placeholder="e.g. Maria Santos"
                                    style={inputStyle(!!errors.name)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.name ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.name}</p>}
                            </div>

                            {/* Family name — ECCII extension */}
                            <div>
                                <label style={labelStyle}>
                                    Family Name
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', background: 'var(--gold-pale)', color: 'var(--amber)', padding: '1px 6px', borderRadius: '4px', marginLeft: '8px' }}>
                                        ECCII
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={data.family_name}
                                    onChange={e => setData('family_name', e.target.value)}
                                    placeholder="e.g. Santos Family"
                                    style={inputStyle(!!errors.family_name)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.family_name ? 'var(--rose)' : 'var(--border)'}
                                />
                                <p style={{ fontSize: '11px', color: 'var(--ink-50)', marginTop: '4px' }}>
                                    Shown in the sidebar and on the admin dashboard.
                                </p>
                                {errors.family_name && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.family_name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                    style={inputStyle(!!errors.email)}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'var(--rose)' : 'var(--border)'}
                                />
                                {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.email}</p>}
                            </div>

                            {/* Password row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label style={labelStyle}>Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        style={inputStyle(!!errors.password)}
                                        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                        onBlur={e => e.target.style.borderColor = errors.password ? 'var(--rose)' : 'var(--border)'}
                                    />
                                    {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.password}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        style={inputStyle(!!errors.password_confirmation)}
                                        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                        onBlur={e => e.target.style.borderColor = errors.password_confirmation ? 'var(--rose)' : 'var(--border)'}
                                    />
                                </div>
                            </div>

                            {/* Approval notice */}
                            <div style={{
                                background: 'var(--amber-pale)', border: '1px solid #E8C87A',
                                borderRadius: '8px', padding: '12px 14px',
                                fontSize: '12px', color: 'var(--amber)', lineHeight: 1.55,
                            }}>
                                <strong>Approval required.</strong> Your account will be reviewed by the church admin before you can sign in. You'll be notified when approved.
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
                                {processing ? 'Creating account…' : 'Create Family Account'}
                            </button>
                        </form>

                        {/* Login link */}
                        <p className="mt-6 text-center" style={{ fontSize: '13px', color: 'var(--ink-50)' }}>
                            Already have an account?{' '}
                            <Link href={route('login')} style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}