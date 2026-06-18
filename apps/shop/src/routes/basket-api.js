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

router.get('/v2/basket/compare', (req, res) => {
  const { a, b } = req.query;
  if (!a || !b) return res.status(400).json({ error: 'a and b basket ids are required' });

  const basketA = db.prepare('SELECT * FROM baskets WHERE id = ?').get(a);
  const basketB = db.prepare('SELECT * FROM baskets WHERE id = ?').get(b);
  if (!basketA || !basketB) return res.status(404).json({ error: 'One or both baskets not found' });

  basketA.items = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(a);
  basketB.items = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(b);

  const mapA = Object.fromEntries(basketA.items.map(i => [i.product_id, i.quantity]));
  const mapB = Object.fromEntries(basketB.items.map(i => [i.product_id, i.quantity]));
  const allIds = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

  const diff = [];
  for (const id of allIds) {
    const qA = mapA[id] ?? 0;
    const qB = mapB[id] ?? 0;
    if (qA !== qB) diff.push({ product_id: Number(id), basket_a: qA, basket_b: qB });
  }

  res.json({ basket_a: basketA, basket_b: basketB, diff });
});

router.delete('/v1/basket/:id', (req, res) => {
  const basket = db.prepare('SELECT id FROM baskets WHERE id = ?').get(req.params.id);
  if (!basket) return res.status(404).json({ error: 'Basket not found' });
  db.prepare('DELETE FROM basket_items WHERE basket_id = ?').run(basket.id);
  db.prepare('DELETE FROM baskets WHERE id = ?').run(basket.id);
  res.status(204).send();
});

module.exports = router;
