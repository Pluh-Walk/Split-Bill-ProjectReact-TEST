import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function BillsIndex() {
    const [bills, setBills] = useState<any[]>([]);
    const [archived, setArchived] = useState(false);
    const [name, setName] = useState('');
    const [editingBill, setEditingBill] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchBills();
    }, [archived]);

    function fetchBills() {
        fetch(`/api/bills?archived=${archived}`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => setBills(data.bills || []));
    }

    const createBill = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/bills', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (data.bill) {
            setBills((s) => [data.bill, ...s]);
            setName('');
            setShowAddModal(false);
        } else if (data.message) {
            alert(data.message);
        }
    };

    const updateBill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBill) return;
        
        const res = await fetch(`/api/bills/${editingBill.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editName }),
        });
        const data = await res.json();
        if (data.bill) {
            setBills((s) => s.map((b) => (b.id === editingBill.id ? data.bill : b)));
            setEditingBill(null);
            setEditName('');
        }
    };

    const deleteBill = async (id: number) => {
        if (!confirm('Are you sure you want to delete this bill?')) return;
        
        const res = await fetch(`/api/bills/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (res.ok) {
            setBills((s) => s.filter((b) => b.id !== id));
        }
    };

    const archiveBill = async (id: number) => {
        const res = await fetch(`/api/bills/${id}/archive`, {
            method: 'POST',
            credentials: 'include',
        });
        if (res.ok) {
            setBills((s) => s.filter((b) => b.id !== id));
        }
    };

    const regenerateCode = async (id: number) => {
        const res = await fetch(`/api/bills/${id}/regenerate-code`, {
            method: 'POST',
            credentials: 'include',
        });
        const data = await res.json();
        if (data.bill) {
            setBills((s) => s.map((b) => (b.id === id ? data.bill : b)));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {archived ? 'Archived Bills' : 'My Bills'}
                        </h1>
                        <p className="text-white/60 mt-1">
                            {archived ? 'View your archived bills' : 'Manage your split bills'}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => setArchived(!archived)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            {archived ? 'Active Bills' : 'View Archives'}
                        </button>
                        {!archived && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
                            >
                                + Create Bill
                            </button>
                        )}
                    </div>
                </div>

                {/* Bills Grid */}
                {bills.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-white/60 text-lg">{archived ? 'No archived bills yet' : 'No bills yet'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white truncate flex-1">
                                        {bill.name || 'Untitled'}
                                    </h3>
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded ml-2">
                                        {bill.code}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-white/60 mb-4">
                                    {bill.participants?.length || 0} participants • {bill.expenses?.length || 0} expenses
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={`/bills/${bill.id}`}
                                        className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-center rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View
                                    </Link>
                                    {!archived && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditingBill(bill);
                                                    setEditName(bill.name || '');
                                                }}
                                                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => archiveBill(bill.id)}
                                                className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm transition-colors"
                                            >
                                                Archive
                                            </button>
                                            <button
                                                onClick={() => regenerateCode(bill.id)}
                                                className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                                                title="Regenerate Code"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteBill(bill.id)}
                                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Bill Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Bill</h2>
                        <form onSubmit={createBill}>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Bill name"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Bill Modal */}
            {editingBill && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Bill</h2>
                        <form onSubmit={updateBill}>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Bill name"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingBill(null);
                                        setEditName('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
