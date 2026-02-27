const express = require('express');
const logger = require('./logger');
const metrics = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3003;

app.use((req, res, next) => {
  metrics.httpRequestsTotal.inc({ method: req.method, path: req.path });
  next();
});

app.get('/health', (req, res) => {
  logger.info('Health endpoint called');
  res.json({ status: 'ok' });
});

app.get('/orders', (req, res) => {
  logger.info('Fetching orders');
  res.json([{ id: 1, total: 999 }]);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end(await metrics.register.metrics());
});

app.listen(PORT, () => {
  logger.info(`Order service started on port ${PORT}`);
});