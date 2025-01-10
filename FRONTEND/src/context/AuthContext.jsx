import React from "react";
import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    try {
      const respone = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = respone.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(jwtDecode(accessToken));
      return { success: true, message: "Success" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "An error occurred",
      };
    }
  };
  const signup = async (username, email, password) => {
    await axios.post("http://localhost:5000/auth/signup", {
      email,
      username,
      password,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };
  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setUser(jwtDecode(token));
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, getAccessToken, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
