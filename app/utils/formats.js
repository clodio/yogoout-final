'use strict';

var Formats = function () {};

Formats.prototype.validateFormatEspaces = function (value) {
    if (value === null) {
        throw new Error('value cannot be null');
    }
    if (value === undefined) {
        throw new Error('value cannot be undefined');
    }
    if (!Array.isArray(value)) {
        throw new Error('expected array, got ' + typeof value);
    }
    if (value.length > 20) {
        throw new Error('array length cannot be bigger than 20');
    }
    value.forEach(function (object) {
        if (!object.hasOwnProperty('url') || !object.hasOwnProperty('libelle')) {
            throw new Error('array should only contain objects of type {libelle: \'libelle\', url: \'url\'}');
        }
        var urlregex = /^$|^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        if (!urlregex.test(object.url)) {
            throw new Error('property url of ' + JSON.stringify(object) + ' should be valid');
        }
    });
};

module.exports = new Formats();