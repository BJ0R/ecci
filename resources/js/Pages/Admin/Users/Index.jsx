// resources/js/Pages/Admin/Users/Index.jsx
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { UserCheck, UserX, Clock, GraduationCap, Users, Plus, X, Trash2 } from 'lucide-react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    FlashMessage, PageEyebrow, Pagination,
    TableHeader, TableCell, FormGroup, FieldInput, SubmitButton,
} from '@/Pages/Admin/Dashboard';

export default function UsersIndex({ families, teachers }) {
    const { flash } = usePage().props;
    const [tab, setTab]             = useState('families');
    const [confirmAction, setConfirmAction] = useState(null);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [deletingTeacherId, setDeletingTeacherId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    function doAction() {
        const { type, userId } = confirmAction;
        const url = type === 'approve'
            ? `/admin/users/${userId}/approve`
            : `/admin/users/${userId}/suspend`;
        router.put(url, {}, { onSuccess: () => setConfirmAction(null) });
    }

    function submitTeacher(e) {
        e.preventDefault();
        post('/admin/teachers', {
            onSuccess: () => { reset(); setShowTeacherForm(false); },
        });
    }

    function deleteTeacher() {
        router.delete(`/admin/teachers/${deletingTeacherId}`, {
            onSuccess: () => setDeletingTeacherId(null),
        });
    }

    const pendingCount = families.data?.filter(f => !f.is_approved).length ?? 0;

    return (
        <AdminLayout title="Users">
            <Head title="User Management — ECCII Admin" />
            <FlashMessage flash={flash} />

            <PageEyebrow
                label="People"
                title="User Management"
                desc="Manage family accounts and teacher accounts."
            />

            {/* ── Tabs ─────────────────────────────────────────────── */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit bg-stone-100">
                {[
                    { key: 'families', label: 'Families', icon: Users,         count: families.meta?.total ?? families.data?.length ?? 0 },
                    { key: 'teachers', label: 'Teachers', icon: GraduationCap, count: teachers.meta?.total ?? teachers.data?.length ?? 0 },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12.5px] font-semibold border-none cursor-pointer transition-all ${
                            tab === t.key
                                ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-400 hover:text-stone-700'
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <t.icon size={14} />
                        {t.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.key ? 'bg-amber-100 text-amber-600' : 'bg-stone-200 text-stone-400'}`}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ════════════════════════════════════════════════════════
                FAMILIES TAB
            ════════════════════════════════════════════════════════ */}
            {tab === 'families' && (
                <>
                    {pendingCount > 0 && (
                        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-amber-300 mb-5 text-[13px] bg-amber-100 text-amber-600">
                            <Clock size={15} className="flex-shrink-0" />
                            <span>
                                <strong>{pendingCount} {pendingCount === 1 ? 'family' : 'families'}</strong> waiting for account approval.
                            </span>
                        </div>
                    )}

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
                                    <tr key={family.id} className="transition-colors duration-100 hover:bg-amber-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold bg-amber-500 text-stone-900">
                                                    {(family.family_name || family.name).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-[13px] text-stone-900">{family.family_name || family.name}</div>
                                                    <div className="text-[11px] text-stone-400">{family.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell muted>{family.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {family.child_profiles?.map(c => (
                                                    <span key={c.id} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-500">
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
                                            <div className="flex items-center gap-1.5">
                                                {!family.is_approved ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'approve', userId: family.id, userName: family.family_name || family.name })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer hover:opacity-75 bg-emerald-50 text-emerald-600"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        <UserCheck size={12} />
                                                        Approve
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'suspend', userId: family.id, userName: family.family_name || family.name })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer hover:opacity-75 bg-rose-50 text-rose-500"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        <UserX size={12} />
                                                        Suspend
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/users/${family.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold no-underline border border-stone-200 bg-stone-50 text-stone-900 hover:bg-stone-100"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={families.links ?? []} />
                </>
            )}

            {/* ════════════════════════════════════════════════════════
                TEACHERS TAB
            ════════════════════════════════════════════════════════ */}
            {tab === 'teachers' && (
                <>
                    {/* Add teacher form toggle */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowTeacherForm(s => !s)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-80 ${showTeacherForm ? 'bg-stone-100 text-stone-900' : 'bg-stone-900 text-amber-50'}`}
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {showTeacherForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Teacher</>}
                        </button>
                    </div>

                    {/* Inline create form */}
                    {showTeacherForm && (
                        <div className="rounded-[14px] border border-stone-200 bg-white p-5 mb-6">
                            <div className="text-[18px] font-bold mb-4 text-stone-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                Create Teacher Account
                            </div>
                            <form onSubmit={submitTeacher}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <FormGroup label="Full Name *" error={errors.name}>
                                        <FieldInput value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Maria Santos" error={errors.name} />
                                    </FormGroup>
                                    <FormGroup label="Email *" error={errors.email}>
                                        <FieldInput value={data.email} onChange={e => setData('email', e.target.value)} type="email" placeholder="teacher@church.org" error={errors.email} />
                                    </FormGroup>
                                    <FormGroup label="Password *" error={errors.password}>
                                        <FieldInput value={data.password} onChange={e => setData('password', e.target.value)} type="password" placeholder="Min. 8 characters" error={errors.password} />
                                    </FormGroup>
                                    <FormGroup label="Confirm Password *" error={errors.password_confirmation}>
                                        <FieldInput value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} type="password" placeholder="Repeat password" error={errors.password_confirmation} />
                                    </FormGroup>
                                </div>
                                <div className="mt-2">
                                    <SubmitButton processing={processing}>Create Teacher Account</SubmitButton>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="rounded-[14px] border border-stone-200 bg-white overflow-x-auto">
                        <table className="w-full border-collapse">
                            <TableHeader columns={['Teacher', 'Email', 'Status', 'Joined', 'Actions']} />
                            <tbody>
                                {(!teachers.data || teachers.data.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-[13px] text-stone-400">
                                            No teachers yet. Click "Add Teacher" to create one.
                                        </td>
                                    </tr>
                                )}
                                {teachers.data?.map(teacher => (
                                    <tr key={teacher.id} className="transition-colors duration-100 hover:bg-amber-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold bg-stone-900 text-amber-400">
                                                    {teacher.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="font-semibold text-[13px] text-stone-900">{teacher.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell muted>{teacher.email}</TableCell>
                                        <TableCell>
                                            <Badge status={teacher.is_approved ? 'completed' : 'pending'} size="xs">
                                                {teacher.is_approved ? 'Active' : 'Suspended'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell mono muted>
                                            {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {teacher.is_approved ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'suspend', userId: teacher.id, userName: teacher.name })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer hover:opacity-75 bg-rose-50 text-rose-500"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        <UserX size={12} />
                                                        Suspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'approve', userId: teacher.id, userName: teacher.name })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer hover:opacity-75 bg-emerald-50 text-emerald-600"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        <UserCheck size={12} />
                                                        Reactivate
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setDeletingTeacherId(teacher.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer hover:opacity-75 bg-stone-100 text-stone-500"
                                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                                >
                                                    <Trash2 size={11} />
                                                    Remove
                                                </button>
                                            </div>
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={teachers.links ?? []} />
                </>
            )}

            {/* Confirm approve/suspend modal */}
            <Modal
                open={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                title={confirmAction?.type === 'approve' ? 'Approve Account?' : 'Suspend Account?'}
                confirmLabel={confirmAction?.type === 'approve' ? 'Yes, Approve' : 'Yes, Suspend'}
                confirmVariant={confirmAction?.type === 'approve' ? 'gold' : 'danger'}
                onConfirm={doAction}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    {confirmAction?.type === 'approve'
                        ? <>Approve <strong>{confirmAction?.userName}</strong>? They will be able to log in immediately.</>
                        : <>Suspend <strong>{confirmAction?.userName}</strong>? They will be locked out until reactivated.</>
                    }
                </p>
            </Modal>

            {/* Confirm delete teacher modal */}
            <Modal
                open={!!deletingTeacherId}
                onClose={() => setDeletingTeacherId(null)}
                title="Remove Teacher?"
                confirmLabel="Yes, Remove"
                confirmVariant="danger"
                onConfirm={deleteTeacher}
            >
                <p className="text-[14px] leading-relaxed text-stone-600">
                    Permanently remove this teacher account? This cannot be undone.
                </p>
            </Modal>
        </AdminLayout>
    );
}