'use strict';

var validator = require('./validators/userValidator');
var ApplicationService = require('./applications');

var Service = function () {};

Service.prototype.getFavoriteAppsByUserId = function (auth, user_rh_id) {
    validator.validateRhId(user_rh_id);
    validator.validateUserAuthentication(auth, user_rh_id);
    return ApplicationService.getApps();
};

Service.prototype.getUserById = function (auth, user_rh_id) {
    validator.validateRhId(user_rh_id);
    validator.validateUserAuthentication(auth, user_rh_id);
    var result = {};

    result.first_name = auth.credentials.givenName;
    result.last_name = auth.credentials.sn;
    result.uid = auth.credentials.uid;
    result.email = auth.credentials.email;
    result.phone = auth.credentials.telephoneNumber;
    result.title = auth.credentials.title;
    result.salutation = auth.credentials.personalTitle;

    return result;
};

module.exports = new Service();