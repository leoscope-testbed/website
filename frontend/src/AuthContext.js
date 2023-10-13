import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { login, logout } from './services/api';



/**
 * Authentication context for managing user authentication state.
 * @typedef {Object} AuthContext
 * @property {Object} user - The user object containing user details.
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {function} handleLogin - Function to handle user login.
 * @property {function} handleLogout - Function to handle user logout.
 * @property {function} setIsAuthenticated - Function to set the isAuthenticated state.
 */

/**
 * Authentication provider component to manage user authentication state.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Child components wrapped by the provider.
 * @returns {JSX.Element} AuthProvider component.
 */


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(decodedToken);
        setIsAuthenticated(true);
      }
    }
  
    const handleStorageChange = () => {
      const token = localStorage.getItem('access');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(decodedToken);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Handles user login.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {void}
   */
  const handleLogin = async (email, password) => {
    const response = await login({ email, password });
    const { token } = response.data;
    localStorage.setItem('access', token);
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Context value for the AuthContext provider
  const contextValue = {
    user, // include user in the context value
    isAuthenticated,
    handleLogin,
    handleLogout,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
