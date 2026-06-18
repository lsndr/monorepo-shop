const db = require('./db');

module.exports = function seed() {
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (count > 0) return;
  const insert = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  [['Apple', 0.99], ['Banana', 0.49], ['Orange', 1.29], ['Milk', 1.89], ['Bread', 2.49]].forEach(
    ([name, price]) => insert.run(name, price)
  );
  console.log('Seeded products');
};
