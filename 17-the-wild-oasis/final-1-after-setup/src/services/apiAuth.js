// auth.js
import axios from "axios";
import { verify } from "jsonwebtoken-esm";

import { getUserById } from "../db/statement.js";

const API_URL = import.meta.env.VITE_API_URL;

// Load environment variables from .env file

const jwtSecretKey = import.meta.env.VITE_JWT_SECRET;

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

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem("authToken", data.token);

      console.log("Login successful. Token saved:", data.token);
      return data.user;
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

export async function getCurrentUser() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");
  if (!token) return null; // No token available

  try {
    // Verify the token using the secret key
    const decoded = verify(token, jwtSecretKey);

    // Extract the user ID from the decoded token
    const userId = decoded.id;

    // Fetch the user from the database
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    return user; // Return the user details
  } catch (error) {
    console.error("Error verifying token:", error);
    return null; // Return null if token verification fails
  }
}
