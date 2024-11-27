// auth.js
import axios from "axios";

const API_URL = "http://localhost:3001/auth";

// Sign Up Function
export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Signup failed");
  }
};

// Log In Function
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Login failed");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Logout failed");
  }
};
export const updateCurrentUser = (newUser) => {
  localStorage.setItem("user", JSON.stringify(newUser));
  return newUser;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
