const { Router } = require('express');
const router = Router();

router.get('/faq/', (_, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Basket - FAQ</title></head><body>
    <h1>Frequently Asked Questions</h1>
    <h3>How do I add items to my basket?</h3>
    <p>Browse products and click "Add to Basket" on any item.</p>
    <h3>Is there a limit to how many items I can add?</h3>
    <p>No, you can add as many items as you like.</p>
    <h3>How long does my basket last?</h3>
    <p>Your basket is preserved for the duration of your session.</p>
    <nav><a href="/">Home</a> | <a href="/contact">Contact</a></nav>
  </body></html>`);
});

module.exports = router;
