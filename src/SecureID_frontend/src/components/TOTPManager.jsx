import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SecureID_backend } from '../../../declarations/SecureID_backend';
import { generateTOTP, getTimeRemaining } from '../utils/totp';
import { copyToClipboard } from '../utils/clipboard';

const TOTPManager = () => {
  const { identity } = useAuth();
  const [totps, setTotps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  });
  const [editingId, setEditingId] = useState(null);
  const [totpCodes, setTotpCodes] = useState({});

  // Load TOTPs on mount
  useEffect(() => {
    loadTOTPs();
  }, []);

  // Generate TOTP codes every second
  useEffect(() => {
    const interval = setInterval(() => {
      generateTOTPCodes();
    }, 1000);
    return () => clearInterval(interval);
  }, [totps]);

  const loadTOTPs = async () => {
    try {
      setLoading(true);
      const result = await SecureID_backend.getTOTPs();
      
      // Convert BigInt fields to numbers for JavaScript compatibility
      const processedTotps = result.map(totp => ({
        ...totp,
        id: Number(totp.id),
        digits: Number(totp.digits),
        period: Number(totp.period),
        created: Number(totp.created),
        updated: Number(totp.updated)
      }));
      
      setTotps(processedTotps);
    } catch (error) {
      console.error('Error loading TOTPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTOTPCodes = async () => {
    const codes = {};
    
    // Generate codes for all TOTPs concurrently
    const promises = totps.map(async (totp) => {
      try {
        const code = await generateTOTP(totp.secret, totp.period, totp.digits);
        const timeLeft = getTimeRemaining(totp.period);
        return { id: totp.id, code, timeLeft };
      } catch (error) {
        console.error('Error generating TOTP for', totp.name, ':', error);
        return { id: totp.id, code: '------', timeLeft: 0 };
      }
    });
    
    const results = await Promise.all(promises);
    results.forEach(result => {
      codes[result.id] = { code: result.code, timeLeft: result.timeLeft };
    });
    
    setTotpCodes(codes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await SecureID_backend.updateTOTP(
          Number(editingId),
          formData.name,
          formData.issuer,
          formData.secret,
          formData.algorithm,
          Number(formData.digits),
          Number(formData.period)
        );
      } else {
        await SecureID_backend.createTOTP(
          formData.name,
          formData.issuer,
          formData.secret,
          formData.algorithm,
          Number(formData.digits),
          Number(formData.period)
        );
      }
      
      setFormData({ name: '', issuer: '', secret: '', algorithm: 'SHA1', digits: 6, period: 30 });
      setShowForm(false);
      setEditingId(null);
      loadTOTPs();
    } catch (error) {
      console.error('Error saving TOTP:', error);
    }
  };

  const handleEdit = (totp) => {
    setFormData({
      name: totp.name,
      issuer: totp.issuer,
      secret: totp.secret,
      algorithm: totp.algorithm,
      digits: Number(totp.digits),
      period: Number(totp.period)
    });
    setEditingId(Number(totp.id));
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this TOTP?')) return;
    
    try {
      await SecureID_backend.deleteTOTP(Number(id));
      loadTOTPs();
    } catch (error) {
      console.error('Error deleting TOTP:', error);
    }
  };

  const parseOTPAuthURL = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'otpauth:') {
        throw new Error('Invalid protocol');
      }
      
      const params = new URLSearchParams(urlObj.search);
      const pathParts = urlObj.pathname.split('/');
      const label = decodeURIComponent(pathParts[pathParts.length - 1]);
      
      setFormData({
        name: label,
        issuer: params.get('issuer') || '',
        secret: params.get('secret') || '',
        algorithm: params.get('algorithm') || 'SHA1',
        digits: Number(params.get('digits')) || 6,
        period: Number(params.get('period')) || 30
      });
    } catch (error) {
      alert('Invalid OTP Auth URL. Please check the format.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-large"></div>
        <p className="text-white ml-4">Loading TOTP codes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">TOTP Authenticator</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Add TOTP
        </button>
      </div>

      {/* TOTP Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit TOTP' : 'Add New TOTP'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', issuer: '', secret: '', algorithm: 'SHA1', digits: 6, period: 30 });
                }}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                OTP Auth URL (optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="text"
                  placeholder="otpauth://totp/..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousElementSibling || e.target.parentElement.querySelector('input');
                    const url = input.value;
                    if (url) parseOTPAuthURL(url);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl transition-colors"
                >
                  Parse URL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Google Account"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Issuer</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Google"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Secret Key</label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Base32 encoded secret"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Algorithm</label>
                <select
                  value={formData.algorithm}
                  onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="SHA1">SHA1</option>
                  <option value="SHA256">SHA256</option>
                  <option value="SHA512">SHA512</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Digits</label>
                <select
                  value={formData.digits}
                  onChange={(e) => setFormData({ ...formData, digits: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Period (seconds)</label>
                <input
                  type="number"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="300"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                {editingId ? 'Update TOTP' : 'Save TOTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', issuer: '', secret: '', algorithm: 'SHA1', digits: 6, period: 30 });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* TOTP List */}
      <div className="space-y-4">
        {totps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No TOTP codes saved yet</p>
            <p className="text-white/40 text-sm mt-2">Click "Add TOTP" to get started</p>
          </div>
        ) : (
          totps.map((totp) => (
            <div
              key={totp.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{totp.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{totp.issuer}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-black/20 rounded-xl px-4 py-2">
                      <div className="text-3xl font-mono text-white tracking-wider">
                        {totpCodes[totp.id]?.code || '------'}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-white/60 text-sm">Time left</div>
                      <div className="text-white font-bold">
                        {totpCodes[totp.id]?.timeLeft || 0}s
                      </div>
                      <div className="w-12 h-2 bg-white/20 rounded-full mt-1">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${((totpCodes[totp.id]?.timeLeft || 0) / Number(totp.period)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={async (event) => {
                      const code = totpCodes[totp.id]?.code || '';
                      
                      if (code && code !== '------') {
                        const success = await copyToClipboard(code);
                        
                        if (success) {
                          // Show success feedback
                          const button = event.target;
                          const originalText = button.textContent;
                          button.textContent = 'Copied!';
                          button.classList.add('bg-green-500/40');
                          setTimeout(() => {
                            button.textContent = originalText;
                            button.classList.remove('bg-green-500/40');
                          }, 1500);
                        }
                      }
                    }}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-xl transition-colors text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEdit(totp)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-xl transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(totp.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-xl transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TOTPManager;