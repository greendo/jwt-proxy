'use strict';

const h = 'localhost';

const secretKey = 'secret';

const resourceServer = {
    host: h,
    port: 3000
};

const authServer = {
    host: h,
    port: 3001
};

const clientApiServer = {
    host: h,
    port: 3002
};

module.exports = {
    secretKey: secretKey,
    resourceServer: resourceServer,
    authServer: authServer,
    clientApiServer: clientApiServer
};