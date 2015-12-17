'use strict';

var users = require('../../services/api/users');

var Controller = function () {
};

Controller.prototype.getFavoriteAppsByUserId = function (request, reply) {
    reply(users.getFavoriteAppsByUserId(request.auth, request.params.id));
};

Controller.prototype.getAppsByUserId = function (request, reply) {
    reply(users.getAppsByUserId(request.auth, request.params.id));
};

Controller.prototype.getUserById = function (request, reply) {
    reply(users.getUserById(request.auth, request.params.id));
};

module.exports = new Controller();