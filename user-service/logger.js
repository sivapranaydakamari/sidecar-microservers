const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: () => new Date().toISOString() }),
    winston.format.printf(({ level, message, timestamp }) =>
      JSON.stringify({ level, message, timestamp })
    )
  ),
  transports: [
    new winston.transports.File({
      filename: '/var/log/app/app.log'
    })
  ]
});

module.exports = logger;