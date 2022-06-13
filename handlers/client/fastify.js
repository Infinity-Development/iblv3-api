const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const Redis = require('ioredis');
const redis = require('redis');
const path = require('path');
const Ajv = require('ajv');

module.exports = async (client) => {
  const redis_db = new Redis(config.database.redis);

  Console.SendLogs('Redis is ready to handle the Rate Limits!', 'ready');

  const fastify = require('fastify')({ logger: true });

  fastify.register(require('fastify-rate-limit'), {
    max: 3000,
    redis: redis_db,
    global: false,
    skipOnError: true,
    timeWindow: '15 Minutes',
    addHeadersOnExceeding: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  });

  fastify.register(require('fastify-autoload'), {
    dir: path.join(__dirname, '../../server/routes'),
  });
  
  fastify.register(require('@fastify/cors'), {
    origin: '*',
    allowedHeaders: ['authorization', 'content-type'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflight: false,
    strictPreflight: false
  })

  fastify.addHook('preHandler', (req, res, done) => {
    req.client = client;
    done();
  });

  fastify.setNotFoundHandler(function (request, reply) {
    reply.code(404).send({
      message:
        'Woah chief, Whatever you are looking for does not exist here! Please check our our docs if you need help: https://docs.botlist.site',
      error: true,
      fatal: false,
      status: 404,
    });
  });

  const start = async () => {
    try {
      await fastify.listen(config.server.port, '0.0.0.0');

      Console.SendLogs(
        `Infinity API Webserver is Online and Ready on PORT: ${config.server.port}`,
        'ready',
      );
    } catch (err) {
      Console.SendLogs('Error occurred while starting the Webserver', 'error');

      fastify.log.error(err.stack);

      process.exit(1);
    }
  };

  start();
};
