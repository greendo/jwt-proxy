'use strict';

const Config = require('../config');
const Hapi = require('@hapi/hapi');

class ClientApiServer {
    constructor() {
        this.host = Config.clientApiServer.host;
        this.port = Config.clientApiServer.port;
    }

    authenticate = {
        method: ['GET', 'POST'],
        path: '/api/auth',
        handler: (request, h) => {
            //await goto: http://localhost:3001/authorize?response_type=code&scope=myapi-read%20myapi-write&client_id=s6BhdRkqt3&state=af0ifjsldkj&redirect_uri=http://localhost:3002/api/authenticated
            //returned answer supposed to redirect to 'authenticated' page
            console.log('assuming we received username and password in this call');

            const Config = require('../config');

            return new Promise((resolve, reject) => {
                const req = require('request');
                req('http://' + Config.authServer.host + ':' + Config.authServer.port + '/authorize?response_type=code' +
                    '&scope=myapi-read%20myapi-write&client_id=s6BhdRkqt3&state=af0ifjsldkj' +
                    '&redirect_uri=http://localhost:3002/api/authenticated', {json: true}, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(body);
                    resolve(body);
                });
            });
        }
    }

    authenticated = {
        method: ['GET', 'POST'],
        path: '/api/authenticated',
        handler: (request, h) => {
            //this one is for internal use of api server
            let code = request.query.code;
            if (!code) {
                return h.response({error: 'missing code param'}).code(400);
            }
            return {code: code};
            //http://localhost:3002/?code=4597b90f-5d3a-49c8-9a2a-7523f936a748&scope=myapi-read%20myapi-write&state=af0ifjsldkj
        }
    }

    getInfoFromResourceServer = {
        method: ['GET', 'POST'],
        path: '/api/getInfo',
        handler: (request, h) => {
            //take secret code form req, await exchange token for code from AS, put it in header and retrieve info from RS
            let code = request.query.code;
            if (!code) {
                return h.response({error: 'missing code param'}).code(400);
            }

            const req = require('request');
            const Config = require('../config');

            return new Promise((resolve, reject) => {
                req.post({
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    url: 'http://' + Config.authServer.host + ':' + Config.authServer.port + '/token',
                    form: {grant_type: 'authorization_code', code: code}
                }, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    let json = JSON.parse(body);
                    resolve(json.access_token);
                });
            }).then((result) => {
                return new Promise((resolve, reject) => {
                    console.log(result);
                    //add token 'result'
                    req('http://' + Config.resourceServer.host + ':' + Config.resourceServer.port + '/rs/validate?access_token=' + result, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body);
                        resolve(body);
                    });
                });
            });
        }
    }

    async init() {
        const server = Hapi.server({
            port: this.port,
            host: this.host
        });

        console.log('Client Api Service is represented as \'client\' in oauth2 protocol. In our case it\'s a REST-service,' +
            ' which provides methods for front-end clients and retrieves auth tokens from end-users secret key issued in aut method each time end-user makes request.' +
            'We are expecting secret in jwt (in real proj this should be done with custom plugin)');

        server.route([this.authenticate, this.authenticated, this.getInfoFromResourceServer]);

        await server.start();
        console.log('Client Api Server running on %s', server.info.uri);
    }
}

module.exports = ClientApiServer;