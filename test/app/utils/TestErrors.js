'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var assert = require('assert');

var Service = require('../../../app/utils/errors');
var Config = require('../../../config');
var Logger = require('../../../app/utils/logger');

describe('test error enumeration class', function () {

    var mock_this;
    var mock_config;
    var mock_logger;

    beforeEach(function () {
        mock_this   = sinon.mock(Service);
        mock_config = sinon.mock(Config);
        mock_logger = sinon.mock(Logger);
    });

    afterEach(function (done) {
        mock_this.restore();
        mock_config.restore();
        mock_logger.restore();
        done();
    });


    it('new error when empty code', function (done) {
        // GIVEN
        mock_this.expects('newBoomError').withArgs(
            500,
            'Une erreur interne est survenue',
            '999',
            undefined).returns("ERROR");
        // WHEN
        try {
            Service.throw();
            assert.fail();
        } catch (error) {
            // THEN
            expect(error).to.equal("ERROR");
        }
        done();
    });

    it('new error when unknown code', function (done) {
        // GIVEN
        mock_this.expects('newBoomError').withArgs(
            500,
            'Une erreur interne est survenue, code inconnu : 12345',
            '999',
            undefined).returns("ERROR");
        // WHEN
        try {
            Service.throw('12345');
            assert.fail();
        } catch (error) {
            // THEN
            expect(error).to.equal("ERROR");
        }
        done();
    });

    it('new error with proper code', function (done) {
        // GIVEN
        mock_this.expects('newBoomError').withArgs(
            403,
            'Vous n\'êtes pas authorisé à consulter cette ressource',
            '203',
            undefined).returns("ERROR");
        // WHEN
        try {
            Service.throw('R203');
            assert.fail();
        } catch (error) {
            // THEN
            expect(error).to.equal("ERROR");
        }
        done();
    });

    it('new error with error object', function (done) {
        // GIVEN
        mock_this.expects('newBoomError').withArgs(
            403,
            'Vous n\'êtes pas authorisé à consulter cette ressource',
            '203',
            "ERROR OBJECT").returns("ERROR");
        // WHEN
        try {
            Service.throw('R203', 1, 2, "ERROR OBJECT");
            assert.fail();
        } catch (error) {
            // THEN
            expect(error).to.equal("ERROR");
        }
        done();
    });

    it('new error with var injection', function (done) {
        // GIVEN
        mock_this.expects('newBoomError').withArgs(
            400,
            'L\'identifiant RH \'toto\' n\'est pas au format : 3 à 4 lettres et 3 chiffres',
            '201',
            undefined).returns("ERROR");
        // WHEN
        try {
            Service.throw('R201', 'toto');
            assert.fail();
        } catch (error) {
            // THEN
            expect(error).to.equal("ERROR");
        }
        done();
    });

    it('newBoomError with debug mode', function (done) {
        // GIVEN
        mock_config.expects('get').withArgs('logs.main_level').returns('debug');
        var expect_log = mock_logger.expects('log').withArgs('error', 'ERROR OBJECT');

        // WHEN
        var result = Service.newBoomError(400, 'hello', '123', 'ERROR OBJECT');

        // THEN
        expect(result.output.statusCode).to.equal(400);
        expect(result.message).to.equal('hello');
        expect(result.output.payload.code).to.equal('123');
        expect(result.output.payload.details).to.equal('ERROR OBJECT');
        expect(result.output.headers.toString()).to.equal({'Access-Control-Allow-Credentials': 'true'}.toString());
        assert(expect_log.calledOnce);
        done();
    });

    it('newBoomError without debug mode', function (done) {
        // GIVEN
        mock_config.expects('get').withArgs('logs.main_level').returns('info');
        var expect_log = mock_logger.expects('log').withArgs('error', 'ERROR OBJECT');

        // WHEN
        var result = Service.newBoomError(400, 'hello', '123', 'ERROR OBJECT');

        // THEN
        expect(result.output.statusCode).to.equal(400);
        expect(result.message).to.equal('hello');
        expect(result.output.payload.code).to.equal('123');
        expect(result.output.payload.details).to.equal(undefined);
        expect(result.output.headers.toString()).to.equal({'Access-Control-Allow-Credentials': 'true'}.toString());
        assert(expect_log.calledOnce);
        done();
    });

    it('newBoomError without error object', function (done) {
        // GIVEN
        mock_config.expects('get').withArgs('logs.main_level').returns('debug');
        var expect_log = mock_logger.expects('log');

        // WHEN
        var result = Service.newBoomError(400, 'hello', '123');

        // THEN
        expect(result.output.statusCode).to.equal(400);
        expect(result.message).to.equal('hello');
        expect(result.output.payload.code).to.equal('123');
        expect(result.output.payload.details).to.equal(undefined);
        expect(result.output.headers.toString()).to.equal({'Access-Control-Allow-Credentials': 'true'}.toString());
        assert(expect_log.notCalled);
        done();
    });



});