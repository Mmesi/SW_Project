// auth.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3001";

// Sign Up Function
export const signup = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email, password),
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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email, password),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem("authToken", data.token);

      // console.log("Login successful. Token saved:", data.token);
      return data.user;
    } else {
      // console.error("Login failed:", data.error);
      throw new Error(data.error || "Login failed");
    }
  } catch (error) {
    // console.error("Error:", error);
    throw new Error(error || "Login failed");
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

  if (!token) return null;

  try {
    // Verify the token using the secret key
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded.exp * 1000;

    if (isTokenExpired) {
      localStorage.removeItem("authToken"); // Clear invalid token
      return null;
    }

    // Extract the user ID from the decoded token
    const userId = decoded.id;

    /// Fetch user data from the backend API
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();
    return { ...user, token };
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.removeItem("authToken");
    return null; // Return null if token verification fails
  }
}
