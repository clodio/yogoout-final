'use strict';

var request = require('request');

var Service = function () { };

Service.prototype.get = function (url, authorization, isJson, callback) {

    request.get({
        url: url,
        headers: this.buildHeaders(isJson, authorization)
      },
      function (error, response, body) {

        if (error) {
            return callback(error);
        }

        if (response.statusCode >= 400) {
            return callback({status: response.statusCode, body: body});
        }

        try {
            if (isJson) {
                return callback(null, JSON.parse(body));
            } else {
                return callback(null, body);
            }
        } catch (err) {
            callback(err);
        }
    });
};

Service.prototype.buildHeaders = function (isJson, authorization) {
    var result = {};

    if (isJson) {
        result.Accept = 'application/json';
    }
    if (authorization) {
        result.Authorization = authorization;
    }
    return result;
};

module.exports = new Service();