import fs from "fs"; // File system module

import initSqlJs from "sql.js"; // SQL.js library

let dbInstance = null;

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
      dbInstance = new SQL.Database(fileBuffer); // Load database from buffer
      console.log("Database loaded successfully!");
      // return db;
    } else {
      console.log("Database file not found. Creating a new database...");
      dbInstance = new SQL.Database(); // Create a new in-memory database
      // return db;
    }
  } catch (error) {
    console.error("Error loading database:", error.message);
    throw error;
  }
};

// Save the SQLite database to a file
const saveDatabase = (filepath) => {
  try {
    const data = dbInstance.export(); // Export the database to a Uint8Array
    const buffer = Buffer.from(data); // Convert Uint8Array to a Node.js buffer
    fs.writeFileSync(filepath, buffer); // Write buffer to a file
    console.log("Database saved successfully to:", filepath);
  } catch (error) {
    console.error("Error saving database:", error.message);
    throw error;
  }
};

// Create tables in the database
const setupDatabase = () => {
  try {
    dbInstance.run(`
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
export const insertUser = (email, password) => {
  try {
    dbInstance.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [
      email,
      password,
    ]);
    console.log("User inserted:", email);
  } catch (error) {
    console.error("Error inserting user:", error.message);
  }
};

// Fetch all users from the database
const getUsers = () => {
  try {
    const results = dbInstance.exec(`SELECT * FROM users`);
    console.log("Users:", results[0]?.values || []);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

export const getUserById = (id) => {
  try {
    const results = dbInstance.exec(`SELECT * FROM users WHERE id = ?`, [id]);
    return results[0]?.values[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw error;
  }
};
export const getUser = (email) => {
  try {
    const result = dbInstance.exec(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return result[0]?.values[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};
// Main function
const main = async () => {
  const filepath = "database.sqlite"; // Path to the SQLite database file

  // Load or create the database
  await loadDatabase(filepath);

  // Set up tables if they don't exist
  setupDatabase();

  // Insert a sample user
  // insertUser(db, "admin@admin.com", "admin123");

  // Fetch and display all users
  getUsers();

  // Save changes back to the file
  saveDatabase(filepath);
};

main().catch((err) => {
  console.error("An error occurred:", err.message);
});
