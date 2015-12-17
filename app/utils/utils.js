'use strict';

var config = require('../../config.js');

var UtilObj = function () {};

UtilObj.prototype.getURL = function () {
    var url = config.get('protocole') + '://';
    url += config.get('nom_de_domaine');
    url += getPortIfNeeded();

    return url;
};

UtilObj.prototype.getURL_NoProtocol = function () {
    return config.get('nom_de_domaine') + getPortIfNeeded();
};

UtilObj.prototype.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

UtilObj.prototype.encodeBase64 = function (str) {
    var b = new Buffer(str);
    return b.toString('base64');
};

UtilObj.prototype.loginPasswordToBasicAuth = function (login, password) {
    return 'Basic ' + this.encodeBase64(login + ':' + password);
};

UtilObj.prototype.computeTimeElapsedSinceEpoch = function (startEpochTime) {
    return ((new Date()).getTime() - startEpochTime);
};

UtilObj.prototype.getEpochTime = function () {
    return (new Date()).getTime();
};

var getPortIfNeeded = function () {
    if (config.get('port_dans_url')) {
        return ':' + config.get('port_ecoute');
    } else {
        return '';
    }
};

module.exports = new UtilObj();