const express = require('express');
const logger = require('./logger');
const metrics = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  metrics.httpRequestsTotal.inc({ method: req.method, path: req.path });
  next();
});

app.get('/health', (req, res) => {
  logger.info('Health endpoint called');
  res.json({ status: 'ok' });
});

app.get('/users', (req, res) => {
  logger.info('Fetching users');
  res.json([{ id: 1, name: "Pranay" }]);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end(await metrics.register.metrics());
});

app.listen(PORT, () => {
  logger.info(`User service started on port ${PORT}`);
});