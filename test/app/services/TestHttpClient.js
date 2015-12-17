var expect = require('chai').expect;
var sinon = require('sinon');
var should = require('chai').should();
var assert = require('chai').assert;

var service = require('../../../app/services/HttpClient');
var request = require('request');

describe('test monitoring service', function () {
    var mock_Request;
    var mock_this;

    beforeEach(function () {
        mock_Request = sinon.mock(request);
        mock_this = sinon.mock(service);
    });

    afterEach(function (done) {
        mock_Request.restore();
        mock_this.restore();
        done();
    });

    it('buildHeaders json=true', function (done) {
        // WHEN
        var result = service.buildHeaders(true, null);

        // THEN
        result.should.have.property('Accept').equal('application/json');
        result.should.not.have.property('Authorization');
        done();
    });
    it('buildHeaders json=false', function (done) {
        // WHEN
        var result = service.buildHeaders(false, null);

        // THEN
        result.should.not.have.property('Accept');
        result.should.not.have.property('Authorization');
        done();
    });

    it('buildHeaders Authorization=toto', function (done) {
        // WHEN
        var result = service.buildHeaders(false, "toto");

        // THEN
        result.should.not.have.property('Accept');
        result.should.have.property('Authorization').equal("toto");
        done();
    });

    it('get OK & json=false', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var response = {statusCode: 200};

        mock_this.expects('buildHeaders').withArgs(false, "toto").returns("headers");
        mock_Request.expects('get').withArgs(
            {
                url: "url",
                headers: "headers"
            }
        ).callsArgWith(1, null, response, "body");

        // WHEN
        service.get("url", "toto", false, spy);

        // THEN
        assert(spy.calledWith(null, "body"));

        done();
    });

    it('get OK & json=true', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var response = {statusCode: 200};

        mock_this.expects('buildHeaders').withArgs(true, "toto").returns("headers");
        mock_Request.expects('get').withArgs(
            {
                url: "url",
                headers: "headers"
            }
        ).callsArgWith(1, null, response, "{ \"some\": 123 }");

        // WHEN
        service.get("url", "toto", true, spy);

        // THEN
        assert(spy.calledWith(null, { some: 123}));

        done();
    });

    it('get OK & json=true but parsing error', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var response = {statusCode: 200};

        mock_this.expects('buildHeaders').withArgs(true, "toto").returns("headers");
        mock_Request.expects('get').withArgs(
            {
                url: "url",
                headers: "headers"
            }
        ).callsArgWith(1, null, response, "{ this is not json }");

        // WHEN
        service.get("url", "toto", true, spy);

        // THEN
        expect(spy.args[0].toString()).to.include("SyntaxError");

        done();
    });

    it('get OK & status >= 400', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var response = {statusCode: 401};

        mock_this.expects('buildHeaders').withArgs(true, "toto").returns("headers");
        mock_Request.expects('get').withArgs(
            {
                url: "url",
                headers: "headers"
            }
        ).callsArgWith(1, null, response, "{ this is not json }");

        // WHEN
        service.get("url", "toto", true, spy);

        // THEN
        assert(spy.calledWith({status: 401, body: "{ this is not json }"}));

        done();
    });

    it('get KO, unkown error', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_this.expects('buildHeaders').withArgs(true, "toto").returns("headers");
        mock_Request.expects('get').withArgs(
            {
                url: "url",
                headers: "headers"
            }
        ).callsArgWith(1, "big error", "reponse", "very bad");

        // WHEN
        service.get("url", "toto", true, spy);

        // THEN
        assert(spy.calledWith("big error"));

        done();
    });


});
