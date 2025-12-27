import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // We hardcode the user as "Logged In" so the white screen disappears.
  const [user] = useState({ id: '123', email: 'marcus@gearguard.io' });
  const [session] = useState({ user: { id: '123' } });

  return (
    <AuthContext.Provider value={{ 
      user, session, loading: false, 
      signIn: async () => ({ error: null }), 
      signUp: async () => ({ error: null }), 
      signOut: async () => {} 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}