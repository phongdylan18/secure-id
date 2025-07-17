import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  principal: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  // Internet Identity provider URL for local development
  const identityProvider = process.env.DFX_NETWORK === 'ic' 
    ? 'https://identity.ic0.app'
    : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`;

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal().toString());
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      
      await authClient.login({
        identityProvider,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setIsAuthenticated(true);
          setPrincipal(identity.getPrincipal().toString());
          console.log('Login successful, Principal:', identity.getPrincipal().toString());
        },
        onError: (error) => {
          console.error('Login failed:', error);
        },
        // Customize login window
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    identity,
    login,
    logout,
    loading,
    principal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};