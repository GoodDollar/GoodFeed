import * as pino from 'pino'

const logger = pino({
    name: 'Feeds',
    level: 'debug'
});

export default logger