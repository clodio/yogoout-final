var expect = require('chai').expect;
var sinon = require('sinon');
var should = require('chai').should();
var assert = require('chai').assert;

var service = require('../../../app/services/MonitoringService');
var Applications = require('../../../app/services/api/applications');
var MonitoringDAO = require('../../../app/daos/monitoring-dao');
var HttpClient = require('../../../app/services/HttpClient');
var SamlService = require('../../../app/services/saml-service');
var utils = require('../../../app/utils/utils');
var child_process = require('child_process');

describe('test monitoring service', function () {
    var mock_Applications;
    var mock_MonitoringDAO;
    var mock_HttpClient;
    var mock_SamlService;
    var mock_utils;
    var mock_child_process;
    var mock_this;

    beforeEach(function () {
        mock_Applications = sinon.mock(Applications);
        mock_MonitoringDAO = sinon.mock(MonitoringDAO);
        mock_HttpClient = sinon.mock(HttpClient);
        mock_SamlService = sinon.mock(SamlService);
        mock_utils = sinon.mock(utils);
        mock_child_process = sinon.mock(child_process);
        mock_this = sinon.mock(service);
    });

    afterEach(function (done) {
        mock_Applications.restore();
        mock_MonitoringDAO.restore();
        mock_HttpClient.restore();
        mock_SamlService.restore();
        mock_utils.restore();
        mock_child_process.restore();
        mock_this.restore();
        done();
    });

    it('runAllSondes', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var expected_readPackageInfo = mock_this.expects('readPackageInfo').exactly(3).callsArgWith(1, null, 'data');
        var expected_testCallI2AWS = mock_this.expects('testCallI2AWS').callsArgWith(0, null, 'data2');
        var expected_testReadDatabase = mock_this.expects('testReadDatabase').callsArgWith(0, null, 'data3');
        var expected_testSAML = mock_this.expects('testSendSamlRequest').callsArgWith(1, null, 'data4');

        // WHEN
        service.runAllSondes('saml-plugin', spy);

        // THEN
        assert(expected_readPackageInfo.calledWith('u0'));
        assert(expected_testCallI2AWS.calledOnce);
        assert(expected_testReadDatabase.calledOnce);
        assert(expected_testSAML.calledOnce);

        assert(spy.calledWith(['data','data','data','data2','data3','data4']));
        done();
    });

    it('runAllSondes with returned error', function (done) {
        // GIVEN
        var ERROR = {
            message: 'error-message',
            stack: 'stackTrace'
        };
        var spy = sinon.spy();
        mock_this.expects('readPackageInfo').exactly(3).callsArgWith(1, null, 'data');
        mock_this.expects('testCallI2AWS').callsArgWith(0, null, 'data2');
        mock_this.expects('testReadDatabase').callsArgWith(0, ERROR);
        mock_this.expects('testSendSamlRequest').callsArgWith(1, null, 'data4');
        mock_this.expects('newSondeResult').withArgs('ko', '-', '-', 'Internal Error : error-message', 'stackTrace', service.DESCRIPTIONS.SONDE_ALLDEAD).returns('ERROR RESULT');
        // WHEN
        service.runAllSondes('saml-plugin', spy);

        // THEN
        assert(spy.calledWith(['ERROR RESULT']));
        done();
    });

    it('runAllSondes with thrown error', function (done) {
        // GIVEN
        var ERROR = {
            message: 'error-message',
            stack: 'stackTrace'
        };
        var spy = sinon.spy();
        mock_this.expects('readPackageInfo').exactly(3).callsArgWith(1, null, 'data');
        mock_this.expects('testCallI2AWS').callsArgWith(0, null, 'data2');
        mock_this.expects('testReadDatabase').throws(ERROR);
        mock_this.expects('testSendSamlRequest').callsArgWith(1, null, 'data4');
        mock_this.expects('newSondeResult').withArgs('ko', '-', '-', 'Internal Error : error-message', 'stackTrace', service.DESCRIPTIONS.SONDE_ALLDEAD).returns('ERROR RESULT');
        // WHEN
        service.runAllSondes('saml-plugin', spy);

        // THEN
        assert(spy.calledWith(['ERROR RESULT']));
        done();
    });

    it('readPackageInfo OK', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');
        mock_child_process.expects('exec').withArgs('rpm -qi b7_-toto').callsArgWith(1, null, 'out', null);
        mock_this.expects('newSondeResult').withArgs(null, 'RPM b7_-toto', 'elapsed', "out", '', service.DESCRIPTIONS.SONDE_RPM).returns("result");

        // WHEN
        service.readPackageInfo("toto", spy);

        // THEN
        assert(spy.calledWith(null, "result"));
        done();
    });

    it('readPackageInfo KO', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');
        mock_child_process.expects('exec').withArgs('rpm -qi b7_-toto').callsArgWith(1, 'ERROR', 'out', null);
        mock_this.expects('newSondeResult').withArgs(null, 'RPM b7_-toto', 'elapsed', "out", '', service.DESCRIPTIONS.SONDE_RPM).returns("result");

        // WHEN
        service.readPackageInfo('toto', spy);

        // THEN
        assert(spy.calledWith(null, 'result'));
        done();
    });

    it('testReadDatabase OK', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_MonitoringDAO.expects('selectMigrationTableLastRows').callsArgWith(0, null, 'data');
        mock_this.expects('newSondeResult').withArgs(null, 'Lecture BDD', 'elapsed', 'formated_data', '', service.DESCRIPTIONS.SONDE_DBREAD).returns('result');
        mock_this.expects('formatMigrationRows').withArgs('data').returns('formated_data');
        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        // WHEN
        service.testReadDatabase(spy);

        // THEN
        assert(spy.calledWith(null, 'result'));
        done();
    });

    it('testReadDatabase KO', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var error = {stack: 'stacktrace', message:'message'};

        mock_MonitoringDAO.expects('selectMigrationTableLastRows').callsArgWith(0, error);
        mock_this.expects('newSondeResult').withArgs(error, 'Lecture BDD', 'elapsed', 'message', 'stacktrace', service.DESCRIPTIONS.SONDE_DBREAD).returns('result');
        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        // WHEN
        service.testReadDatabase(spy);

        // THEN
        assert(spy.calledWith(null, "result"));
        done();
    });

    it('testCallI2AWS OK', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_Applications.expects('getI2AOnly').callsArgWith(0, null, [1,2]);
        mock_this.expects('newSondeResult').withArgs(null, 'Webservice I2A', 'elapsed', 'Nombre résultat : 2', '', service.DESCRIPTIONS.SONDE_I2AWS).returns('result');
        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        // WHEN
        service.testCallI2AWS(spy);

        // THEN
        assert(spy.calledWith(null, "result"));
        done();
    });

    it('testCallI2AWS KO', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var error = {stack: 'stacktrace'};


        mock_Applications.expects('getI2AOnly').callsArgWith(0, error);
        mock_this.expects('newSondeResult').withArgs(error, 'Webservice I2A', 'elapsed', error , 'stacktrace', service.DESCRIPTIONS.SONDE_I2AWS).returns("result");
        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        // WHEN
        service.testCallI2AWS(spy);

        // THEN
        assert(spy.calledWith(null, "result"));
        done();
    });

    it('testSendSamlRequest OK', function (done) {
        // GIVEN
        var spy = sinon.spy();

        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        mock_SamlService.expects('generateSamlLoginRequestUrl').withArgs('saml-plugin').callsArgWith(1, null, 'URL REDIRECT I2A');
        mock_HttpClient.expects('get').withArgs('URL REDIRECT I2A', undefined, false).callsArgWith(3, null, 'bla bla bla <title>Authentification Courrier</title>');

        mock_this.expects('newSondeResult').withArgs(null, 'Login I2A', 'elapsed', 'I2A login page OK', '', service.DESCRIPTIONS.SONDE_SAML).returns('result');

        // WHEN
        service.testSendSamlRequest('saml-plugin', spy);

        setTimeout(function() {
            // THEN
            assert(spy.calledWith(null, 'result'));
            done();
        }, 10);
    });

    it('testSendSamlRequest and error', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var ERROR = {message :'message', stack:'stack'};

        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        mock_SamlService.expects('generateSamlLoginRequestUrl').withArgs('saml-plugin').callsArgWith(1, null, 'URL REDIRECT I2A');
        mock_HttpClient.expects('get').withArgs('URL REDIRECT I2A', undefined, false).callsArgWith(3, ERROR, null);

        mock_this.expects('newSondeResult').withArgs(ERROR, 'Login I2A', 'elapsed', 'message', 'stack', service.DESCRIPTIONS.SONDE_SAML).returns('result');

        // WHEN
        service.testSendSamlRequest('saml-plugin', spy);

        setTimeout(function() {
            // THEN
            assert(spy.calledWith(null, 'result'));
            done();
        }, 10);
    });

    it('testSendSamlRequest , page OK but bad content', function (done) {
        // GIVEN
        var spy = sinon.spy();
        var ERROR = {message :'message', stack:'stack'};

        mock_utils.expects('getEpochTime').returns('begin');
        mock_utils.expects('computeTimeElapsedSinceEpoch').withArgs('begin').returns('elapsed');

        mock_SamlService.expects('generateSamlLoginRequestUrl').withArgs('saml-plugin').callsArgWith(1, null, 'URL REDIRECT I2A');
        mock_HttpClient.expects('get').withArgs('URL REDIRECT I2A', undefined, false).callsArgWith(3, null, 'this is not the correct page');

        mock_this.expects('newSondeResult').withArgs('error', 'Login I2A', 'elapsed', 'I2A call OK, mais pas page attendue non détectéé (\'Authentification Courrier\')', 'this is not the correct page', service.DESCRIPTIONS.SONDE_SAML).returns('result');

        // WHEN
        service.testSendSamlRequest('saml-plugin', spy);

        setTimeout(function() {
            // THEN
            assert(spy.calledWith(null, 'result'));
            done();
        }, 10);
    });


    it('newSondeResult OK', function (done) {
        // WHEN
        var result = service.newSondeResult(null, 'name', 'time', 'mess', 'stack', 'desc');

        // THEN
        result.should.have.property('nom').equal('name');
        result.should.have.property('testTime').equal('time');
        result.should.have.property('message').equal('mess');
        result.should.have.property('stackTrace').equal('stack');
        result.should.have.property('etat').equal('OK');
        result.should.have.property('description').equal('desc');
        done();
    });

    it('newSondeResult KO', function (done) {
        // WHEN
        var result = service.newSondeResult('error', 'name', 'time', 'mess', 'stack', 'desc');

        // THEN
        result.should.have.property('nom').equal('name');
        result.should.have.property('testTime').equal('time');
        result.should.have.property('message').equal('mess');
        result.should.have.property('stackTrace').equal('stack');
        result.should.have.property('etat').equal('KO');
        result.should.have.property('description').equal('desc');
        done();
    });

    it('formatMigrationRows OK', function (done) {

        // GIVEN
        var rows = [
            {
                id:12,
                name:'toto',
                run_on:new Date(0)
            },
            {
                id:13,
                name:'tutu',
                run_on:new Date(5000)
            }
        ];
        // WHEN
        var result = service.formatMigrationRows(rows);
        // THEN
        result.should.include('toto');
        result.should.include('tutu');
        result.should.include(12);
        result.should.include(13);
        result.should.include(':00:00');
        result.should.include(':00:05');
        done();
    });

    it('formatMigrationRows undefined', function (done) {
        // WHEN
        var result = service.formatMigrationRows(undefined);
        // THEN
        assert(result.length>10);
        done();
    });
    it('formatMigrationRows empty', function (done) {
        // GIVEN
        var rows = [ ];
        // WHEN
        var result = service.formatMigrationRows(rows);
        // THEN
        assert(result.length>10);
        done();
    });

});
