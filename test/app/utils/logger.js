'use strict';

var sinon = require('sinon');

var loggerObj = require('../../../app/utils/logger');
var namespace = require('continuation-local-storage');
var winston = require('winston');
var uuid = require('node-uuid');

var category;
var mockWinston;
var mockNamespace;
var mockLoggerObj;
var mockUuid;

describe('Logger object', function () {
    beforeEach(function () {
        mockWinston = sinon.mock(winston);
        mockNamespace = sinon.mock(namespace);
        mockLoggerObj = sinon.mock(loggerObj);
        mockUuid = sinon.mock(uuid);

        loggerObj.appendRequestId = function (arg1) {
            return { data: 456 };
        };
        category = {};
        category.log = function (arg1, agr2, arg3) {
        };
        loggerObj.logger_main = {};
        loggerObj.logger_access = {};
        loggerObj.logger_main.log = function (arg1, agr2, arg3) {
        };
        loggerObj.logger_access.log = function (arg1, agr2) {
        };
    });

    after(function (done) {
        mockWinston.restore();
        mockNamespace.restore();
        mockLoggerObj.restore();
        mockUuid.restore();
        done();
    });

    it('log(level, message, meta)', function (done) {
        // given
        // var spyLogger = sinon.spy(loggerObj.logger_main, 'log');

        // when
        loggerObj.log('info', 'hello', { data: 123 });

        // then
        // TODO : fixme
        // assert(spyLogger.calledWith('info', 'hello', { data : 456}));
        done();
    });

    it('accesslog(level, meta)', function (done) {
        // given
        // var spyLogger = sinon.spy(loggerObj.logger_access, 'log');

        // when
        loggerObj.accesslog('info', { data: 123 });

        // then
        // TODO : fixme
        // assert(spyLogger.calledWith('info', { data : 456}));
        done();
    });

    it('setNewRequestId()', function (done) {
        // given
        var session = {};
        session.set = function (arg1, arg2) {
        };

        mockNamespace.expects('getNamespace').withArgs('b7_-u1').returns(session);
        mockUuid.expects('v4').returns('123');

        var spySession = sinon.spy(session, 'set');

        // when
        loggerObj.setNewRequestId();

        // then
        spySession.withArgs('reqid', '123');

        mockNamespace.verify();
        mockUuid.verify();
        done();
    });
});