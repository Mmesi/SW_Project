import fs from "fs"; // File system module

import initSqlJs from "sql.js"; // SQL.js library

// Load the SQLite database from a file or create a new one if the file doesn't exist
const loadDatabase = async (filepath) => {
  try {
    // Load the SQL.js module
    const SQL = await initSqlJs({
      locateFile: (filename) => `../../node_modules/sql.js/dist/${filename}`,
    });

    // Check if the file exists
    if (fs.existsSync(filepath)) {
      console.log("Loading existing database file...");
      const fileBuffer = fs.readFileSync(filepath); // Read file into a buffer
      const db = new SQL.Database(fileBuffer); // Load database from buffer
      console.log("Database loaded successfully!");
      return db;
    } else {
      console.log("Database file not found. Creating a new database...");
      const db = new SQL.Database(); // Create a new in-memory database
      return db;
    }
  } catch (error) {
    console.error("Error loading database:", error.message);
    throw error;
  }
};

// Save the SQLite database to a file
const saveDatabase = (db, filepath) => {
  try {
    const data = db.export(); // Export the database to a Uint8Array
    const buffer = Buffer.from(data); // Convert Uint8Array to a Node.js buffer
    fs.writeFileSync(filepath, buffer); // Write buffer to a file
    console.log("Database saved successfully to:", filepath);
  } catch (error) {
    console.error("Error saving database:", error.message);
    throw error;
  }
};

// Create tables in the database
const setupDatabase = (db) => {
  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error setting up tables:", error.message);
  }
};

// Insert a user into the database
export const insertUser = (db, email, password) => {
  try {
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [
      email,
      password,
    ]);
    console.log("User inserted:", email);
  } catch (error) {
    console.error("Error inserting user:", error.message);
  }
};

// Fetch all users from the database
const getUsers = (db) => {
  try {
    const results = db.exec(`SELECT * FROM users`);
    console.log("Users:", results[0]?.values || []);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

export const getUserById = (db, id) => {
  try {
    const results = db.exec(`SELECT * FROM users WHERE id = ?`, [id]);
    return results[0]?.values[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw error;
  }
};
export const getUser = (db, email) => {
  try {
    const results = db.exec(`SELECT * FROM users WHERE email = ?`, [email]);
    return results[0]?.values[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};
// Main function
const main = async () => {
  const filepath = "database.sqlite"; // Path to the SQLite database file

  // Load or create the database
  const db = await loadDatabase(filepath);

  // Set up tables if they don't exist
  setupDatabase(db);

  // Insert a sample user
  insertUser(db, "admin@admin.com", "admin123");

  // Fetch and display all users
  getUsers(db);

  // Save changes back to the file
  saveDatabase(db, filepath);
};

main().catch((err) => {
  console.error("An error occurred:", err.message);
});
