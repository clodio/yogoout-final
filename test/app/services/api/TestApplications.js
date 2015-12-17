'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var formatter = require('../../../../app/services/api/formatter');
var service = require('../../../../app/services/api/applications');
var filter = require('../../../../app/services/api/filter');
var HttpClient = require('../../../../app/services/HttpClient');
var errors = require('../../../../app/utils/errors');
var utils = require('../../../../app/utils/utils');
var config = require('../../../../config');

var userValidator = require('../../../../app/services/api/validators/userValidator');
var i2a_userApplicationsClient = require('../../../../app/services/api/client/i2a_userApplications');

describe('Test Application service', function () {


    var mock_formatter;
    var mock_config;
    var mock_httpclient;
    var mock_utils;
    var mock_filter;
    var mock_errors;
    var mock_userValidator;
    var mock_i2a_userApplicationsClient;
    var mock_this;

    beforeEach(function (done) {
        mock_formatter = sinon.mock(formatter);
        mock_config = sinon.mock(config);
        mock_httpclient = sinon.mock(HttpClient);
        mock_utils = sinon.mock(utils);
        mock_filter = sinon.mock(filter);
        mock_errors = sinon.mock(errors);
        mock_userValidator = sinon.mock(userValidator);
        mock_i2a_userApplicationsClient = sinon.mock(i2a_userApplicationsClient);
        mock_this = sinon.mock(service);
        done();
    });

    afterEach(function (done) {
        mock_formatter.restore();
        mock_config.restore();
        mock_httpclient.restore();
        mock_utils.restore();
        mock_filter.restore();
        mock_errors.restore();

        mock_i2a_userApplicationsClient.restore();
        mock_userValidator.restore();
        mock_this.restore();
        done();
    });

    it('getDefault', function (done) {

        // given
        mock_formatter.expects('formatDefaultAppList').returns("data");
        var spy = sinon.spy();

        // when
        service.getDefault(spy);

        // then
        assert(spy.calledWith(null, "data"));

        done();
    });

    it('if mock_webservice not activated getI2AOnly must call te API', function (done) {

        // given
        mock_config.expects('get').withArgs('webservices.i2a_allApplications_url').returns('fake_url');
        mock_config.expects('get').withArgs('webservices.i2a_ws_login').returns('login');
        mock_config.expects('get').withArgs('webservices.i2a_ws_password').returns('password');
        mock_utils.expects('loginPasswordToBasicAuth').withArgs('login', 'password').returns('Basic base64');
        mock_config.expects('get').withArgs('features.mock_webservice').returns(false);
        mock_formatter.expects('formatApplicationList').withArgs({}).returns("data");

        mock_httpclient.expects('get').withArgs(
            'fake_url',
            'Basic base64',
            true
        ).callsArgWith(3, null, {});

        var spy = sinon.spy();

        // when
        service.getI2AOnly(spy);

        // then
        assert(spy.calledWithExactly(null, "data"));

        done();
    });

    it('getI2AOnly if mock_webservice not activated and formatApplicationList fails then return an error', function (done) {

        // given
        var err = new Error();

        // and
        mock_config.expects('get').withArgs('webservices.i2a_allApplications_url').returns('fake_url');
        mock_config.expects('get').withArgs('webservices.i2a_ws_login').returns('login');
        mock_config.expects('get').withArgs('webservices.i2a_ws_password').returns('password');
        mock_utils.expects('loginPasswordToBasicAuth').withArgs('login', 'password').returns('Basic base64');
        mock_config.expects('get').withArgs('features.mock_webservice').returns(false);
        mock_formatter.expects('formatApplicationList').withArgs({}).throws(err);

        mock_httpclient.expects('get').withArgs(
            'fake_url',
            'Basic base64',
            true
        ).callsArgWith(3, null, {});

        var spy = sinon.spy();

        // when
        service.getI2AOnly(spy);

        // then
        assert(spy.calledWithExactly(err));

        done();
    });

    it('getI2AOnly if mock_webservice not activated and i2a does not return a successful status an error must should be returned', function (done) {

        // and
        mock_config.expects('get').withArgs('webservices.i2a_allApplications_url').returns('fake_url');
        mock_config.expects('get').withArgs('webservices.i2a_ws_login').returns('login');
        mock_config.expects('get').withArgs('webservices.i2a_ws_password').returns('password');
        mock_utils.expects('loginPasswordToBasicAuth').withArgs('login', 'password').returns('Basic base64');
        mock_config.expects('get').withArgs('features.mock_webservice').returns(false);

        mock_httpclient.expects('get').withArgs(
            'fake_url',
            'Basic base64',
            true
        ).callsArgWith(3, {status: 400});

        var spy = sinon.spy();

        // when
        service.getI2AOnly(spy);

        // then
        assert(spy.calledWithExactly({status: 400}));

        done();
    });

    it('if an error occurred use error class to respond client', function (done) {

        done();
    });

    it('getApplications concat results', function (done) {

        // given
        mock_this.expects('getDefault').callsArgWith(0, null, ["data1"]);
        mock_this.expects('getI2AOnly').callsArgWith(0, null, ["data2"]);

        // and
        mock_filter.expects('getMatches').withArgs("query", ["data1", "data2"]).returns("result");


        var spy = sinon.spy();

        // when
        service.getApplications("query", spy);

        // then
        spy.calledWithExactly("result");

        done();
    });

    it('if error getApplications must use errors class to respond the client', function (done) {

        var error = new Error();

        mock_this.expects('getDefault').callsArgWith(0, "Big error");
        mock_this.expects('getI2AOnly').callsArgWith(0, null, "some data");
        mock_errors.expects('throw').withArgs('R999', null, null, "Big error").throws(error);

        // when
        try {
            service.getApplications("query", "done");
            assert.fail();
        } catch (err) {
            expect(err).to.equal(error);
        }

        done();
    });

    it('if mock_webservice activated getI2AOnly must return hard coded values', function (done) {

        // given
        mock_config.expects('get').withArgs('features.mock_webservice').returns(true);
        mock_formatter.expects('formatApplicationList').returns("data");

        var spy = sinon.spy();

        // when
        service.getI2AOnly(spy);

        // then
        spy.calledWithExactly(null, "data");

        done();
    });

    it('getAppsByUserId with Authenticated user', function (done) {
        // GIVEN
        var callback = sinon.spy();
        mock_userValidator.expects('validateRhId').withArgs('RH123');
        mock_userValidator.expects('validateUserAuthentication').withArgs({ isAuthenticated: true }, 'RH123');
        mock_i2a_userApplicationsClient.expects('getAppsByUserId').withArgs('RH123', callback);

        // WHEN
        service.getAppsByUserId({ isAuthenticated: true }, 'RH123', callback);

        // THEN
        done();
    });

    it('getApps must return all default applications', function (done) {
        // GIVEN
        mock_formatter.expects('formatDefaultAppList').returns("data");

        // WHEN
        var result = service.getApps();

        // THEN
        expect(result).to.equal("data");

        done();
    });
});