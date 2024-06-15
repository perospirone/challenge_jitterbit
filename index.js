const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/orders', orderRoutes);
app.use('/items', itemRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
