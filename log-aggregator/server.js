const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let logs = [];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/logs', (req, res) => {
  const log = req.body;

  if (
    !log.level ||
    !log.message ||
    !log.timestamp ||
    !log.service_name ||
    !log.environment
  ) {
    return res.status(400).json({ error: 'Invalid log format' });
  }

  logs.push(log);
  if (logs.length > 10) {
    logs.shift();
  }

  console.log('Received log:', log);

  return res.status(202).json({ status: 'accepted' });
});

app.get('/logs', (req, res) => {
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`Log Aggregator running on port ${PORT}`);
});