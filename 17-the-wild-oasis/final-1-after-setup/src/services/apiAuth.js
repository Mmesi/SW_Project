// auth.js
import axios from "axios";

const API_URL = "http://localhost:3001/auth";

// Sign Up Function
export const signup = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signup failed");
    }

    const data = await response.json();
    return data; // Return the server response (e.g., user details or token)
  } catch (error) {
    throw new Error(error.message || "Signup failed");
  }
};

// Log In Function
export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log("DATA", data);
    if (response.ok) {
      return data;
    } else {
      console.error("Login failed:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
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
