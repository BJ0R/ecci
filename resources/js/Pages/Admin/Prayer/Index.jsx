import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { HeartHandshake, MessageSquare, CheckCircle2, Pencil, Send, X } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { FlashMessage, PageEyebrow, Pagination } from '@/Pages/Admin/Dashboard';

export default function AdminPrayerIndex({ prayerRequests }) {
    const { flash } = usePage().props;
    const [respondingId, setRespondingId] = useState(null);

    const unanswered = prayerRequests.data?.filter(r => !r.is_responded).length ?? 0;

    return (
        <AdminLayout title="Prayer Requests">
            <Head title="Prayer Requests — ECCII Admin" />
            <FlashMessage flash={flash} />

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <PageEyebrow
                    label="People"
                    title="Prayer Requests"
                    desc={unanswered > 0 ? `${unanswered} awaiting response` : 'All requests answered'}
                />
                {unanswered > 0 && (
                    <span
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold flex-shrink-0 bg-rose-50 text-rose-500"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        <HeartHandshake size={13} />
                        {unanswered} pending
                    </span>
                )}
            </div>

            {/* ── List ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {(!prayerRequests.data || prayerRequests.data.length === 0) && (
                    <div className="rounded-[14px] border border-stone-200 bg-white py-14 text-center text-[13px] text-stone-400">
                        No prayer requests yet.
                    </div>
                )}

                {prayerRequests.data?.map(req => (
                    <PrayerCard
                        key={req.id}
                        req={req}
                        isResponding={respondingId === req.id}
                        onStartRespond={() => setRespondingId(req.id)}
                        onCancelRespond={() => setRespondingId(null)}
                        onResponded={() => setRespondingId(null)}
                    />
                ))}
            </div>

            <Pagination links={prayerRequests.links ?? []} />
        </AdminLayout>
    );
}

/* ── Prayer card ─────────────────────────────────────────────────────── */
function PrayerCard({ req, isResponding, onStartRespond, onCancelRespond, onResponded }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        admin_response: req.admin_response ?? '',
    });

    function submitResponse(e) {
        e.preventDefault();
        put(`/admin/prayer/${req.id}/respond`, { onSuccess: () => onResponded() });
    }

    const familyName = req.user?.family_name || req.user?.name || 'Unknown Family';
    const initials   = familyName.charAt(0).toUpperCase();

    return (
        <div
            className={`rounded-[14px] border border-stone-200 bg-white overflow-hidden border-l-[3px] ${req.is_responded ? 'border-l-emerald-600' : 'border-l-amber-500'}`}
        >
            {/* Card header */}
            <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-stone-100">
                {/* Family avatar */}
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[14px] font-bold bg-stone-900 text-amber-500">
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-stone-900">{familyName}</div>
                    <div
                        className="text-[10px] mt-0.5 text-stone-400"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {new Date(req.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {req.is_public && (
                        <span
                            className="px-2 py-0.5 rounded-full text-[9px] bg-black/5 text-stone-400"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            Public
                        </span>
                    )}
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${req.is_responded ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-500'}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {req.is_responded
                            ? <><CheckCircle2 size={10} /> Responded</>
                            : <><MessageSquare size={10} /> Pending</>
                        }
                    </span>
                </div>
            </div>

            {/* Request body */}
            <div className="px-4 md:px-5 py-4">
                <blockquote
                    className="text-[16px] italic leading-relaxed m-0 mb-4 text-stone-900"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    "{req.body}"
                </blockquote>

                {/* Existing response */}
                {req.is_responded && req.admin_response && !isResponding && (
                    <div className="px-4 py-3 rounded-lg mb-3 border-l-[3px] bg-emerald-50 border-l-emerald-600">
                        <div
                            className="text-[9px] tracking-[0.14em] uppercase font-bold mb-1.5 text-emerald-600"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            Your Response · {req.responded_at ? new Date(req.responded_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : ''}
                        </div>
                        <p className="text-[13px] leading-relaxed m-0 text-stone-900">
                            {req.admin_response}
                        </p>
                    </div>
                )}

                {/* Response form */}
                {isResponding ? (
                    <form onSubmit={submitResponse}>
                        <label className="block text-[12px] font-semibold mb-1.5 text-stone-900">
                            {req.is_responded ? 'Update Response' : 'Write a Response'} *
                        </label>
                        <textarea
                            value={data.admin_response}
                            onChange={e => setData('admin_response', e.target.value)}
                            rows={3}
                            placeholder="Dear family, we are praying for you…"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] border outline-none resize-y leading-relaxed mb-2.5 text-stone-900 bg-amber-50 focus:border-amber-500 ${errors.admin_response ? 'border-rose-500' : 'border-stone-200'}`}
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        />
                        {errors.admin_response && (
                            <p className="text-[11px] mb-2 text-rose-500">{errors.admin_response}</p>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-opacity disabled:opacity-50 bg-emerald-600 text-white"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                <Send size={12} />
                                {processing ? 'Saving…' : 'Send Response'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { reset(); onCancelRespond(); }}
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-[12px] border border-stone-200 cursor-pointer transition-colors hover:bg-stone-50 bg-amber-50 text-stone-400"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                <X size={12} />
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        type="button"
                        onClick={onStartRespond}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold border cursor-pointer transition-colors hover:bg-stone-50 bg-transparent ${req.is_responded ? 'border-stone-200 text-stone-400' : 'border-amber-500 text-amber-500'}`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {req.is_responded
                            ? <><Pencil size={12} /> Edit Response</>
                            : <><HeartHandshake size={12} /> Respond</>
                        }
                    </button>
                )}
            </div>
        </div>
    );
}