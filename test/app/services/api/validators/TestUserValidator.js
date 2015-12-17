'use strict';

var expect = require('chai').expect;
var assert = require('assert');
var sinon = require('sinon');
var errors = require('../../../../../app/utils/errors');

var service = require('../../../../../app/services/api/validators/userValidator');

describe('test user Validator', function () {
    var mock_errors;

    before(function () {
        mock_errors = sinon.mock(errors);
    });

    after(function (done) {
        mock_errors.restore();
        done();
    });

    it('validateRhId and no rh id', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R200').throws(error);

        // WHEN
        try {
            service.validateRhId();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });

    it('validateRhId and not good format', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R201', 'tot45').throws(error);

        // WHEN
        try {
            service.validateRhId('tot45');
            assert.fail();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });

    it('validateRhId and proper format 4 letters', function (done) {
        // WHEN
        try {
            service.validateRhId('IDRH123');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateRhId and user self', function (done) {
        // WHEN
        try {
            service.validateRhId('self');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateRhId and proper format 3 letters', function (done) {
        // WHEN
        try {
            service.validateRhId('IDR123');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateUserAuthentication and proper auth and RH', function (done) {
        // WHEN
        try {
            service.validateUserAuthentication({
                isAuthenticated: true,
                credentials: {
                    uid: 'RHID123'
                }
            }, 'RHID123');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateUserAuthentication and proper auth and RH, but not same case => OK', function (done) {
        // WHEN
        try {
            service.validateUserAuthentication({
                isAuthenticated: true,
                credentials: {
                    uid: 'rhid123'
                }
            }, 'RHID123');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateUserAuthentication and proper auth and self id RH', function (done) {
        // WHEN
        try {
            service.validateUserAuthentication({
                isAuthenticated: true,
                credentials: {
                    uid: 'RH123'
                }
            }, 'self');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateUserAuthentication and RH id missmatch', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R203').throws(error);
        // WHEN
        try {
            service.validateUserAuthentication({
                isAuthenticated: true,
                credentials: {
                    uid: 'RH123'
                }
            }, 'RH456');
            assert.fail();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });

    it('validateUserAuthentication and no credentials', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R202').throws(error);
        // WHEN
        try {
            service.validateUserAuthentication({ isAuthenticated: true }, 'RH123');
            assert.fail();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });

    it('validateUserAuthentication and not authenticated', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R202').throws(error);
        // WHEN
        try {
            service.validateUserAuthentication({ isAuthenticated: false, credentials: { rhid: 'RH123' } }, 'RH123');
            assert.fail();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });

    it('validateUserAuthentication and missing auth', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withExactArgs('R202').throws(error);
        // WHEN
        try {
            service.validateUserAuthentication(undefined, 'RH123');
            assert.fail();
        } catch (e) {
            expect(e).to.equal(error);
        }
        done();
    });
});