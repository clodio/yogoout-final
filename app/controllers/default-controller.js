'use strict';

var config = require('../../config.js');
var utils = require('../utils/utils');
var SessionService = require('../services/session-service');

var Controller = function () {};

Controller.prototype.getHomePage = function (request, reply) {
    reply.view('index.ejs', {
        baseURL: utils.getURL()
    });
};

Controller.prototype.getTestConnexionEvent = function (request, reply) {
    reply.view('test/dispatch-connexion-event.ejs', {
        baseURL: utils.getURL()
    });
};

Controller.prototype.getTestBrowserEncapsulation = function (request, reply) {
    reply.view('test/browser-libraries-encapsulation.ejs', {
        baseURL: utils.getURL()
    });
};

Controller.prototype.getTestResetCSS = function (request, reply) {
    reply.view('test/reset-css.ejs', {
        baseURL: utils.getURL()
    });
};

Controller.prototype.getTemplate = function (request, reply) {
    var json = {
        prefix: utils.getURL(),
        is_authenticated: (request.auth && request.auth.isAuthenticated),
        link: {
            search: config.get('liens_statiques.search'),
            subscriptions: config.get('liens_statiques.my_subscriptions'),
            home: config.get('liens_statiques.home'),
            wac: config.get('liens_statiques.wac')
        },
        popup: config.get('features.activer_popup_connexion'),
        espaces: config.get('espaces'),
        auto_connect: config.get('features.auto_connect'),
        is_first_visit: (request.state.auto_connect === undefined)
    };

    SessionService.injectCredentials(json, request.auth);

    reply.view('bandeau.ejs', json).state('auto_connect', { lastVisitDate: new Date() });
};

module.exports = new Controller();