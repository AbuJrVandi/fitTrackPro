require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use default path if environment variable is not set
const dbPath = path.resolve(__dirname, '..', process.env.DB_FILE_PATH || 'fittrackpro.db');

// Delete existing database file
try {
  if (fs.existsSync(dbPath)) {
    console.log('Removing existing database file...');
    fs.unlinkSync(dbPath);
    console.log('Existing database file removed');
  }
} catch (err) {
  console.error('Error removing database file:', err);
}

console.log('Creating new database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1); // Exit if we can't open the database
  }
  console.log('Connected to the SQLite database.');

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err.message);
      return;
    }
    console.log('Foreign key support enabled');
  });

  // Create tables
  const createTables = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      age INTEGER,
      weight REAL,
      height REAL,
      gender TEXT,
      fitness_goal TEXT,
      daily_water_intake INTEGER,
      daily_calorie_target INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE health_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      log_type TEXT NOT NULL,
      value REAL NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      goal_type TEXT NOT NULL,
      target_value REAL NOT NULL,
      current_value REAL DEFAULT 0,
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  db.exec(createTables, (err) => {
    if (err) {
      console.error('Error creating tables:', err.message);
      process.exit(1); // Exit if we can't create tables
    }
    console.log('Database tables created successfully');

    // Verify tables were created
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
      if (err) {
        console.error('Error verifying tables:', err.message);
        return;
      }
      console.log('Created tables:', tables.map(t => t.name).join(', '));
    });
  });
});

// Add error event handler
db.on('error', (err) => {
  console.error('Database error:', err);
});

// Add trace for debugging
if (process.env.NODE_ENV !== 'production') {
  db.on('trace', (sql) => {
    console.log('SQL:', sql);
  });
}

module.exports = db;
