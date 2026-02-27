const fs = require('fs');
const axios = require('axios');
const path = require('path');

const LOG_FILE = '/var/log/app/app.log';

const SERVICE_NAME = process.env.SERVICE_NAME;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const LOG_AGGREGATOR_URL = process.env.LOG_AGGREGATOR_URL;

let filePosition = 0;

function waitForLogFile() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (fs.existsSync(LOG_FILE)) {
        console.log('Log file found.');
        clearInterval(interval);
        resolve();
      }
    }, 2000);
  });
}

async function processNewLogs() {
  try {
    const stats = fs.statSync(LOG_FILE);

    if (stats.size > filePosition) {
      const stream = fs.createReadStream(LOG_FILE, {
        start: filePosition,
        end: stats.size
      });

      let buffer = '';

      stream.on('data', (chunk) => {
        buffer += chunk.toString();
      });

      stream.on('end', async () => {
        filePosition = stats.size;

        const lines = buffer.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          try {
            const log = JSON.parse(line);

            const enrichedLog = {
              ...log,
              service_name: SERVICE_NAME,
              environment: ENVIRONMENT
            };

            await axios.post(LOG_AGGREGATOR_URL, enrichedLog);

            console.log('Forwarded log:', enrichedLog);
          } catch (err) {
            console.error('Error processing log line:', err.message);
          }
        }
      });
    }
  } catch (err) {
    console.error('Error reading log file:', err.message);
  }
}

async function start() {
  console.log('Logging Sidecar Starting...');
  console.log('Service:', SERVICE_NAME);
  console.log('Aggregator:', LOG_AGGREGATOR_URL);

  await waitForLogFile();

  setInterval(processNewLogs, 5000);
}

start();