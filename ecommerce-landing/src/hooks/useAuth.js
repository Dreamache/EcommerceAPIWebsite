import { useState, useEffect } from 'react';
import { auth } from '../api.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }
    auth.me().then(setUser).catch(() => { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); }).finally(() => setLoading(false));
  }, []);

  return {
    user, loading,
    login: (userData) => setUser(userData),
    logout: async () => { await auth.logout().catch(() => {}); setUser(null); },
  };
}
