'use strict';

var errors = require('../../../utils/errors');

var Validator = function () {
};

Validator.prototype.validateRhId = function (rh_id) {
    if (!rh_id) {
        errors.throw('R200');
    } else {
        if (rh_id === 'self') {
            return;
        }
        if (!rh_id.match(/^\w{3,4}\d{3}$/)) {
            errors.throw('R201', rh_id);
        }
    }
};

Validator.prototype.validateUserAuthentication = function (auth, rh_id) {
    if (auth === undefined || auth.credentials === undefined || !auth.isAuthenticated) {
        errors.throw('R202');
    }
    if (rh_id === 'self') {
        return;
    }
    if (auth.credentials.uid.toLowerCase() !== rh_id.toLowerCase()) {
        errors.throw('R203');
    }
};

module.exports = new Validator();