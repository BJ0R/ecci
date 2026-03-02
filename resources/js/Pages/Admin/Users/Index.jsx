import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    TableHeader, TableCell,
} from '@/Pages/Admin/Dashboard';

export default function UsersIndex({ families }) {
    const { flash } = usePage().props;
    const [confirmAction, setConfirmAction] = useState(null);

    function doAction() {
        const { type, userId } = confirmAction;
        const url = type === 'approve' ? `/admin/users/${userId}/approve` : `/admin/users/${userId}/suspend`;
        router.put(url, {}, { onSuccess: () => setConfirmAction(null) });
    }

    const pendingCount = families.data?.filter(f => !f.is_approved).length ?? 0;

    return (
        <AdminLayout title="Families">
            <Head title="Families — ECCII Admin" />
            <FlashMessage flash={flash} />

            <PageEyebrow
                label="People"
                title="Family Accounts"
                desc={`${families.meta?.total ?? families.data?.length ?? 0} registered families`}
            />

            {/* Pending approval banner */}
            {pendingCount > 0 && (
                <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-amber-300 mb-5 text-[13px] bg-amber-100 text-amber-600">
                    <Clock size={15} className="flex-shrink-0" />
                    <span>
                        <strong>{pendingCount} {pendingCount === 1 ? 'family' : 'families'}</strong> waiting for account approval.
                    </span>
                </div>
            )}

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="rounded-[14px] border border-stone-200 bg-white overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHeader columns={['Family', 'Email', 'Children', 'Status', 'Joined', 'Actions']} />
                    <tbody>
                        {(!families.data || families.data.length === 0) && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-[13px] text-stone-400">
                                    No families registered yet.
                                </td>
                            </tr>
                        )}
                        {families.data?.map(family => (
                            <tr
                                key={family.id}
                                className="transition-colors duration-100 hover:bg-amber-50"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold bg-amber-500 text-stone-900">
                                            {(family.family_name || family.name).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[13px] text-stone-900">
                                                {family.family_name || family.name}
                                            </div>
                                            <div className="text-[11px] text-stone-400">{family.name}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell muted>{family.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {family.child_profiles?.map(c => (
                                            <span
                                                key={c.id}
                                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-500"
                                            >
                                                {c.name} ({c.age})
                                            </span>
                                        ))}
                                        {family.child_profiles_count === 0 && (
                                            <span className="text-[11px] italic text-stone-400">None yet</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge status={family.is_approved ? 'completed' : 'pending'} size="xs">
                                        {family.is_approved ? 'Approved' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell mono muted>
                                    {family.created_at ? new Date(family.created_at).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell>
                                    {!family.is_approved ? (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmAction({ type: 'approve', userId: family.id, userName: family.family_name || family.name })}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-opacity hover:opacity-75 bg-emerald-50 text-emerald-600"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <UserCheck size={12} />
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmAction({ type: 'suspend', userId: family.id, userName: family.family_name || family.name })}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-opacity hover:opacity-75 bg-rose-50 text-rose-500"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <UserX size={12} />
                                            Suspend
                                        </button>
                                    )}
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={families.links ?? []} />

            <Modal
                open={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                title={confirmAction?.type === 'approve' ? 'Approve Family?' : 'Suspend Family?'}
                confirmLabel={confirmAction?.type === 'approve' ? 'Yes, Approve' : 'Yes, Suspend'}
                confirmVariant={confirmAction?.type === 'approve' ? 'gold' : 'danger'}
                onConfirm={doAction}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    {confirmAction?.type === 'approve'
                        ? <>Approve <strong>{confirmAction?.userName}</strong>? They will be able to log in and access lesson content immediately.</>
                        : <>Suspend <strong>{confirmAction?.userName}</strong>? They will be logged out and unable to access lessons until re-approved.</>
                    }
                </p>
            </Modal>
        </AdminLayout>
    );
}