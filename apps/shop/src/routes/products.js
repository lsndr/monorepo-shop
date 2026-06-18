const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/v1/products', (_, res) => {
  res.json(db.prepare('SELECT * FROM products').all());
});

router.post('/v1/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
  const result = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name, price);
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid));
});

module.exports = router;
