'use strict';

var errors = require('../../../utils/errors');
var utils = require('../../../utils/utils');
var HttpClient = require('../../../services/HttpClient');
var config = require('../../../../config');
var formatter = require('./i2a_userApplications_formatter');

var raw = {
    i2a: require('../../../models/data/applications/i2a-user_applications')
};

var Client = function () {};

Client.prototype.getAppsByUserId = function (user_rh_id, callback) {
    if (config.get('features.mock_webservice')) {
        return callback(formatter.format(raw.i2a));
    }

    var authorization = utils.loginPasswordToBasicAuth(
        config.get('webservices.i2a_ws_login'),
        config.get('webservices.i2a_ws_password'));

    HttpClient.get(
        config.get('webservices.i2a_userApplications_url').replace('idrh', user_rh_id),
        authorization,
        true,
        function (err, data) {
            if (err) {
                errors.throw('R999');
            }
            callback(formatter.format(data));
        }
    );
};

module.exports = new Client();
