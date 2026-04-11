import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const initialState = { user: null, token: localStorage.getItem('token'), loading: true };

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload?.token) localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload, token: action.payload?.token, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, token: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return; }
    try {
      const user = await api.auth.me();
      dispatch({ type: 'LOGIN', payload: { ...user, token } });
    } catch {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const data = await api.auth.login(email, password);
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  }, []);

  const register = useCallback(async (body) => {
    const data = await api.auth.register(body);
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const updateProfile = useCallback(async (body) => {
    const user = await api.auth.updateProfile(body);
    dispatch({ type: 'SET_USER', payload: user });
    return user;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loadUser, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
