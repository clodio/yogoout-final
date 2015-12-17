'use strict';

var config = require('../../config.js');
var mysql = require('mysql');

var DAO = function () {};

DAO.prototype.selectMigrationTableLastRows = function (callback) {
    var connection = mysql.createConnection({
        host: config.get('database.hostname'),
        user: config.get('database.login'),
        password: config.get('database.password'),
        database: config.get('database.name')
    });

    connection.connect();

    connection.query('SELECT * FROM (SELECT * FROM migrations ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC', function (err, rows) {
        callback(err, rows);
    });

    connection.end();
};

module.exports = new DAO();