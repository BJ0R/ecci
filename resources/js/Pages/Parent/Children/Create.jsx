// resources/js/Pages/Parent/Children/Create.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

const AVATAR_COLORS = [
    '#B8923A', '#6B5EA8', '#3E6B52', '#C0523E',
    '#3A7CA8', '#A85E80', '#5EA89C', '#A8925E',
];

const GRADE_OPTIONS = [
    '', 'Nursery', 'Kinder', 'Grade 1', 'Grade 2', 'Grade 3',
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
];

export default function ChildrenCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name:         '',
        age:          '',
        grade:        '',
        avatar_color: '#B8923A',
    });

    function submit(e) { e.preventDefault(); post('/children'); }

    const ageGroup = data.age
        ? (data.age <= 5 ? 'Nursery' : data.age <= 10 ? 'Kids' : 'Youth')
        : null;

    return (
        <AppLayout title="Add Child">
            <Head title="Add Child — ECCII" />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] mb-7" style={{ color: 'var(--ink-50)' }}>
                <Link href="/children"
                    className="inline-flex items-center gap-1 no-underline transition-opacity hover:opacity-70"
                    style={{ color: 'var(--ink-50)' }}>
                    <ArrowLeft size={13} />
                    My Children
                </Link>
                <span style={{ color: 'var(--border)' }}>/</span>
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Add Child</span>
            </nav>

            <div className="max-w-[480px]">
                <h1 className="text-[28px] font-bold mb-1.5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                    Add a Child Profile
                </h1>
                <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'var(--ink-50)' }}>
                    Create a profile for each child so you can track their learning progress separately.
                </p>

                <form onSubmit={submit}>

                    {/* ── Avatar color picker ──────────────────────── */}
                    <div className="rounded-[14px] border p-5 mb-4"
                        style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                        <label className="block text-[12px] font-bold mb-3.5" style={{ color: 'var(--ink)' }}>
                            Avatar Color
                        </label>

                        {/* Preview */}
                        <div className="flex items-center gap-3.5 mb-4">
                            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-[22px] font-bold border-2 transition-colors"
                                style={{ background: data.avatar_color, color: 'var(--ink)', borderColor: 'rgba(0,0,0,0.1)', fontFamily: "'Cormorant Garamond', serif" }}>
                                {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <div className="font-semibold text-[14px]" style={{ color: 'var(--ink)' }}>
                                    {data.name || 'Child Name'}
                                </div>
                                <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-50)' }}>
                                    {ageGroup ? `${ageGroup} · Age ${data.age}` : 'Age not set'}
                                </div>
                            </div>
                        </div>

                        {/* Color chips */}
                        <div className="flex gap-2 flex-wrap">
                            {AVATAR_COLORS.map(color => (
                                <button key={color} type="button"
                                    onClick={() => setData('avatar_color', color)}
                                    className="w-8 h-8 rounded-full border-none cursor-pointer flex items-center justify-center transition-transform"
                                    style={{
                                        background: color,
                                        outline:      data.avatar_color === color ? `3px solid var(--ink)` : '3px solid transparent',
                                        outlineOffset: '2px',
                                        transform:    data.avatar_color === color ? 'scale(1.15)' : 'scale(1)',
                                    }}>
                                    {data.avatar_color === color && <Check size={13} color="white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Name + Age + Grade ───────────────────────── */}
                    <div className="rounded-[14px] border p-5 mb-4"
                        style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                        <FieldGroup label="Child's Name *" error={errors.name}>
                            <FieldInput
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Juan"
                                hasError={!!errors.name}
                            />
                        </FieldGroup>

                        <div className="grid grid-cols-2 gap-3.5">
                            <FieldGroup label="Age *" error={errors.age}>
                                <FieldInput
                                    type="number"
                                    value={data.age}
                                    onChange={e => setData('age', e.target.value)}
                                    placeholder="e.g. 8"
                                    hasError={!!errors.age}
                                />
                                {ageGroup && (
                                    <div className="text-[11px] mt-1 font-medium" style={{ color: 'var(--sage)' }}>
                                        → {ageGroup} group
                                    </div>
                                )}
                            </FieldGroup>

                            <FieldGroup label="Grade (optional)" error={errors.grade}>
                                <select
                                    value={data.grade}
                                    onChange={e => setData('grade', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg text-[13px] border outline-none"
                                    style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--ink)', background: 'var(--white)', borderColor: 'var(--border)' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                >
                                    {GRADE_OPTIONS.map(g => (
                                        <option key={g} value={g}>{g || '— Not specified —'}</option>
                                    ))}
                                </select>
                            </FieldGroup>
                        </div>
                    </div>

                    {/* ── Actions ─────────────────────────────────── */}
                    <div className="flex flex-col gap-2.5">
                        <button type="submit" disabled={processing}
                            className="w-full py-3 rounded-lg text-[14px] font-semibold border-none cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                            {processing ? 'Adding…' : 'Save'}
                        </button>
                        <Link href="/children"
                            className="block text-center py-3 rounded-lg text-[13px] no-underline border transition-colors hover:bg-[var(--cream-2)]"
                            style={{ background: 'var(--cream-2)', borderColor: 'var(--border)', color: 'var(--ink-50)', fontFamily: "'Outfit', sans-serif" }}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function FieldGroup({ label, error, children }) {
    return (
        <div className="mb-3.5">
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                {label}
            </label>
            {children}
            {error && <p className="text-[11px] mt-1" style={{ color: 'var(--rose)' }}>{error}</p>}
        </div>
    );
}

function FieldInput({ value, onChange, type = 'text', placeholder, hasError, ...rest }) {
    return (
        <input
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] border outline-none transition-colors"
            style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--ink)', background: 'var(--white)', borderColor: hasError ? 'var(--rose)' : 'var(--border)' }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = hasError ? 'var(--rose)' : 'var(--border)'}
            {...rest}
        />
    );
}