import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import {
  insertUser,
  getUser,
  getUserById,
  getUsers,
  deleteUserById,
  updateUser,
} from "./statement.js";

dotenv.config();

// Apply the rate limiting middleware to all requests.
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minute
  limit: 5, // Limit requests to 5 every 2 minutes
  message: { error: "Too many failed attempts, please try again later" },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const app = express();
app.use("/auth/login", loginLimiter);

const PORT = 3002;
app.use(cors());
app.use(express.json());

console.log("JWT Secret Key:", process.env.VITE_ACCESS_TOKEN_SECRET);
const jwtSecretKey =
  "f71969bdc197f1e7e8f07fe312b13d2bfd0c323b20ce0d761170013391d425cc1c8fd477bcd2a273e434f7844c93c534d0a9ebb2ff42123f76b0fcd2be8b081c";

// Create New User
app.post("/auth/signup", async (req, res) => {
  const { fullName, email, password, avatar, role } = req.body;

  // Validate input
  if (!email || !password || !fullName) {
    return res.status(400).json({
      error: `All required fields must be provided`,
    });
  }
  

  // Check if the user already exists
  const existingUser = await getUser(email);
  if (existingUser) {
    return res.status(400).json({ error: "Unable to process request" });
  }

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    await insertUser(fullName, email, hashedPassword, avatar, role);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login Route (Authenticate User)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      error: `Email and password are required`,
    });
  }
  // Get user from the database by email
  const user = await getUser(email);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  // Compare the hashed password with the input password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  // Sign a JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecretKey, {
    expiresIn: "1h",
  });
  // Send the token and user with the status updated to authenticated
  res.status(200).json({ token, user: { ...user, status: "authenticated" } });
});

//Get User by ID
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await deleteUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  var updatedUserData = req.body;

  if (updatedUserData.password) {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(updatedUserData.password, 10);
    updatedUserData = { ...updatedUserData, password: hashedPassword };
  }

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update user data in the database
    await updateUser(userId, updatedUserData);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
