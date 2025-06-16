import React, { createContext, useReducer, useEffect } from 'react';
import api from '../config/api';

// ... (keep initialState and AuthContext creation)
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
};
export const AuthContext = createContext(initialState);


// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    // ... (keep USER_LOADED, LOGIN_SUCCESS, etc.)
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null // Clear previous errors on success
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case 'CLEAR_ERRORS': // <-- ADD THIS NEW CASE
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ... (keep loadUser, login, register, logout actions)
  // Actions
  const loadUser = async () => {
    if (!localStorage.token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await api.get('/api/auth');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      // The useEffect in the component will handle navigation
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.response?.data?.msg || 'Login Failed' });
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL', payload: err.response?.data?.msg || 'Registration Failed' });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear Errors <-- ADD THIS NEW ACTION
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  useEffect(() => {
    // We call loadUser here to check for a token on every app load
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors, // <-- EXPORT THE NEW ACTION
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};