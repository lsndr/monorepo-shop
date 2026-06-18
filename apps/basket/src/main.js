const express = require('express');
require('./db');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/', (_, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Basket</title></head><body>
    <h1>What is a Basket?</h1>
    <p>A basket is a temporary container that holds items you intend to purchase. You can add, remove, and update quantities before placing an order.</p>
    <nav><a href="/faq/">FAQ</a> | <a href="/contact">Contact</a></nav>
  </body></html>`);
});

app.use('/', require('./routes/faq'));
app.use('/', require('./routes/contact'));

app.listen(3000, () => console.log('basket listening on port 3000'));
