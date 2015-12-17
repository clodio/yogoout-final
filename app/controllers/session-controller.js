'use strict';

var logger = require('../utils/logger');
var SessionService = require('../services/session-service');

var Controller = function () {};

Controller.prototype.login = function (request, reply) {
    request.auth.session.set(SessionService.createFakeUserInfos());

    reply.redirect(request.info.referrer)
        .state('auto_connect', {lastVisitDate: new Date()});
};

Controller.prototype.devLoginSaml = function (request, reply) {
    reply({redirect: 'ok'});
};

Controller.prototype.isAuthenticated = function (request, reply) {
    reply({is_authenticated: request.auth.isAuthenticated});
};

Controller.prototype.logout = function (request, reply) {
    logger.log('info', request.auth.session);
    request.auth.session.clear();
    logger.log('debug', request.info);

    reply({ is_authenticated: false})
        .state('auto_connect', {lastVisitDate: new Date()});
};

module.exports = new Controller();