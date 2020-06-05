'use strict';

const Config = require('../config');
const Hapi = require('@hapi/hapi');

class ResourceServer {
    constructor() {
        this.host = Config.resourceServer.host;
        this.port = Config.resourceServer.port;
    }

    checkAvailability = {
        method: 'GET',
        path: '/rs/validate',
        handler: (request, h) => {
            let access_token = request.query.access_token;
            if (!access_token) {
                return h.response({error: 'missing access_token param'}).code(400);
            }

            return {message: 'resource service says \'hello\'', access_token: access_token};
        }
    }

    async init() {
        const server = Hapi.server({
            port: this.port,
            host: this.host
        });

        server.route(this.checkAvailability);

        await server.start();
        console.log('Resource Server running on %s', server.info.uri);
    }
}

module.exports = ResourceServer;