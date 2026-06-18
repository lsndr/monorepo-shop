const express = require('express');
require('./db'); // initialize DB
require('./seed')();

const app = express();
app.use(express.json());
app.use('/', require('./routes/products'));
app.use('/', require('./routes/basket'));
app.use('/', require('./routes/order'));
app.get('/', (_, res) => res.json({ status: 'ok', service: 'shop-api' }));

app.listen(3002, () => console.log('shop-api listening on port 3002'));
