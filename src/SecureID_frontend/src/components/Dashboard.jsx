import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SecureID_backend } from '../../../declarations/SecureID_backend';
import PasswordManager from './PasswordManager';
import TOTPManager from './TOTPManager';
import NotesManager from './NotesManager';

const Dashboard = () => {
  const { logout, principal } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [stats, setStats] = useState({
    totalPasswords: 0,
    totalTOTPs: 0,
    totalNotes: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [passwords, totps, notes] = await Promise.all([
        SecureID_backend.getPasswords(),
        SecureID_backend.getTOTPs(),
        SecureID_backend.getNotes()
      ]);
      
      setStats({
        totalPasswords: passwords.length,
        totalTOTPs: totps.length,
        totalNotes: notes.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const renderContent = () => {
    switch(currentView) {
      case 'passwords':
        return <PasswordManager />;
      case 'totp':
        return <TOTPManager />;
      case 'notes':
        return <NotesManager />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to SecureID</h2>
        <p className="text-white/80 text-lg">Your secure, decentralized identity management platform</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2M9 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2m8 12V9a2 2 0 00-2-2M5 21V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Password Manager</h3>
          <p className="text-white/70 mb-4">
            Store, organize, and manage all your passwords with military-grade encryption. 
            Generate secure passwords and check for compromised credentials.
          </p>
          <button 
            onClick={() => setCurrentView('passwords')}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
          >
            Manage Passwords
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">TOTP Authenticator</h3>
          <p className="text-white/70 mb-4">
            Generate time-based one-time passwords for two-factor authentication. 
            Secure your accounts with real-time 2FA codes.
          </p>
          <button 
            onClick={() => setCurrentView('totp')}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl transition-all duration-200 border border-green-500/30 hover:border-green-500/50"
          >
            View TOTP Codes
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Secure Notes</h3>
          <p className="text-white/70 mb-4">
            Store sensitive information like credit cards, bank details, and personal notes 
            with end-to-end encryption.
          </p>
          <button 
            onClick={() => setCurrentView('notes')}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50"
          >
            Manage Notes
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Security Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.totalPasswords}</div>
            <div className="text-white/70 text-sm">Saved Passwords</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.totalTOTPs}</div>
            <div className="text-white/70 text-sm">TOTP Codes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.totalNotes}</div>
            <div className="text-white/70 text-sm">Secure Notes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
            <div className="text-white/70 text-sm">Security Score</div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-blue-300 font-semibold text-sm">1</span>
            </div>
            <p className="text-white/80">Add your first password to get started with secure storage</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-green-300 font-semibold text-sm">2</span>
            </div>
            <p className="text-white/80">Set up TOTP codes for your most important accounts</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-purple-300 font-semibold text-sm">3</span>
            </div>
            <p className="text-white/80">Create secure notes for sensitive information</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentView('overview')}
                className="flex items-center hover:bg-white/10 rounded-lg p-2 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="ml-3 text-xl font-bold text-white">SecureID</h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button 
                  onClick={() => setCurrentView('passwords')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentView === 'passwords' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Passwords
                </button>
                <button 
                  onClick={() => setCurrentView('totp')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentView === 'totp' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  TOTP
                </button>
                <button 
                  onClick={() => setCurrentView('notes')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentView === 'notes' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Notes
                </button>
              </nav>
              
              <div className="text-right">
                <p className="text-white/80 text-sm">Logged in as:</p>
                <p className="text-white font-mono text-xs" title={principal}>
                  {principal ? `${principal.substring(0, 8)}...${principal.substring(principal.length - 4)}` : ''}
                </p>
              </div>
              <button 
                onClick={logout}
                className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;