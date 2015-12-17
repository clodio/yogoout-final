'use strict';

var MonitoringDAO = require('../daos/monitoring-dao');
var utils = require('../utils/utils');
var logger = require('../utils/logger');
var HttpClient = require('./HttpClient');
var Applications = require('../services/api/applications');
var SamlService = require('../services/saml-service');
var child_process = require('child_process');
var async = require('async');

var Service = function () {
    this.DESCRIPTIONS = {
        SONDE_ALLDEAD: 'Erreur interne, impossible d\'afficher les sondes',
        SONDE_RPM: 'Teste la présence du package RPM sur la machine courante',
        SONDE_I2AWS: 'Teste la capacité de joindre le Webservice I2A à partir du backend\n(listing des applications I2A)',
        SONDE_DBREAD: '- Teste la capacité à se connecter en lecture à la base de données.' +
        '\n- Retourne les 10 dernière lignes de la table MIGRATIONS,\nc\'est la liste des derniers scripts exécutées sur la base de données.',
        SONDE_SAML: '- Teste la capacité à former correctement la requêtre SAML de connexion,' +
        '\n- Teste la soumission de la requête à I2A' +
        '\n- Teste que le retour I2A est correct (une page redirgeant vers la page de login I2A)'
    };
};


Service.prototype.runAllSondes = function (saml_plugin, callback) {
    try {
        async.parallel(
            [
                function (callback) {
                    this.readPackageInfo('u0', callback);
                }.bind(this),

                function (callback) {
                    this.readPackageInfo('u1', callback);
                }.bind(this),

                function (callback) {
                    this.readPackageInfo('un', callback);
                }.bind(this),

                function (callback) {
                    this.testCallI2AWS(callback);
                }.bind(this),

                function (callback) {
                    this.testReadDatabase(callback);
                }.bind(this),

                function (callback) {
                    this.testSendSamlRequest(saml_plugin, callback);
                }.bind(this)

            ],
            function (err, results) {
                if (err) {
                    logger.log('error', err.message, err);
                    return callback([this.newSondeResult('ko', '-', '-', 'Internal Error : ' + err.message, err.stack, this.DESCRIPTIONS.SONDE_ALLDEAD)]);
                } else {
                    return callback(results);
                }
            }.bind(this)
        );
    } catch (error) {
        logger.log('error', error.message, error);
        return callback([this.newSondeResult('ko', '-', '-', 'Internal Error : ' + error.message, error.stack, this.DESCRIPTIONS.SONDE_ALLDEAD)]);
    }
};

Service.prototype.readPackageInfo = function (name, callback) {
    var startTime = utils.getEpochTime();
    child_process.exec('rpm -qi b7_-' + name, function (error, stdout, stderr) {
        var testTime = utils.computeTimeElapsedSinceEpoch(startTime);
        if (error) {
            // nothing to do, la sonde est toujours OK
        }
        callback(null, this.newSondeResult(null, 'RPM b7_-' + name, testTime, stdout, '', this.DESCRIPTIONS.SONDE_RPM));
    }.bind(this));
};

Service.prototype.testReadDatabase = function (callback) {
    var startTime = utils.getEpochTime();
    MonitoringDAO.selectMigrationTableLastRows(function (err, data) {
        var testTime = utils.computeTimeElapsedSinceEpoch(startTime);
        if (err) {
            callback(null, this.newSondeResult(err, 'Lecture BDD', testTime, err.message, err.stack, this.DESCRIPTIONS.SONDE_DBREAD));
        } else {
            callback(null, this.newSondeResult(err, 'Lecture BDD', testTime, this.formatMigrationRows(data), '', this.DESCRIPTIONS.SONDE_DBREAD));
        }
    }.bind(this));
};

Service.prototype.testSendSamlRequest = function (saml_plugin, callback) {

    var startTime = utils.getEpochTime();
    async.waterfall([
            function (callback) {
                SamlService.generateSamlLoginRequestUrl(saml_plugin, callback);
            },

            function (arg1, callback) {
                HttpClient.get(arg1, undefined, false, callback);
            }

        ], function (err, result) {

            var testTime = utils.computeTimeElapsedSinceEpoch(startTime);
            if (err) {
                return callback(null, this.newSondeResult(err, 'Login I2A', testTime, err.message, err.stack, this.DESCRIPTIONS.SONDE_SAML));
            } else {
                if (result.indexOf('<title>Authentification Courrier</title>') > -1) {
                    return callback(null, this.newSondeResult(null, 'Login I2A', testTime, 'I2A login page OK', '', this.DESCRIPTIONS.SONDE_SAML));
                } else {
                    return callback(null, this.newSondeResult('error', 'Login I2A', testTime, 'I2A call OK, mais pas page attendue non détectéé (\'Authentification Courrier\')', result, this.DESCRIPTIONS.SONDE_SAML));
                }
            }
        }.bind(this)
    );
};

Service.prototype.testCallI2AWS = function (callback) {
    var startTime = utils.getEpochTime();
    Applications.getI2AOnly(function (err, data) {
            var testTime = utils.computeTimeElapsedSinceEpoch(startTime);
            if (err) {
                callback(null, this.newSondeResult(err, 'Webservice I2A', testTime, err, err.stack, this.DESCRIPTIONS.SONDE_I2AWS));
            } else {
                callback(null, this.newSondeResult(err, 'Webservice I2A', testTime, 'Nombre résultat : ' + data.length, '', this.DESCRIPTIONS.SONDE_I2AWS));
            }
        }.bind(this)
    );
};

Service.prototype.newSondeResult = function (error, name, testTime, message, stackTrace, description) {
    var result = {};

    if (error) {
        result.etat = 'KO';
    } else {
        result.etat = 'OK';
    }
    result.nom = name;
    result.testTime = testTime;
    result.message = message;
    result.stackTrace = stackTrace;
    result.description = description;
    return result;
};

Service.prototype.formatMigrationRows = function (rows) {
    var str = '<table style="width:100%">';
    str += '<tr>';
    str += '<th>ID</th>';
    str += '<th>NAME</th>';
    str += '<th>DATE</th>';
    str += '</tr>';
    if (rows && Array.isArray(rows)) {
        for (var i = 0; i < rows.length; i++) {
            str += '<tr>';
            str += '<td>';
            str += rows[i].id;
            str += '</td>';
            str += '<td>';
            str += rows[i].name;
            str += '</td>';
            str += '<td>';
            str += rows[i].run_on;
            str += '</td>';
            str += '</tr>';
        }
    }
    str += '</table>';
    return str;
};


module.exports = new Service();