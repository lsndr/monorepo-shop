const { Router } = require('express');
const db = require('../db');

const router = Router();

router.post('/v1/basket', (req, res) => {
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

router.get('/v1/basket', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const basket = db.prepare('SELECT * FROM baskets WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);
  if (!basket) return res.status(404).json({ error: 'No basket found' });
  basket.items = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(basket.id);
  res.json(basket);
});

router.delete('/v1/basket/:id', (req, res) => {
  const basket = db.prepare('SELECT id FROM baskets WHERE id = ?').get(req.params.id);
  if (!basket) return res.status(404).json({ error: 'Basket not found' });
  db.prepare('DELETE FROM basket_items WHERE basket_id = ?').run(basket.id);
  db.prepare('DELETE FROM baskets WHERE id = ?').run(basket.id);
  res.status(204).send();
});

module.exports = router;
