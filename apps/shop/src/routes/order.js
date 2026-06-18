const { Router } = require('express');
const db = require('../db');

const router = Router();

router.post('/order', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const basket = db.prepare('SELECT * FROM baskets WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);
  if (!basket) return res.status(404).json({ error: 'No basket found for user' });

  const basketItems = db.prepare('SELECT * FROM basket_items WHERE basket_id = ?').all(basket.id);
  if (!basketItems.length) return res.status(400).json({ error: 'Basket is empty' });

  const order = db.prepare('INSERT INTO orders (user_id) VALUES (?)').run(userId);
  const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

  for (const item of basketItems) {
    const product = db.prepare('SELECT price FROM products WHERE id = ?').get(item.product_id);
    insertOrderItem.run(order.lastInsertRowid, item.product_id, item.quantity, product ? product.price : 0);
  }

  const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.lastInsertRowid);
  created.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.lastInsertRowid);
  res.status(201).json(created);
});

module.exports = router;
