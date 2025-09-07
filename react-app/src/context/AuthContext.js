import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      }
    } else {
      console.log('No user/token in storage');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      const { token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      
      const { token, user: newUser } = response.data;

      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(newUser));
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthContext;