'use strict';

var formatter = require('./formatter');
var config = require('../../../config');
var errors = require('../../utils/errors');
var utils = require('../../utils/utils');
var HttpClient = require('../../services/HttpClient');
var async = require('async');
var filter = require('./filter');
var i2a_userApplicationsClient = require('./client/i2a_userApplications');
var userValidator = require('./validators/userValidator');

var raw = {
    i2a: require('../../models/data/applications/i2a'),
    default: require('../../models/data/applications/default')
};

var Service = function () {};

Service.prototype.getApps = function () {
    return formatter.formatDefaultAppList(raw.default);
};

Service.prototype.getApplications = function (query, done) {

    async.parallel([
            function (callback) {
                this.getDefault(callback);
            }.bind(this),

            function (callback) {
                this.getI2AOnly(callback);
            }.bind(this)
        ],

        function (err, results) {
            if (err) {
                console.log(err);
                errors.throw('R999', null, null, err);
            }

            var data = filter.getMatches(query, results[0].concat(results[1]));
            done(data);
        });

};

Service.prototype.getDefault = function (done) {
    done(null, formatter.formatDefaultAppList(raw.default));
};

Service.prototype.getI2AOnly = function (done) {
    if (config.get('features.mock_webservice') === true) {
        return done(null, formatter.formatApplicationList(raw.i2a));
    }

    var authorization = utils.loginPasswordToBasicAuth(
        config.get('webservices.i2a_ws_login'),
        config.get('webservices.i2a_ws_password'));

    HttpClient.get(
        config.get('webservices.i2a_allApplications_url'),
        authorization,
        true,
        function (err, data) {
            if (err) {
                done(err);
            } else {
                try {
                    done(null, formatter.formatApplicationList(data));
                } catch (err2) {
                    done(err2);
                }
            }
        }
    );
};

Service.prototype.getAppsByUserId = function (auth, user_rh_id, callback) {
    userValidator.validateRhId(user_rh_id);
    userValidator.validateUserAuthentication(auth, user_rh_id);
    i2a_userApplicationsClient.getAppsByUserId(user_rh_id, callback);
};

module.exports = new Service();