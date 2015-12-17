'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');

var config = require('../../../../../config');
var errors = require('../../../../../app/utils/errors');
var utils = require('../../../../../app/utils/utils');
var client = require('../../../../../app/services/api/client/i2a_userApplications');
var HttpClient = require('../../../../../app/services/HttpClient');
var formatter = require('../../../../../app/services/api/client/i2a_userApplications_formatter');

describe('i2a userApplications webservice client', function () {
    var mock_HttpClient;
    var mock_errors;
    var mock_utils;
    var mock_formatter;
    var stub_config_get;

    beforeEach(function () {
        mock_HttpClient = sinon.mock(HttpClient);
        mock_errors = sinon.mock(errors);
        mock_utils = sinon.mock(utils);
        mock_formatter = sinon.mock(formatter);
        stub_config_get = sinon.stub(config, 'get');
    });

    afterEach(function (done) {
        mock_HttpClient.restore();
        mock_errors.restore();
        mock_utils.restore();
        mock_formatter.restore();
        stub_config_get.restore();
        done();
    });

    it('getAppsByUserId with user_id (i2a online mode) with no error should callback the formatted payload', function (done) {
        // GIVEN
        var callback = sinon.spy();
        stub_config_get.withArgs('webservices.i2a_userApplications_url').returns('https://false.api.fr/utilisateur/service/idrh/intranet');
        stub_config_get.withArgs('webservices.i2a_ws_login').returns('login');
        stub_config_get.withArgs('webservices.i2a_ws_password').returns('password');
        stub_config_get.withArgs('features.mock_webservice').returns(false);
        mock_utils.expects('loginPasswordToBasicAuth').withArgs('login', 'password').returns('Basic base64');

        mock_HttpClient.expects('get').withArgs(
            'https://false.api.fr/utilisateur/service/RH123/intranet',
            'Basic base64',
            true)
        .callsArgWith(3, null, {data: true});
        mock_formatter.expects('format').withArgs({data: true}).returns({data: false});

        // WHEN
        client.getAppsByUserId('RH123', callback);

        // THEN
        assert(callback.calledWith({data: false}));
        assert(callback.calledOnce);
        done();
    });

    it('getAppsByUserId with user_id (i2a online mode) with error should throw Boom', function (done) {
        // GIVEN
        var callback = sinon.spy();
        var error = new Error();
        stub_config_get.withArgs('webservices.i2a_userApplications_url').returns('https://false.api.fr/utilisateur/service/idrh/intranet');
        stub_config_get.withArgs('webservices.i2a_ws_login').returns('login');
        stub_config_get.withArgs('webservices.i2a_ws_password').returns('password');
        stub_config_get.withArgs('features.mock_webservice').returns(false);
        mock_utils.expects('loginPasswordToBasicAuth').withArgs('login', 'password').returns('Basic base64');

        mock_HttpClient.expects('get').withArgs(
            'https://false.api.fr/utilisateur/service/RH123/intranet',
            'Basic base64',
            true)
        .callsArgWith(3, "BAD ERROR", null);

        mock_errors.expects('throw').withArgs().throws(error);

        // WHEN
        try {
            client.getAppsByUserId('RH123', callback);
            assert.fail();
        } catch(testedError) {
            assert(testedError === error);
        }
        // THEN
        assert(callback.notCalled);
        done();
    });

    it('getAppsByUserId with user_id (i2a offline mode) should callback', function (done) {
        // GIVEN
        var callback = sinon.spy();
        stub_config_get.withArgs('features.mock_webservice').returns(true);
        mock_formatter.expects('format').returns({data: false});

        // WHEN
        client.getAppsByUserId('RH123', callback);

        // THEN
        assert(callback.calledOnce);
        assert(callback.calledWith({data: false}));
        done();
    });
});