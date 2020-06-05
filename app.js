// 'use strict';
//
// const Hapi = require('@hapi/hapi');
// const HapiNowAuth = require('@now-ims/hapi-now-auth');
// const Config = require('./config');
//
// const valFunc = (request, token, h) => {
//     let isValid, artifacts;
//
//     const credentials = token.decodedJWT;
//
//     const DB = require('./db/database');
//
//     return new Promise((resolve, reject) => {
//         DB.findOne({name: credentials.name}, (err, docs) => {
//             isValid = docs !== null && docs.name === credentials.name;
//
//             artifacts = {info: 'db check'};
//             resolve({isValid, credentials, artifacts});
//         });
//     });
// };
//
// const init = async () => {
//     const server = Hapi.server({
//         port: 3000,
//         host: 'localhost'
//     });
//
//     await server.register(HapiNowAuth);
//
//     server.auth.strategy('jwt-strategy', 'hapi-now-auth', {
//         verifyJWT: true,
//         keychain: [Config.secretKey],
//         verifyOptions: {
//             algorithms: ['HS256'],
//             maxAge: '15m'
//         },
//         validate: valFunc
//     });
//     server.auth.default('jwt-strategy');
//
//     server.route(require('./api/index'));
//     const RouteJWT = require('./api/jwt');
//     server.route(RouteJWT.validateJWT);
//     server.route(RouteJWT.registerJWT);
//
//     await server.start();
//     console.log('Server running on %s', server.info.uri);
// };
//
// process.on('unhandledRejection', (err) => {
//     console.log(err);
//     process.exit(1);
// });
//
// init();
//
// //todo: finish client-api-server, remake app.js, write client(?)

'use strict';

const AuthServer = require('./server/auth-server');
const ClientApiServer = require('./server/client-api-server');
const ResourceServer = require('./server/resource-server');

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const AS = new AuthServer();
const API = new ClientApiServer();
const RS = new ResourceServer();

RS.init();
AS.init();
API.init();

//todo: finish client-api-server, remake app.js, write client(?)

//https://connect2id.com/learn/oauth-2#client-auth
//https://stackoverflow.com/questions/12296017/how-to-validate-an-oauth-2-0-access-token-for-a-resource-server