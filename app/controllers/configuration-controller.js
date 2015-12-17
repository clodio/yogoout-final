'use strict';

var config = require('../../config.js');

var Controller = function () {};

Controller.prototype.reload = function (request, reply) {
    config.refresh();
    reply({ updated: true }).code(200);
};

Controller.prototype.show = function (request, reply) {
    reply.view('show-config.ejs', {
        hostname: config.get('environnement'),
        config: config.toStringWithoutPasswords()
    });
};

Controller.prototype.set = function (request, reply) {
    // TODO objet dans le body plutot que dans l'url
    if (request.params.key && request.params.value && config.has(request.params.key)) {
        config.set(request.params.key, request.params.value);
        return reply({ updated: true }).code(200);
    }
    return reply(400);
};

module.exports = new Controller();