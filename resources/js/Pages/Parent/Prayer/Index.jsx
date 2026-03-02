// resources/js/Pages/Parent/Prayer/Index.jsx
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    HeartHandshake, Plus, X, CheckCircle2,
    MessageSquare, Users, ToggleLeft, ToggleRight, Send,
} from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

export default function PrayerIndex({ myRequests = [], publicRequests = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(myRequests.length === 0);

    const { data, setData, post, processing, errors, reset } = useForm({
        body:      '',
        is_public: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/prayer', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    return (
        <AppLayout title="Prayer">
            <Head title="Prayer Requests — ECCII" />

            {flash?.success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 text-[13px]"
                    style={{ background: 'var(--sage-pale)', borderColor: '#C2DEC8', color: 'var(--sage)' }}>
                    <CheckCircle2 size={14} /> 🙏 {flash.success}
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
                <div>
                    <div className="text-[10px] tracking-[0.16em] uppercase mb-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                        Community
                    </div>
                    <h1 className="text-[28px] font-bold m-0 mb-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                        Prayer Requests
                    </h1>
                    <p className="text-[13px] m-0 leading-relaxed" style={{ color: 'var(--ink-50)' }}>
                        Share your needs with the church. Our pastor responds to every request.
                    </p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer flex-shrink-0 transition-opacity hover:opacity-80"
                        style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                        <Plus size={15} />
                        New Request
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                {/* ── Left: form + my requests ────────────────────── */}
                <div>
                    {/* Submit form */}
                    {showForm && (
                        <div className="rounded-[14px] border overflow-hidden mb-5"
                            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                            <div className="flex items-center justify-between px-5 py-3.5 border-b"
                                style={{ borderColor: 'var(--border-lt)' }}>
                                <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--ink)' }}>
                                    <HeartHandshake size={14} />
                                    New Prayer Request
                                </div>
                                {myRequests.length > 0 && (
                                    <button onClick={() => setShowForm(false)}
                                        className="p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors hover:bg-[var(--cream-2)]"
                                        style={{ color: 'var(--ink-50)' }}>
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={submit} className="p-5">
                                <div className="mb-3.5">
                                    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                                        Your Prayer Request *
                                    </label>
                                    <textarea
                                        value={data.body}
                                        onChange={e => setData('body', e.target.value)}
                                        rows={4}
                                        placeholder="Share what you'd like the church to pray for…"
                                        className="w-full px-3.5 py-2.5 rounded-lg text-[13px] border outline-none resize-y leading-relaxed"
                                        style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--ink)', background: 'var(--cream)', borderColor: errors.body ? 'var(--rose)' : 'var(--border)' }}
                                        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                        onBlur={e => e.target.style.borderColor = errors.body ? 'var(--rose)' : 'var(--border)'}
                                    />
                                    {errors.body && <p className="text-[11px] mt-1" style={{ color: 'var(--rose)' }}>{errors.body}</p>}
                                    <p className="text-[11px] mt-1" style={{ color: 'var(--ink-50)' }}>
                                        {data.body.length} / 2000
                                    </p>
                                </div>

                                {/* Share publicly toggle */}
                                <label className="flex items-start gap-3 cursor-pointer mb-5">
                                    <button type="button" onClick={() => setData('is_public', !data.is_public)}
                                        className="flex-shrink-0 mt-0.5 border-none bg-transparent cursor-pointer p-0 transition-colors"
                                        style={{ color: data.is_public ? 'var(--sage)' : 'var(--border)' }}>
                                        {data.is_public
                                            ? <ToggleRight size={30} strokeWidth={1.5} />
                                            : <ToggleLeft  size={30} strokeWidth={1.5} style={{ color: 'var(--border)' }} />
                                        }
                                    </button>
                                    <div>
                                        <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                            Share with community
                                        </div>
                                        <div className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--ink-50)' }}>
                                            {data.is_public
                                                ? 'Other families can see and pray for your request.'
                                                : 'Only you and the pastor can see this.'}
                                        </div>
                                    </div>
                                </label>

                                <button type="submit" disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity disabled:opacity-50"
                                    style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Outfit', sans-serif" }}>
                                    <Send size={13} />
                                    {processing ? 'Submitting…' : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* My requests */}
                    <div className="rounded-[14px] border overflow-hidden"
                        style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b text-[12px] font-bold"
                            style={{ borderColor: 'var(--border-lt)', color: 'var(--ink)' }}>
                            <MessageSquare size={13} />
                            My Requests ({myRequests.length})
                        </div>
                        {myRequests.length === 0 ? (
                            <div className="py-10 text-center text-[13px]" style={{ color: 'var(--ink-50)' }}>
                                You haven't submitted any prayer requests yet.
                            </div>
                        ) : (
                            myRequests.map((req, i) => (
                                <div key={req.id}
                                    className="px-5 py-4 border-b last:border-b-0"
                                    style={{ borderColor: 'var(--border-lt)' }}>
                                    <blockquote className="text-[15px] italic leading-[1.7] m-0 mb-2.5"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                                        "{req.body}"
                                    </blockquote>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px]"
                                            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                                            {new Date(req.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <StatusBadge responded={req.is_responded} />
                                        {req.is_public && (
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                                                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--ink-50)', fontFamily: "'JetBrains Mono', monospace" }}>
                                                Public
                                            </span>
                                        )}
                                    </div>
                                    {req.is_responded && req.admin_response && (
                                        <div className="mt-3 px-3.5 py-3 rounded-lg border-l-[3px]"
                                            style={{ background: 'var(--sage-pale)', borderLeftColor: 'var(--sage)' }}>
                                            <div className="text-[9px] tracking-[0.14em] uppercase font-bold mb-1.5"
                                                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--sage)' }}>
                                                Pastor's Response
                                            </div>
                                            <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--ink)' }}>
                                                {req.admin_response}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Right: community board ───────────────────────── */}
                <div className="lg:sticky lg:top-[80px]">
                    <div className="rounded-[14px] border overflow-hidden"
                        style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b text-[12px] font-bold"
                            style={{ borderColor: 'var(--border-lt)', color: 'var(--ink)' }}>
                            <Users size={13} />
                            Community Board
                        </div>
                        {publicRequests.length === 0 ? (
                            <div className="py-6 px-5 text-center text-[12px] leading-relaxed" style={{ color: 'var(--ink-50)' }}>
                                No public requests yet.
                            </div>
                        ) : (
                            publicRequests.map((req, i) => (
                                <div key={req.id}
                                    className="px-5 py-3.5 border-b last:border-b-0"
                                    style={{ borderColor: 'var(--border-lt)' }}>
                                    <blockquote className="text-[14px] italic leading-relaxed m-0 mb-1.5 line-clamp-3"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)' }}>
                                        "{req.body}"
                                    </blockquote>
                                    <span className="text-[10px]"
                                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink-50)' }}>
                                        {new Date(req.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))
                        )}
                        <div className="px-5 py-2.5 border-t text-[11px] leading-relaxed"
                            style={{ background: 'var(--cream)', borderColor: 'var(--border-lt)', color: 'var(--ink-50)' }}>
                            Names are kept private on the community board.
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ responded }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{
                fontFamily:  "'JetBrains Mono', monospace",
                letterSpacing: '0.06em',
                background:  responded ? 'var(--sage-pale)' : 'var(--gold-pale)',
                color:       responded ? 'var(--sage)' : 'var(--gold)',
            }}>
            {responded
                ? <><CheckCircle2 size={9} /> Responded</>
                : <><MessageSquare size={9} /> Pending</>
            }
        </span>
    );
}