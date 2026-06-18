const express = require('express');
const app = express();

app.use(express.json());
app.use('/v2', require('./routes/basket'));
app.get('/', (_, res) => res.json({ status: 'ok', service: 'basket-api' }));

app.listen(3001, () => console.log('basket-api listening on port 3001'));
