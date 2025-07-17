import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="spinner-large"></div>
          <p className="text-white text-lg mt-4">Initializing SecureID...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">SecureID</h1>
            <p className="text-white/80 text-lg">Your decentralized identity vault</p>
          </div>

          {/* Features Preview */}
          <div className="mb-8 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2M9 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2m8 12V9a2 2 0 00-2-2M5 21V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Password Manager</h3>
                <p className="text-white/70 text-sm">Securely store and manage all your passwords</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">TOTP Authenticator</h3>
                <p className="text-white/70 text-sm">Generate 2FA codes for enhanced security</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Secure Notes</h3>
                <p className="text-white/70 text-sm">Store sensitive information safely</p>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-white text-lg font-semibold mb-2">Get Started</h2>
              <p className="text-white/70 text-sm">
                Sign in with Internet Identity to access your secure vault
              </p>
            </div>

            <button 
              onClick={login}
              disabled={loading}
              className="w-full bg-white/15 hover:bg-white/25 border-2 border-white/30 hover:border-white/50 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner-small mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2M9 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V9a2 2 0 00-2-2m8 12V9a2 2 0 00-2-2M5 21V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Sign in with Internet Identity
                </div>
              )}
            </button>

            {/* Info Section */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What is Internet Identity?
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Internet Identity is a secure, passwordless authentication system built on the Internet Computer. 
                It uses biometrics or security keys to sign you in safely.
              </p>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white/80 text-xs font-medium">End-to-End Encrypted</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <p className="text-white/80 text-xs font-medium">Decentralized</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">Built on the Internet Computer</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;