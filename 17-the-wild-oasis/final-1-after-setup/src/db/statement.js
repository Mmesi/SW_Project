import fs from "fs"; // File system module

import initSqlJs from "sql.js"; // SQL.js library

let dbInstance;

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
        full_name TEXT,
        avatar TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error setting up tables:", error.message);
  }
};

// Insert a user into the database
export const insertUser = (email, password, fullName, avatar, role) => {
  try {
    dbInstance.run(
      `INSERT INTO users (email, password, full_name, avatar, role) VALUES (?, ?, ?, ?, ?)`,
      [email, password, fullName, avatar, role],
    );
    console.log("User inserted:", email);
  } catch (error) {
    console.error("Error inserting user:", error.message);
  }
};

// Fetch all users from the database
const getUsers = () => {
  try {
    const results = dbInstance.exec(`SELECT * FROM users`);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

export const getUserById = async (id) => {
  try {
    const db = await loadDatabase("database.sqlite");
    const result = db.exec(`SELECT * FROM users WHERE id = ?`, [id]);

    const [userId, email, password, fullName, avatar, dateCreated] =
      result[0].values[0];

    return {
      id: userId,
      email: email,
      password: password,
      user_metadata: {
        full_name: fullName,
        avatar: avatar,
      },
      role: "authenticated",
      dateCreated: dateCreated,
    };
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

    return result[0]?.values[0]
      ? {
          id: result[0].values[0][0],
          email: result[0].values[0][1],
          password: result[0].values[0][2],
          user_metadata: {
            full_name: result[0].values[0][3],
            avatar: result[0].values[0][4],
          },
          role: result[0].values[0][5],
          dateCreated: result[0].values[0][6],
        }
      : null;
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};
// Main function

// Main function to initialize the database
export const initializeDatabase = async (filepath = "database.sqlite") => {
  try {
    // Load or create the database
    dbInstance = await loadDatabase(filepath);

    // Set up tables if they don't exist
    setupDatabase(dbInstance);

    // Insert a user into the database
    // insertUser(
    //   "admin@admin.com",
    //   "admin123",
    //   "John Doe",
    //   "default-user.jpg",
    //   "",
    // );
    saveDatabase(filepath);

    console.log("Database initialized and ready for use.");
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  }
};

// Automatically initialize the database
initializeDatabase().catch((err) => {
  console.error(
    "An error occurred during database initialization:",
    err.message,
  );
});
