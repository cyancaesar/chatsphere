import pino from 'pino';

const logger = pino({
  browser: {},
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
    },
  },
});

export default logger;
