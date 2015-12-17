'use strict';

var errors = require('../../../utils/errors');

var Validator = function () {
};

Validator.prototype.validateApplicationDefault = function (_default) {
    if (_default) {
        if (_default !== 'true' && _default !== 'false') {
            errors.throw('R100', _default);
        }
    }
};

module.exports = new Validator();