'use strict';

const Datastore = require('nedb');
const db = new Datastore({autoload: true});
// db.loadDatabase();

module.exports = db;