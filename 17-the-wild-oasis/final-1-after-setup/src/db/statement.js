import fs from "fs"; // File system module

import initSqlJs from "sql.js"; // SQL.js library
// import bcrypt from "bcryptjs";

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
const saveDatabase = async (filepath) => {
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(filepath, buffer);
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
export const insertUser = async (fullName, email, password, avatar, role) => {
  try {
    dbInstance.run(
      `INSERT INTO users (email, password, full_name, avatar, role) VALUES (?, ?, ?, ?, ?)`,
      [email, password, fullName, avatar, role],
    );

    await saveDatabase("database.sqlite");
  } catch (error) {
    console.error("Error inserting user:", error.message);
  }
};

// Fetch all users from the database
export const getUsers = async () => {
  try {
    // Prepare the SQL statement
    const stmt = dbInstance.prepare("SELECT * FROM users");

    const result = [];
    while (stmt.step()) {
      const user = await stmt.getAsObject();

      result.push({
        id: user.id,
        email: user.email,
        user_metadata: {
          fullName: user.full_name,
          avatar: user.avatar,
        },
        role: user.role,
        dateCreated: user.created_at,
      });
    }

    stmt.free();

    if (result.length === 0) {
      return [];
    }

    return result;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const stmt = dbInstance.prepare("DELETE FROM users WHERE id=:idval");

    const result = stmt.getAsObject({ ":idval": userId });
    // Check if rows were affected
    if (result) {
      await saveDatabase("database.sqlite");
      return { id: userId };
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const stmt = await dbInstance.prepare(
      "SELECT * FROM users WHERE id=:idval",
    );

    const result = await stmt.getAsObject({ ":idval": id });

    stmt.free();
    return {
      ...result,
      user_metadata: { fullName: result.full_name, avatar: result.avatar },
      dateCreated: result.created_at,
      status: "authenticated",
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw error;
  }
};
export const getUser = async (email) => {
  try {
    const stmt = await dbInstance.prepare(
      "SELECT * FROM users WHERE email=:emailval",
    );

    const result = await stmt.getAsObject({ ":emailval": email });

    stmt.free();

    return {
      ...result,
      user_metadata: { fullName: result.full_name, avatar: result.avatar },
    };
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};

// Update a user in the database
export const updateUser = async (userId, data) => {
  if (data.password) {
    try {
      const stmt = dbInstance.prepare(
        "UPDATE users SET password = ? WHERE id = ?",
      );

      stmt.bind([data.password, userId]);
      stmt.step();
      stmt.free();

      await saveDatabase("database.sqlite");
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  }
  if (data.fullName) {
    try {
      const stmt = dbInstance.prepare(
        "UPDATE users SET full_name = ?, avatar = ? WHERE id = ?",
      );

      stmt.bind([data.fullName, data.avatar, userId]);
      stmt.step();
      stmt.free();

      await saveDatabase("database.sqlite");
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  }
};

// Main function to initialize the database
export const initializeDatabase = async (filepath = "database.sqlite") => {
  try {
    // Load or create the database
    dbInstance = await loadDatabase(filepath);

    // Set up tables if they don't exist
    setupDatabase(dbInstance);

    // Hash the password before saving to the database
    // const hashedPassword = await bcrypt.hash("admin123", 10);

    // // Insert a user into the database
    // insertUser(
    //   "admin@admin.com",
    //   hashedPassword,
    //   "John Doe",
    //   "default-user.jpg",
    //   "admin",
    // );
    // await saveDatabase(filepath);

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
