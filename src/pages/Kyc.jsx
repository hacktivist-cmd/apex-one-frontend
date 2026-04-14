import React, { useState } from 'react';
import { Upload, Shield, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

export default function Kyc() {
  const { user } = useAuthStore();
  const [idFile, setIdFile] = useState(null);
  const [ssn, setSsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile) return setError('Please upload ID document');
    if (!ssn || ssn.length < 4) return setError('Enter last 4 digits of SSN');
    setLoading(true);
    const formData = new FormData();
    formData.append('kycDocument', idFile);
    formData.append('ssn', ssn);
    try {
      await api.post('/user/kyc', formData);
      setMessage('KYC submitted. Admin will review.');
      setError('');
    } catch (err) { setError(err.response?.data?.message || 'Submission failed'); }
    finally { setLoading(false); }
  };

  if (user?.kycStatus === 'VERIFIED') return <div className="text-center py-20"><CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" /><p>Your identity is verified.</p></div>;
  if (user?.kycStatus === 'PENDING') return <div className="text-center py-20"><AlertCircle className="text-yellow-500 w-12 h-12 mx-auto mb-4" /><p>KYC pending review.</p></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">KYC Verification</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm mb-2">Government ID (Passport/Driver's License)</label><div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center"><input type="file" accept="image/*,application/pdf" onChange={e => setIdFile(e.target.files[0])} className="hidden" id="idUpload" /><label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-2"><Upload className="text-gold" /><span>{idFile ? idFile.name : 'Click to upload'}</span></label></div></div>
          <div><label className="block text-sm mb-2">SSN (last 4 digits)</label><input type="text" maxLength="4" value={ssn} onChange={e => setSsn(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" placeholder="1234" /></div>
          {error && <div className="p-3 bg-red-500/10 text-red-500 rounded">{error}</div>}
          {message && <div className="p-3 bg-green-500/10 text-green-500 rounded">{message}</div>}
          <button type="submit" disabled={loading} className="bg-gold text-black px-6 py-2 rounded-xl">Submit KYC</button>
        </form>
      </div>
    </div>
  );
}
