const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'basket.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS baskets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS basket_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    basket_id INTEGER NOT NULL REFERENCES baskets(id),
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL
  );
`);

module.exports = db;
