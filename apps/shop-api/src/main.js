const express = require('express');
require('./db'); // initialize DB
require('./seed')();

const app = express();
app.use(express.json());
app.use('/v1', require('./routes/products'));
app.use('/v1', require('./routes/basket'));
app.use('/v1', require('./routes/order'));
app.get('/', (_, res) => res.json({ status: 'ok', service: 'shop-api' }));

app.listen(3002, () => console.log('shop-api listening on port 3002'));
