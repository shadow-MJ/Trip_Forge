import { useEffect, useState } from 'react';
import * as authApi from '../api/authApi';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    hydrateSession();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(credentials) {
    const { user: loggedInUser } = await authApi.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(payload) {
    const { user: createdUser } = await authApi.register(payload);
    setUser(createdUser);
    return createdUser;
  }

  async function updateProfile(updates) {
    if (!user) return null;
    const updatedUser = await authApi.updateProfile(user.id, updates);
    setUser(updatedUser);
    return updatedUser;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
