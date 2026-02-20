import React, { useEffect, useState } from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function BillShow() {
    const { props } = usePage();
    const url = typeof window !== 'undefined' ? window.location.pathname : '';
    const id = url.split('/').pop();
    const [bill, setBill] = useState<any>(null);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [paidBy, setPaidBy] = useState('');
    const [splitType, setSplitType] = useState('equal');
    const [customSplits, setCustomSplits] = useState<Record<number, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestEmail, setNewGuestEmail] = useState('');
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [editExpenseName, setEditExpenseName] = useState('');
    const [editExpenseAmount, setEditExpenseAmount] = useState('');

    useEffect(() => { fetchBill(); }, []);

    function fetchBill() {
        fetch(`/api/bills/${id}`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                setBill(d.bill);
                if (d.bill?.host) {
                    setPaidBy(String(d.bill.host.id));
                }
            });
    }

    const searchUsers = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, { credentials: 'include' });
        const data = await res.json();
        setSearchResults(data.users || []);
    };

    const addParticipant = async (userId: number) => {
        await fetch(`/api/bills/${id}/participants`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'registered', user_id: userId })
        });
        setSearchQuery('');
        setSearchResults([]);
        fetchBill();
    };

    const addGuestParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`/api/bills/${id}/participants`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'guest', guest_name: newGuestName, guest_email: newGuestEmail })
        });
        setNewGuestName('');
        setNewGuestEmail('');
        setShowAddParticipant(false);
        fetchBill();
    };

    const removeParticipant = async (participantId: number) => {
        if (!confirm('Remove this participant?')) return;
        await fetch(`/api/bills/${id}/participants/${participantId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        fetchBill();
    };

    const addExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let splits = null;
        if (splitType === 'custom' && bill?.participants) {
            splits = customSplits;
        }

        await fetch(`/api/bills/${id}/expenses`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: expenseName,
                amount: expenseAmount,
                paid_by: paidBy,
                split_type: splitType,
                splits
            })
        });
        setExpenseName('');
        setExpenseAmount('');
        setSplitType('equal');
        setCustomSplits({});
        setShowAddExpense(false);
        fetchBill();
    };

    const updateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExpense) return;

        let splits = null;
        if (editingExpense.split_type === 'custom' && bill?.participants) {
            splits = customSplits;
        }

        await fetch(`/api/bills/${id}/expenses/${editingExpense.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: editExpenseName,
                amount: editExpenseAmount,
                split_type: editingExpense.split_type,
                splits
            })
        });
        setEditingExpense(null);
        setEditExpenseName('');
        setEditExpenseAmount('');
        fetchBill();
    };

    const deleteExpense = async (expenseId: number) => {
        if (!confirm('Delete this expense?')) return;
        await fetch(`/api/bills/${id}/expenses/${expenseId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        fetchBill();
    };

    const getAllParticipants = () => {
        if (!bill) return [];
        const participants: any[] = [];
        if (bill.host) {
            participants.push({ id: bill.host.id, name: bill.host.nickname || bill.host.name, is_host: true });
        }
        if (bill.participants) {
            bill.participants.forEach((p: any) => {
                if (p.user) {
                    participants.push({ id: p.user.id, name: p.user.nickname || p.user.name, is_host: false, participantId: p.id });
                } else {
                    participants.push({ id: p.id, name: p.guest_name || p.guest_email, is_host: false, is_guest: true, participantId: p.id });
                }
            });
        }
        return participants;
    };

    if (!bill) return <div className="min-h-screen bg-slate-900 p-6 text-white">Loading...</div>;

    const allParticipants = getAllParticipants();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/bills" className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Bills
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{bill.name || 'Untitled'}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg">
                                    Code: {bill.code}
                                </span>
                                {bill.archived && (
                                    <span className="text-sm bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">
                                        Archived
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddParticipant(true)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                + Add Person
                            </button>
                            <button
                                onClick={() => setShowAddExpense(true)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
                            >
                                + Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Participants */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                        <h2 className="text-xl font-bold text-white mb-4">Participants</h2>
                        {allParticipants.length === 0 ? (
                            <p className="text-white/60">No participants yet</p>
                        ) : (
                            <div className="space-y-2">
                                {allParticipants.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-emerald-400 text-sm font-medium">
                                                    {p.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{p.name}</p>
                                                <p className="text-white/50 text-xs">
                                                    {p.is_host ? 'Host' : p.is_guest ? 'Guest' : 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                        {!p.is_host && (
                                            <button
                                                onClick={() => removeParticipant(p.participantId)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expenses */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                        <h2 className="text-xl font-bold text-white mb-4">Expenses</h2>
                        {(!bill.expenses || bill.expenses.length === 0) ? (
                            <p className="text-white/60">No details</p>
                        ) : (
                            <div className="space-y-3">
                                {bill.expenses.map((expense: any) => (
                                    <div key={expense.id} className="bg-white/5 rounded-lg px-4 py-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-white font-medium">{expense.name}</p>
                                                <p className="text-emerald-400 font-bold">${expense.amount}</p>
                                                <p className="text-white/50 text-xs mt-1">
                                                    Paid by: {expense.payer?.nickname || expense.payer?.name || 'Unknown'} • 
                                                    {expense.split_type === 'equal' ? ' Split equally' : ' Custom split'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingExpense(expense);
                                                        setEditExpenseName(expense.name);
                                                        setEditExpenseAmount(expense.amount);
                                                    }}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteExpense(expense.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Total */}
                        {bill.expenses?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-emerald-400 font-bold text-xl">
                                        ${bill.expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Participant Modal */}
            {showAddParticipant && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add Participant</h2>
                        
                        {/* Search Users */}
                        <div className="mb-4">
                            <label className="text-white/80 text-sm mb-2 block">Search Registered Users</label>
                            <input
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                placeholder="Search by name, email, or username..."
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                            />
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-white/5 rounded-lg max-h-40 overflow-y-auto">
                                    {searchResults.map((user: any) => (
                                        <button
                                            key={user.id}
                                            onClick={() => addParticipant(user.id)}
                                            className="w-full text-left px-4 py-2 text-white hover:bg-white/10 flex items-center gap-2"
                                        >
                                            <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">
                                                {user.nickname?.charAt(0).toUpperCase()}
                                            </span>
                                            <div>
                                                <p className="font-medium">{user.nickname || user.name}</p>
                                                <p className="text-white/50 text-xs">{user.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 my-4 pt-4">
                            <p className="text-white/60 text-sm mb-3">Or add a guest:</p>
                            <form onSubmit={addGuestParticipant}>
                                <input
                                    value={newGuestName}
                                    onChange={(e) => setNewGuestName(e.target.value)}
                                    placeholder="Guest name"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-emerald-500"
                                />
                                <input
                                    value={newGuestEmail}
                                    onChange={(e) => setNewGuestEmail(e.target.value)}
                                    placeholder="Guest email"
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg py-2 font-medium"
                                >
                                    Add Guest
                                </button>
                            </form>
                        </div>

                        <button
                            onClick={() => setShowAddParticipant(false)}
                            className="w-full mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Expense Modal */}
            {showAddExpense && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add Expense</h2>
                        <form onSubmit={addExpense}>
                            <div className="mb-3">
                                <label className="text-white/80 text-sm mb-1 block">Expense Name</label>
                                <input
                                    value={expenseName}
                                    onChange={(e) => setExpenseName(e.target.value)}
                                    placeholder="e.g., Dinner, Taxi"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-white/80 text-sm mb-1 block">Amount</label>
                                <input
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-white/80 text-sm mb-1 block">Paid By</label>
                                <select
                                    value={paidBy}
                                    onChange={(e) => setPaidBy(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                    required
                                >
                                    <option value="">Select person</option>
                                    {allParticipants.map((p, idx) => (
                                        <option key={idx} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="text-white/80 text-sm mb-1 block">Split Type</label>
                                <select
                                    value={splitType}
                                    onChange={(e) => setSplitType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="equal">Equally divided</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddExpense(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Expense Modal */}
            {editingExpense && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Expense</h2>
                        <form onSubmit={updateExpense}>
                            <div className="mb-3">
                                <label className="text-white/80 text-sm mb-1 block">Expense Name</label>
                                <input
                                    value={editExpenseName}
                                    onChange={(e) => setEditExpenseName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-white/80 text-sm mb-1 block">Amount</label>
                                <input
                                    value={editExpenseAmount}
                                    onChange={(e) => setEditExpenseAmount(e.target.value)}
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingExpense(null)}
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
