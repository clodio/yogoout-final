'use strict';

var config = require('../../config.js');
var utils = require('../utils/utils');

var SP_ASSERT_URL = '/sp/assert';

var Service = function () {};


Service.prototype.generateSamlLoginRequestUrl = function (samlPluginInstance, callback) {
	
	if (!config.get('features.activer_connexion_i2a')) {
        return callback(null, utils.getURL() + SP_ASSERT_URL);
    }

	samlPluginInstance.getAuthorizeUrl(
		{ },
		function (err, url) {
			callback(err, url);
		}
    );
};

module.exports = new Service();