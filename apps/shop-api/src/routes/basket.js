const { Router } = require('express');
const db = require('../db');

const router = Router();

router.post('/basket', (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !Array.isArray(items)) {
    return res.status(400).json({ error: 'userId and items are required' });
  }
  const basket = db.prepare('INSERT INTO baskets (user_id) VALUES (?)').run(userId);
  const insertItem = db.prepare('INSERT INTO basket_items (basket_id, product_id, quantity) VALUES (?, ?, ?)');
  for (const item of items) {
    insertItem.run(basket.lastInsertRowid, item.productId, item.quantity);
  }
  const created = db.prepare('SELECT * FROM baskets WHERE id = ?').get(basket.lastInsertRowid);
  created.items = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(basket.lastInsertRowid);
  res.status(201).json(created);
});

router.get('/basket', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const basket = db.prepare('SELECT * FROM baskets WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);
  if (!basket) return res.status(404).json({ error: 'No basket found' });
  basket.items = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(basket.id);
  res.json(basket);
});

module.exports = router;
