const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function routes(fastify, options) {
    fastify.get('/getReturnRequests', async function (req, res) {
        try {
            const results = await prisma.returnRequests.findMany();
            return results;
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    });
}

module.exports = routes