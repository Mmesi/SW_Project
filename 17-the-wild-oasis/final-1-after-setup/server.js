import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs"; // To hash passwords
import { insertUser, getUser } from "./src/db/statement.js";
import { signup, login } from "./src/services/apiAuth.js"; // Import authentication logic

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Signup Route (Create New User)
app.post("/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  // Check if the user already exists
  const existingUser = await getUser(username);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    insertUser(username, email, hashedPassword);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login Route (Authenticate User)
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Get user from the database by username
  const user = await getUser(username);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  // Compare the hashed password with the input password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Successfully authenticated
  res.status(200).json({
    message: "Login successful",
    user: { username: user.username, email: user.email },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
