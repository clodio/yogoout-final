'use strict';

var config = require('../../config.js');
var utils = require('../utils/utils');
var MonitoringService = require('../services/MonitoringService');


var Controller = function () {};

Controller.prototype.runAllSondes = function (request, reply) {
    MonitoringService.runAllSondes(request.server.plugins['hapi-passport-saml'].instance, function (data) {
        reply.view('monitoring.ejs', {
            hostname: config.get('environnement'),
            time: new Date(),
            revision: config.get('revision'),
            prefix: utils.getURL(),
            sondes: data
        });
    });
};

module.exports = new Controller();