const Fastify = require('fastify')
const path = require('path')
const autoload = require('@fastify/autoload')
const multipart = require('@fastify/multipart');
const cookie = require('fastify-cookie');
const jwt = require('jsonwebtoken');

const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const { createSecurityContext, XsuaaService, ValidationError } = require("@sap/xssec");

xsenv.loadEnv();

var services = xsenv.serviceCredentials({ tag: 'database' });
process.env.DATABASE_URL = services.uri

const servicesUAA = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
const authService = new XsuaaService(servicesUAA.uaa)



require('dotenv').config()

const fastify = Fastify({
  logger: true,
  bodyLimit: 30 * 1024 * 1024 * 1024
})

fastify.register(multipart);
fastify.addContentTypeParser('*', function (req, done) {
  done()
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  maxDepth: 1
})

fastify.register(require('@fastify/postgres'), {
  connectionString: process.env.DATABASE_URL
})



fastify
  .register(require('fastify-pagination'))



fastify.register(cookie);

async function authMiddleware(request, reply) {
  try {
    const secContext = await createSecurityContext(authService, { req: request });
    request.securityContext = secContext;
  } catch (e) {
    if (e instanceof ValidationError) {
      console.debug("Unauthenticated request: ", e.message);
      reply.status(401).send({ error: 'Unauthorized - Invalid JWT' });
    } else {
      console.error("Error while authenticating user: ", e.message);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
fastify.addHook('onRequest', authMiddleware);

fastify.listen(process.env.PORT, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
  };

})