'use strict';

var logger = require('../utils/logger');
var config = require('../../config.js');
var utils = require('../utils/utils');
var SamlService = require('../services/saml-service');
var SessionService = require('../services/session-service');
var fs = require('fs');

var Controller = function () {
};
var LoggerService = require('../utils/logger');

/**
 * Endpoint to retrieve metadata
 * @function
 * @param {Object} request - A Hapi Request
 * @param {Object} reply - A Hapi Reply
 */
Controller.prototype.metadata = function (request, reply) {
    var saml = request.server.plugins['hapi-passport-saml'].instance;
    return reply(saml.generateServiceProviderMetadata(fs.readFileSync(config.get('passport.sp.cert')).toString()))
        .type('application/xml');
};

/**
 * Login
 * @function
 * @param {Object} request - A Hapi Request
 * @param {Object} reply - A Hapi Reply
 */
Controller.prototype.login = function (request, reply) {

    SamlService.generateSamlLoginRequestUrl(
        request.server.plugins['hapi-passport-saml'].instance,
        function (err, loginUrl) {
            if (err) {
                return reply.code(500).state('auto_connect', { lastVisitDate: new Date() });
            }
            return reply.redirect(loginUrl).state('auto_connect', { lastVisitDate: new Date() });
        }
    );
};

/**
 * Assert endpoint for when login completes
 * @function
 * @param {Object} request - A Hapi Request
 * @param {Object} reply - A Hapi Reply
 */
Controller.prototype.assert = function (request, reply) {
    if (!config.get('features.activer_connexion_i2a')) {
        if (config.get('features.connexion_sans_i2a_reussie')) {
            request.auth.session.set(SessionService.createFakeUserInfos());
            return reply.view('login-response.ejs')
                .code(200)
                .state('auto_connect', { lastVisitDate: new Date() });
        }
        return reply.view('error-login-response.ejs', { prefix: utils.getURL(), message: '' })
            .code(500)
            .state('auto_connect', { lastVisitDate: new Date() });
    }

    var saml = request.server.plugins['hapi-passport-saml'].instance;
    if (request.payload.SAMLRequest) {
        // Implement your SAMLRequest handling here
        return reply.view('error-login-response.ejs', { prefix: utils.getURL(), message: '' })
            .code(500)
            .state('auto_connect', { lastVisitDate: new Date() });
    }
    if (request.payload.SAMLResponse) {
        // Handles SP use cases, e.g. IdP is external and SP is Hapi
        saml.validatePostResponse(request.payload, function (err, profile) {
            if (err !== null) {
                logger.log('error', err);
                return reply.view('error-login-response.ejs', { prefix: utils.getURL(), message: err })
                    .code(500)
                    .state('auto_connect', { lastVisitDate: new Date() });
            }
            request.auth.session.set(profile);
            return reply.view('login-response.ejs')
                .code(200)
                .state('auto_connect', { lastVisitDate: new Date() });
        });
    }
};

/**
 * Logout
 * @function
 * @param {Object} request - A Hapi Request
 * @param {Object} reply - A Hapi Reply
 */
Controller.prototype.logout = function (request, reply) {
    var saml = request.server.plugins['hapi-passport-saml'].instance;

    saml.getLogoutUrl(request, function (err, url) {
        if (err !== null) {
            return reply.code(500);
        }
        return reply.redirect(url);
    });
};

Controller.prototype.printRequest = function (request, reply) {
    LoggerService.log('info', request.payload);
    reply(request.payload);
};

module.exports = new Controller();