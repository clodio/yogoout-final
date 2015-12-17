'use strict';

var Service = function () {};

Service.prototype.injectCredentials = function (targetObject, request_auth) {
    if (request_auth && request_auth.credentials) {

		targetObject.user = {};
		var escaped_fname = request_auth.credentials.givenName || '';
		var escaped_lname = (request_auth.credentials.sn || '').toUpperCase();

        targetObject.user.full_name = escaped_fname + ' ' + escaped_lname;
        targetObject.user.fname = escaped_fname;
        targetObject.user.lname = escaped_lname;
        targetObject.user.initials = escaped_fname.charAt(0) + escaped_lname.charAt(0);
    }
};

Service.prototype.createFakeUserInfos = function () {
	return {
        uid: 'RHID007',
        givenName: 'John',
        sn: 'DURAND',
        email: 'john.durant@laposte.fr',
        telephoneNumber: '0123456789',
        title: 'Chef de projet',
        personalTitle: 'Mr'
    };
};

module.exports = new Service();