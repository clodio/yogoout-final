'use strict';

var boom = require('boom');
var logger = require('./logger');
var config = require('../../config');

var Service = function () {
    this.ERROR_ENUM = {
        R100: { http_status: 400, message: 'Le parametre \'isDefault\' doit avoir une valeur parmi [\'true\', \'false\'], valeur reçue : \'{1}\'' },
        R200: { http_status: 400, message: 'L\'identifiant RH est vide' },
        R201: { http_status: 400, message: 'L\'identifiant RH \'{1}\' n\'est pas au format : 3 à 4 lettres et 3 chiffres' },
        R202: { http_status: 401, message: 'Vous devez être authentifié au bandeau pour utiliser ce service' },
        R203: { http_status: 403, message: 'Vous n\'êtes pas authorisé à consulter cette ressource' },
        R999: { http_status: 500, message: 'Une erreur interne est survenue' }
    };
};

Service.prototype.throw = function (error_id, arg1, arg2, error_object) {
    if (error_id === undefined) {
        throw this.newBoomError(
            500,
            'Une erreur interne est survenue',
            '999',
            error_object);
    }

    var error = this.ERROR_ENUM[error_id];

    if (error === undefined) {
        throw this.newBoomError(
            500,
            'Une erreur interne est survenue, code inconnu : ' + error_id,
            '999',
            error_object);
    } 

    throw this.newBoomError(
        error.http_status,
        error.message.replace('{1}', arg1).replace('{2}', arg2),
        error_id.substring(1, 4),
        error_object);
};

Service.prototype.newBoomError = function (status, message, code, error_object) {
    var boomError = boom.create(status, message);
    boomError.output.payload.code = code;
    boomError.output.headers = {'Access-Control-Allow-Credentials': 'true'};
    if (error_object) {
        if (config.get('logs.main_level') === 'debug') {
            boomError.output.payload.details = error_object;
        }
        logger.log('error', error_object);
    }
    return boomError;
};

module.exports = new Service();