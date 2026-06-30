"use client";

import { useState, useEffect } from "react";
import { DashboardUser } from "@/lib/api/protected";
import {
    adminGetUsersClient,
    adminCreateUserClient,
    adminUpdateUserClient,
    adminDeleteUserClient
} from "@/lib/api/client-protected";
import UserForm from "./UserForm";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function AdminUsersClient() {
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const loadUsers = async (page: number = 1, searchTerm: string = "") => {
        try {
            setLoading(true);
            const res = await adminGetUsersClient(page, 10, searchTerm);
            setUsers(res.data);
            setMeta(res.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(1, search);
    }, [search]);

    const handleCreate = async (userData: any) => {
        try {
            await adminCreateUserClient(userData);
            setShowCreateModal(false);
            loadUsers(meta.page, search);
        } catch (err: any) {
            alert(err.message || "Failed to create user");
        }
    };

    const handleUpdate = async (userData: any) => {
        if (!editingUser) return;
        try {
            await adminUpdateUserClient(editingUser._id, userData);
            setEditingUser(null);
            loadUsers(meta.page, search);
        } catch (err: any) {
            alert(err.message || "Failed to update user");
        }
    };

    const handleDelete = async () => {
        if (!deletingUserId) return;
        try {
            await adminDeleteUserClient(deletingUserId);
            setDeletingUserId(null);
            loadUsers(meta.page, search);
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        }
    };

    const handlePageChange = (newPage: number) => {
        loadUsers(newPage, search);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-medium text-sage-600">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">
                        User Management
                    </h1>
                    <p className="mt-2 max-w-2xl text-gray-600">
                        View, create, edit, and delete users in the system.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-full bg-sage-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sage-700 transition-colors"
                >
                    Create User
                </button>
            </div>

            <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            className="w-full rounded-full border border-sage-200 bg-sage-50 px-5 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        {meta.total} user{meta.total !== 1 ? "s" : ""} total
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm text-gray-600">No users found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-2xl border border-sage-100">
                            <table className="w-full">
                                <thead className="bg-sage-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Created At
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sage-100">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-sage-50">
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap font-mono">
                                                {user._id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-800">
                                                        {(user.firstName[0] || user.username[0]).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            @{user.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    user.role === "admin"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-sage-100 text-sage-800"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="rounded-full px-4 py-2 text-sm font-medium text-sage-700 hover:bg-sage-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingUserId(user._id)}
                                                        className="rounded-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page <= 1}
                                className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="text-sm text-gray-600">
                                Page {meta.page} of {meta.totalPages}
                            </div>
                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages}
                                className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {(showCreateModal || editingUser) && (
                <UserForm
                    user={editingUser}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingUser(null);
                    }}
                    onSubmit={editingUser ? handleUpdate : handleCreate}
                />
            )}

            {deletingUserId && (
                <DeleteConfirmModal
                    onClose={() => setDeletingUserId(null)}
                    onConfirm={handleDelete}
                />
            )}
        </main>
    );
}
