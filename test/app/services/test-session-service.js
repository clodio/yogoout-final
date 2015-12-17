var expect = require('chai').expect;
var sinon = require('sinon');
var should = require('chai').should();
var assert = require('chai').assert;

var service = require('../../../app/services/session-service');
var utils = require('../../../app/utils/utils');
var Config = require('../../../config');

describe('test-session-service', function () {

    beforeEach(function () {
    });

    afterEach(function (done) {
        done();
    });

    it('injectCredentials', function (done) {
        // GIVEN
        var request_auth = {
            credentials : {
                givenName : 'George',
                sn : 'Dupont'
            }
        };
        var json = {};

        // WHEN
        service.injectCredentials(json, request_auth);

        // THEN
        json.should.have.property('user');
        json.user.should.have.property('full_name').equal('George DUPONT');
        json.user.should.have.property('fname').equal('George');
        json.user.should.have.property('lname').equal('DUPONT');
        json.user.should.have.property('initials').equal('GD');
        done();
    });

    it('injectCredentials when missing last name & first name', function (done) {
        // GIVEN
        var request_auth = {
            credentials : {}
        };
        var json = {};

        // WHEN
        service.injectCredentials(json, request_auth);

        // THEN
        json.should.have.property('user');
        json.user.should.have.property('full_name').equal(' ');
        json.user.should.have.property('fname').equal('');
        json.user.should.have.property('lname').equal('');
        json.user.should.have.property('initials').equal('');
        done();
    });

    it('createFakeUserInfos', function (done) {
        // WHEN
        var result = service.createFakeUserInfos();

        // THEN
        result.should.have.property('uid').equal('RHID007');
        result.should.have.property('givenName').equal('John');
        result.should.have.property('sn').equal('DURAND');
        result.should.have.property('email').equal('john.durant@laposte.fr');
        result.should.have.property('telephoneNumber').equal('0123456789');
        result.should.have.property('title').equal('Chef de projet');
        result.should.have.property('personalTitle').equal('Mr');
        done();
    });

});
