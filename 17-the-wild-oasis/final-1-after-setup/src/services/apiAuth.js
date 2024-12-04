// auth.js
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3002";

// Sign Up Function
export const signup = async (user) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signup failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Signup failed" };
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
      localStorage.setItem("authToken", data.token);

      return data.user;
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (error) {
    throw new Error(error || "Login failed");
  }
};

export const logout = async () => {
  localStorage.removeItem("authToken");
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
      localStorage.removeItem("authToken");
      return null;
    }

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
export async function getAllUsers() {
  const currentUserEmail = await getCurrentUser().then((res) => res.email);

  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) throw new Error("Failed to fetch users");

  const users = await response.json();

  const filteredUsers = users.filter((user) => user.email !== currentUserEmail);

  return filteredUsers;
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete user");

  return true;
}

export async function updateCurrentUser(updatedUserData) {
  const response = await fetch(`${API_URL}/users/${updatedUserData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUserData),
  });

  if (!response.ok) throw new Error("Failed to update user");

  const updatedUser = await response.json();

  return updatedUser;
}
