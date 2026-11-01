const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function initializeDatabase() {
  const db = await open({
    filename: "./bookStore.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      price INTEGER,
      pages INTEGER
    );
  `);

  return db;
}

module.exports = initializeDatabase;

