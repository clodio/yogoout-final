'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var service = require('../../../../app/services/api/users');
var userValidator = require('../../../../app/services/api/validators/userValidator');
var ApplicationService = require('../../../../app/services/api/applications');

describe('test users service', function () {
    var mock_userValidator;
    var mock_ApplicationService;

    before(function () {
        mock_userValidator = sinon.mock(userValidator);
        mock_ApplicationService = sinon.mock(ApplicationService);
    });

    after(function (done) {
        mock_userValidator.restore();
        mock_ApplicationService.restore();
        done();
    });

    it('getFavoriteAppsByUserId', function (done) {
        // GIVEN
        mock_userValidator.expects('validateRhId').withArgs('RH123');
        mock_userValidator.expects('validateUserAuthentication').withArgs({ isAuthenticated: true }, 'RH123');
        mock_ApplicationService.expects('getApps').withArgs().returns("RESULT");

        // WHEN
        var result = service.getFavoriteAppsByUserId({ isAuthenticated: true }, 'RH123');

        // THEN
        expect(result).to.equal("RESULT");

        done();
    });

    it('getUserById', function (done) {
        // GIVEN
        var auth = {
            isAuthenticated: true,
            credentials: {
                    givenName: "John",
                    sn: "Doe",
                    uid: "RH123",
                    email: "john@octo.com",
                    telephoneNumber: "0123456789",
                    title: "Chef de Projet",
                    personalTitle: "Mr"
            }
        };
        mock_userValidator.expects('validateRhId').withArgs('RH123');
        mock_userValidator.expects('validateUserAuthentication').withArgs(auth, 'RH123');

        // WHEN
        var result = service.getUserById(auth, 'RH123');

        // THEN
        expect(result.first_name).to.equal("John");
        expect(result.last_name).to.equal("Doe");
        expect(result.uid).to.equal("RH123");
        expect(result.email).to.equal("john@octo.com");
        expect(result.phone).to.equal("0123456789");
        expect(result.title).to.equal("Chef de Projet");
        expect(result.salutation).to.equal("Mr");

        done();
    });
});