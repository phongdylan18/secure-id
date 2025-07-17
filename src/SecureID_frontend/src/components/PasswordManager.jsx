import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SecureID_backend } from '../../../declarations/SecureID_backend';
import PasswordInput from './PasswordInput';
import { copyToClipboard } from '../utils/clipboard';

const PasswordManager = () => {
  const { identity } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    website: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load passwords on mount
  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      setLoading(true);
      const result = await SecureID_backend.getPasswords();
      setPasswords(result);
    } catch (error) {
      console.error('Error loading passwords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await SecureID_backend.updatePassword(
          editingId,
          formData.name,
          formData.username,
          formData.password,
          formData.website,
          formData.notes
        );
      } else {
        await SecureID_backend.createPassword(
          formData.name,
          formData.username,
          formData.password,
          formData.website,
          formData.notes
        );
      }
      
      setFormData({ name: '', username: '', password: '', website: '', notes: '' });
      setShowForm(false);
      setEditingId(null);
      loadPasswords();
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const handleEdit = (password) => {
    setFormData({
      name: password.name,
      username: password.username,
      password: password.password,
      website: password.website,
      notes: password.notes
    });
    setEditingId(password.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this password?')) return;
    
    try {
      await SecureID_backend.deletePassword(id);
      loadPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-large"></div>
        <p className="text-white ml-4">Loading passwords...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Password Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Add Password
        </button>
      </div>

      {/* Password Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Password' : 'Add New Password'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', username: '', password: '', website: '', notes: '' });
                }}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Gmail Account"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://gmail.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <div className="flex">
                    <PasswordInput
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-r-xl transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  {editingId ? 'Update Password' : 'Save Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', username: '', password: '', website: '', notes: '' });
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

      {/* Password List */}
      <div className="space-y-4">
        {passwords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No passwords saved yet</p>
            <p className="text-white/40 text-sm mt-2">Click "Add Password" to get started</p>
          </div>
        ) : (
          passwords.map((password) => (
            <div
              key={password.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{password.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/60">Username:</span>
                        <span className="text-white ml-2">{password.username}</span>
                      </div>
                      <button
                        onClick={async (event) => {
                          const success = await copyToClipboard(password.username);
                          
                          if (success) {
                            const button = event.target;
                            const originalText = button.textContent;
                            button.textContent = '✓';
                            setTimeout(() => {
                              button.textContent = originalText;
                            }, 1000);
                          }
                        }}
                        className="text-white/40 hover:text-white/70 text-xs px-2 py-1 rounded transition-colors"
                      >
                        📋
                      </button>
                    </div>
                    <div>
                      <span className="text-white/60">Website:</span>
                      <a
                        href={password.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 ml-2"
                      >
                        {password.website}
                      </a>
                    </div>
                  </div>
                  {password.notes && (
                    <div className="mt-3">
                      <span className="text-white/60 text-sm">Notes:</span>
                      <p className="text-white/80 text-sm mt-1">{password.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={async (event) => {
                      const success = await copyToClipboard(password.password);
                      
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
                    }}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-xl transition-colors text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEdit(password)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-xl transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(password.id)}
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

export default PasswordManager;