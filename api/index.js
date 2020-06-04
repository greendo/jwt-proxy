'use strict';

const index = {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return {message: 'Hello World!'};
    },
    options: {
        auth: false
    }
};

module.exports = index;