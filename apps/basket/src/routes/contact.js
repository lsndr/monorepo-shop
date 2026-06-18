const { Router } = require('express');
const db = require('../db');
const router = Router();

const insert = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');

router.get('/contact', (_, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Basket - Contact</title></head><body>
    <h1>Contact Us</h1>
    <form method="POST" action="/contact">
      <label>Name<br><input name="name" required></label><br><br>
      <label>Email<br><input name="email" type="email" required></label><br><br>
      <label>Message<br><textarea name="message" required></textarea></label><br><br>
      <button type="submit">Send</button>
    </form>
    <nav><a href="/">Home</a> | <a href="/faq/">FAQ</a></nav>
  </body></html>`);
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }
  insert.run(name, email, message);
  res.send(`<!DOCTYPE html><html><head><title>Basket - Message Sent</title></head><body>
    <h1>Thank you!</h1>
    <p>Your message has been received.</p>
    <nav><a href="/">Home</a> | <a href="/contact">Contact</a></nav>
  </body></html>`);
});

module.exports = router;
