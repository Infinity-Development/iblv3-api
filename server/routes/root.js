module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    reply.status(200).send(
      JSON.stringify({
        message:
          'Welcome to the Infinity API, Please refer to our Docs: https://docs.botlist.site for help!!',
        error: false,
        fatal: false,
        status: 200,
      }),
    );
  });
};
