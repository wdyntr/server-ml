require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
            payload: {
                maxBytes: 1000000 // batas 1 MB
            }
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message} Silakan gunakan foto lain.`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            // if (response.output.statusCode === 413) {
            //     const newResponse = h.response({
            //         status: 'fail',
            //         message: `${response.message}`
            //     });
            //     newResponse.code(413);
            //     return newResponse;
            // }

            // if (response.output.statusCode === 400) {
            //     const newResponse = h.response({
            //         status: 'fail',
            //         message: `${response.message}`,
            //     });
            //     newResponse.code(400);
            //     return newResponse;
            // }

            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();
