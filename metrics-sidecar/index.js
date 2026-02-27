const express = require('express');
const axios = require('axios');

const app = express();

const APP_METRICS_URL = process.env.APP_METRICS_URL;
const SERVICE_NAME = process.env.SERVICE_NAME;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const PORT = process.env.PORT || 9100;

let enrichedMetrics = '';

async function scrapeMetrics() {
  try {
    const response = await axios.get(APP_METRICS_URL);

    const lines = response.data.split('\n');

    const updatedLines = lines.map(line => {
      if (
        line.startsWith('#') ||
        line.trim() === ''
      ) {
        return line;
      }

      const parts = line.split(' ');
      const metricPart = parts[0];
      const valuePart = parts[1];

      if (metricPart.includes('{')) {
        return metricPart.replace(
          '{',
          `{service_name="${SERVICE_NAME}",environment="${ENVIRONMENT}",`
        ) + ` ${valuePart}`;
      } else {
        return `${metricPart}{service_name="${SERVICE_NAME}",environment="${ENVIRONMENT}"} ${valuePart}`;
      }
    });

    enrichedMetrics = updatedLines.join('\n');

    console.log('Metrics scraped and enriched');
  } catch (err) {
    console.error('Error scraping metrics:', err.message);
  }
}

setInterval(scrapeMetrics, 15000);
scrapeMetrics();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(enrichedMetrics);
});

app.listen(PORT, () => {
  console.log(`Metrics Sidecar running on port ${PORT}`);
});
