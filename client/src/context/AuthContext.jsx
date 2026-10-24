import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore the session from a saved token
  useEffect(() => {
    const token = localStorage.getItem('imovies_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('imovies_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }) => {
    localStorage.setItem('imovies_token', token);
    setUser(user);
  };

  const login = async (email, password) => handleAuth((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) =>
    handleAuth((await api.post('/auth/register', { name, email, password })).data);
  const logout = () => {
    localStorage.removeItem('imovies_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}
