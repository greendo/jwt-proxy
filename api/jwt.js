'use strict';

const DB = require('./../db/database');
const Config = require('./../config');
const jwt = require('jsonwebtoken');

const register = {
    method: ['GET', 'POST'],
    path: '/jwt/register',
    options: {
        auth: false
    },
    handler: (request, h) => {
        let name = request.query.name;

        if (!name) {
            return h.response({error: 'missing parameter: name'}).code(400);
        }

        //try to register
        return new Promise((resolve, reject) => {
            DB.findOne({name: name}, (err, docs) => {
                if (err) {
                    resolve(h.response({error: 'something went wrong'}).code(500));
                } else {
                    //not registered
                    if (docs === null) {
                        jwt.sign({name}, Config.secretKey, {expiresIn: '15m'}, (_err, token) => {
                            if (_err) {
                                console.log(_err)
                            }
                            DB.insert({name: name, token: token});

                            resolve({
                                name: name,
                                token: token,
                                message: 'registered successfully'
                            });
                        });
                    } else //already registered
                        resolve({
                            message: 'user ' + docs.name + ' is already registered',
                            token: docs.token
                        });
                }
            });
        });
    }
};

const validate = {
    method: 'GET',
    path: '/jwt/validate',
    handler: (request, h) => {
        //missing credentials
        const name = request.auth.credentials.name;

        if (!name) {
            return h.response({error: 'missing jwt header'}).code(401);
        }

        return new Promise((resolve, reject) => {
            DB.findOne({name: name}, (err, docs) => {
                if (err) {
                    resolve(h.response({error: 'something went wrong'}).code(500));
                } else {
                    if (docs === null) {
                        resolve({
                            message: 'user ' + docs.name + ' not recognised'
                        });
                    } else {
                        resolve({
                            user: docs.name,
                            token: docs.token,
                            message: 'successfully recognised'
                        });
                    }
                }
            });
        });
    }
};

module.exports = {
    validateJWT: validate,
    registerJWT: register
};