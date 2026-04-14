import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api/axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/withdrawals').then(res => {
      // Combine deposits and withdrawals (in real app, fetch both)
      setTransactions(res.data);
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  if (loading) return <div className="text-center py-20">Loading transactions...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr><th className="text-left p-4">Type</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id} className="border-b border-white/5">
                <td className="p-4 flex items-center gap-2">{tx.type === 'DEPOSIT' ? <ArrowUpRight className="text-green-500" size={16} /> : <ArrowDownRight className="text-red-500" size={16} />}{tx.type}</td>
                <td>${tx.amount}</td>
                <td><span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{tx.status}</span></td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {transactions.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
