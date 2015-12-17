'use strict';

var applications = require('../../services/api/applications');

var Controller = function () {};

Controller.prototype.getApplications = function (request, reply) {
    applications.getApplications(request.query, function (data) {
        reply(data);
    });
};

Controller.prototype.getAppsByUserId = function (request, reply) {
    applications.getAppsByUserId(request.auth, request.params.id, function (list) {
        reply(list);
    });
};

module.exports = new Controller();