import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { initSocket, disconnectSocket } from "../services/socket";

// Create Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider - Provides authentication state and methods to all components
 * Manages user session using localStorage and JWT tokens
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Try to get user data from stored token
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Verify token with backend
      authAPI.getMe()
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          // Initialize socket connection
          initSocket(response.data._id);
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Register a new user
   */
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  };

  /**
   * Login user and store JWT token
   */
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    
    // Store token and user info
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Set user state
    setUser(user);
    
    // Initialize socket connection for real-time messaging
    initSocket(user._id);
    
    return user;
  };

  /**
   * Logout user and clear session
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    disconnectSocket();
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => !!user;

  // Context value with user state and auth methods
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};