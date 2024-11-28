import Database from "better-sqlite3";

const db = new Database("database.db");

const createTable = () => {
  // Users table
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.prepare(usersTable).run();

  // Cabins table
  const cabinsTable = `
    CREATE TABLE IF NOT EXISTS cabins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      capacity INTEGER NOT NULL,
      price_per_night DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.prepare(cabinsTable).run();

  // Bookings table (with foreign keys to users and cabins)
  const bookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      cabin_id INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      num_nights INTEGER NOT NULL,
      num_guests INTEGER NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE
    )
  `;
  db.prepare(bookingsTable).run();

  // Settings table (used for application settings like configuration, etc.)
  const settingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.prepare(settingsTable).run();

  console.log("All tables are created successfully.");
};

createTable();

export const insertUser = (email, password) => {
  const sql = `
    INSERT INTO users (email, password) VALUES (?, ?)
  `;
  db.prepare(sql).run(email, password);
};

insertUser("admin@admin.com", "admin");

const getUsers = () => {
  const sql = `
    SELECT * FROM users
  `;
  const rows = db.prepare(sql).all();
  return rows;
};

export const getUser = (email) => {
  const sql = `
    SELECT * FROM users WHERE email = ?
  `;
  const row = db.prepare(sql).get(email);
  return row;
};

const updateUser = (email, password) => {
  const sql = `
    UPDATE users SET password = ? WHERE username = ?
  `;
  db.prepare(sql).run(password, email);
};
const deleteUser = (username) => {
  const sql = `
    DELETE FROM users WHERE username = ?
  `;
  db.prepare(sql).run(username);
};
