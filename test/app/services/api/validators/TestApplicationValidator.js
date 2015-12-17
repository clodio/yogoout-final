'use strict';

var expect = require('chai').expect;
var assert = require('assert');
var sinon = require('sinon');
var errors = require('../../../../../app/utils/errors');

var service = require('../../../../../app/services/api/validators/applicationValidator');

describe('test application Validator', function () {
    var mock_errors;

    before(function () {
        mock_errors = sinon.mock(errors);
    });

    after(function (done) {
        mock_errors.restore();
        done();
    });

    it('validateApplicationDefault and bad_value', function (done) {
        // GIVEN
        var error = new Error();
        mock_errors.expects('throw').withArgs('R100', 'bad_value').throws(error);

        // WHEN
        try {
            service.validateApplicationDefault('bad_value');
            assert.fail();
        } catch (error) {
            expect(error).to.equal(error);
        }
        done();
    });

    it('validateApplicationDefault and type default', function (done) {
        // WHEN
        try {
            service.validateApplicationDefault('true');
        } catch (error) {
            assert.fail();
        }
        done();
    });

    it('validateApplicationDefault and type all', function (done) {
        // WHEN
        try {
            service.validateApplicationDefault('false');
        } catch (error) {
            assert.fail();
        }
        done();
    });
});