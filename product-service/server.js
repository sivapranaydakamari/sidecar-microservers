const express = require('express');
const logger = require('./logger');
const metrics = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3002;

app.use((req, res, next) => {
  metrics.httpRequestsTotal.inc({ method: req.method, path: req.path });
  next();
});

app.get('/health', (req, res) => {
  logger.info('Health endpoint called');
  res.json({ status: 'ok' });
});

app.get('/products', (req, res) => {
  logger.info('Fetching products');
  res.json([{ id: 1, name: "Laptop" }]);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end(await metrics.register.metrics());
});

app.listen(PORT, () => {
  logger.info(`Product service started on port ${PORT}`);
});