'use strict';

const Config = require('../config');

class AuthServer {
    constructor() {
        this.host = Config.authServer.host;
        this.port = Config.authServer.port;
    }

    async init() {
        const {OAuth2Server} = require('oauth2-mock-server');

        let server = new OAuth2Server();

        // Generate a new RSA key and add it to the keystore
        await server.issuer.keys.generateRSA();

        // Start the server
        await server.start(this.port, this.host);
        console.log('Auth Server running on %s', server.issuer.url);
    }
}

module.exports = AuthServer;