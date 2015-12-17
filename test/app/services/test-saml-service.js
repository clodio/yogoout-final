var expect = require('chai').expect;
var sinon = require('sinon');
var should = require('chai').should();
var assert = require('chai').assert;

var service = require('../../../app/services/saml-service');
var utils = require('../../../app/utils/utils');
var Config = require('../../../config');

describe('test-saml-service', function () {
    var mock_utils;
    var mock_this;
    var mock_config;

    beforeEach(function () {
        mock_utils = sinon.mock(utils);
        mock_this = sinon.mock(service);
        mock_config = sinon.mock(Config);
    });

    afterEach(function (done) {
        mock_utils.restore();
        mock_this.restore();
        mock_config.restore();
        done();
    });

    it('generateSamlLoginRequestUrl & mock=true', function (done) {
        // GIVEN
        var saml_instance = new Object();
        saml_instance.getAuthorizeUrl = sinon.spy();
        var spy_callback = sinon.spy();
        mock_config.expects('get').withArgs('features.activer_connexion_i2a').returns(false);
        mock_utils.expects('getURL').returns('URL');

        // WHEN
        service.generateSamlLoginRequestUrl(saml_instance, spy_callback);

        // THEN
        assert(saml_instance.getAuthorizeUrl.notCalled);
        assert(spy_callback.calledWith(null, 'URL/sp/assert'));
        done();
    });

    it('generateSamlLoginRequestUrl & mock=false', function (done) {
        // GIVEN
        var saml_instance = new Object();
        saml_instance.getAuthorizeUrl = sinon.stub();
        var spy_callback = sinon.spy();
        saml_instance.getAuthorizeUrl.callsArgWith(1, undefined, 'URL');
        mock_config.expects('get').withArgs('features.activer_connexion_i2a').returns(true);

        // WHEN
        service.generateSamlLoginRequestUrl(saml_instance, spy_callback);

        // THEN
        assert(spy_callback.calledWith(undefined, 'URL'));
        done();
    });


});
