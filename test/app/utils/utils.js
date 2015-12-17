'use strict';

var sinon = require('sinon');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var utilObj = require('../../../app/utils/utils');
var config = require('../../../config');

describe('Util object', function () {
    var mock_this;
    var mock_config;

    beforeEach(function () {
        mock_this   = sinon.mock(utilObj);
        mock_config = sinon.mock(config);
    });

    afterEach(function (done) {
        mock_this.restore();
        mock_config.restore();
        done();
    });

    it('getEpochTime', function (done) {
        // WHEN
        var result = utilObj.getEpochTime();
        // THEN
        expect(result).to.be.at.most((new Date).getTime());

        done();
    });

    it('computeTimeElapsedSinceEpoch', function (done) {
        // GIVEN
        var epoch = (new Date).getTime();
        // WHEN
        var result = utilObj.computeTimeElapsedSinceEpoch(epoch-1000);
        // THEN
        expect(result).to.be.at.least(1000);

        done();
    });

    it('loginPasswordToBasicAuth', function (done) {
        // WHEN
        mock_this.expects('encodeBase64').withArgs("login:password").returns("AAAA");
        var result = utilObj.loginPasswordToBasicAuth("login", "password");
        // THEN
        expect(result).to.equal('Basic AAAA');

        done();
    });

    it('getURL should return a well formatted URL', function (done) {
        // given
        mock_config.expects('get').withArgs('port_ecoute').returns(8081);
        mock_config.expects('get').withArgs('protocole').returns('http');
        mock_config.expects('get').withArgs('nom_de_domaine').returns('fake.hostname.com');
        mock_config.expects('get').withArgs('port_dans_url').returns(true);

        // then
        expect(utilObj.getURL()).to.equal('http://fake.hostname.com:8081');

        done();
    });

    it('getURL_NoProtocol should return url wihthout protocol', function (done) {
        // given
        mock_config.expects('get').withArgs('port_ecoute').returns(8081);
        mock_config.expects('get').withArgs('nom_de_domaine').returns('fake.hostname.com');
        mock_config.expects('get').withArgs('port_dans_url').returns(true);

        // then
        expect(utilObj.getURL_NoProtocol()).to.equal('fake.hostname.com:8081');

        done();
    });

    it('should not include port in the URL if port_in_url is set to false', function (done) {
        // given
        mock_config.expects('get').withArgs('port_ecoute').returns(8081);
        mock_config.expects('get').withArgs('protocole').returns('http');
        mock_config.expects('get').withArgs('nom_de_domaine').returns('fake.hostname.com');
        mock_config.expects('get').withArgs('port_dans_url').returns(false);

        // then
        expect(utilObj.getURL()).to.equal('http://fake.hostname.com');

        done();
    });

    it('getPortIfNeeded not accessible', function (done) {
        // given
        mock_config.expects('get').withArgs('port_ecoute').returns(8081);
        mock_config.expects('get').withArgs('port_dans_url').returns(true);

        // then
        try {
            utilObj.getPortIfNeeded();
            assert.fail();
        } catch (e) {
        }

        done();
    });

    it('encodeBase64', function (done) {
        // when
        var result = utilObj.encodeBase64('FAKE:VALUE');

        // then
        result.should.equal('RkFLRTpWQUxVRQ==');

        done();
    });

    it('should return a cloned object', function (done) {
        // given
        var obj1 = { a: '1', b: { c: '2' } };

        // when
        var obj2 = utilObj.clone(obj1);
        obj2.b.c = '12';

        // then
        expect(obj1.b.c).to.equal('2');

        done();
    });
});