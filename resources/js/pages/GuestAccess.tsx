import React, { useState } from 'react';

export default function GuestAccess(){
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [bill, setBill] = useState<any>(null);
    const [error, setError] = useState('');

    async function search(e: React.FormEvent){
        e.preventDefault();
        setError(''); setBill(null);
        try{
            const url = `/api/bills/code/${code}` + (email ? `?email=${encodeURIComponent(email)}` : '');
            const res = await fetch(url);
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setBill(data.bill);
        }catch(err:any){ setError('Bill not found or invalid code'); }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Guest access</h1>
            <form onSubmit={search} className="mb-4">
                <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter invitation code" className="border p-2 mr-2" />
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email (optional)" className="border p-2 mr-2" />
                <button className="bg-blue-600 text-white px-3 py-2">Search</button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            {bill && (
                <div>
                    <h2 className="text-xl">{bill.name} <span className="text-sm text-gray-500">({bill.code})</span></h2>
                    <div className="mt-4">{(!bill.expenses || bill.expenses.length===0) ? <div className="text-gray-500">No details</div> : (
                        <ul>{bill.expenses.map((ex:any)=>(<li key={ex.id}>{ex.name} — {ex.amount}</li>))}</ul>
                    )}</div>
                </div>
            )}
        </div>
    );
}
