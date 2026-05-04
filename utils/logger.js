import winston from 'winston';

const logger = new (winston.createLogger)({
  transports: [new (winston.transports.Console)({ json: false })],
});

logger.level = 'debug';

if (process.env.LEVEL) {
  logger.level = process.env.LEVEL;
}

export default logger;
