import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, CheckCircle, AlertCircle, FileText, UserCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

export default function Kyc() {
  const { user, updateBalance } = useAuthStore();
  const navigate = useNavigate();
  const [idFile, setIdFile] = useState(null);
  const [ssn, setSsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleIdUpload = (e) => {
    setIdFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile) {
      setError('Please upload your ID document');
      return;
    }
    if (!ssn || ssn.length < 4) {
      setError('Please enter a valid SSN (last 4 digits or full)');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    const formData = new FormData();
    formData.append('kycDocument', idFile);
    formData.append('ssn', ssn);
    try {
      await api.post('/user/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('KYC documents submitted successfully. Admin will review.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-gold w-8 h-8" />
            <h1 className="text-3xl font-black">KYC Verification</h1>
          </div>
          <p className="text-gray-400 mb-8">To comply with regulations, please verify your identity. Your information is encrypted and secure.</p>
          
          {user?.kycStatus === 'VERIFIED' && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 flex items-center gap-3 mb-6">
              <CheckCircle /> Your identity is verified.
            </div>
          )}
          {user?.kycStatus === 'PENDING' && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 flex items-center gap-3 mb-6">
              <AlertCircle /> Your verification is pending review.
            </div>
          )}
          {user?.kycStatus === 'REJECTED' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3 mb-6">
              <AlertCircle /> Your verification was rejected. Please resubmit.
            </div>
          )}

          {(user?.kycStatus === 'PENDING' || user?.kycStatus === 'VERIFIED') ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
              <p className="text-lg">Your KYC status is <strong>{user?.kycStatus}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Government ID (Passport/Driver's License)</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-gold/50 transition">
                  <input type="file" accept="image/*,application/pdf" onChange={handleIdUpload} className="hidden" id="idUpload" />
                  <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="text-gold w-8 h-8" />
                    <span>{idFile ? idFile.name : 'Click to upload ID'}</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Social Security Number (SSN)</label>
                <input type="text" value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="XXX-XX-1234" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold" />
                <p className="text-xs text-gray-500 mt-1">We only store the last 4 digits for verification.</p>
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">{error}</div>}
              {message && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">{message}</div>}
              <button type="submit" disabled={loading} className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition">
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
