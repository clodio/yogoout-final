var expect = require('chai').expect;
var sinon = require('sinon');
var should = require('chai').should();
var assert = require('chai').assert;

var service = require('../../../app/daos/monitoring-dao');
var config = require('../../../config');
var mysql = require('mysql');

describe('test monitoring dao', function () {
    var mock_Config;
    var mock_Mysql;
    var mock_Connection;
    var connection = {
        connect: function () {},
        end: function () {},
        query: function () {}
     };

    beforeEach(function () {
        mock_Config = sinon.mock(config);
        mock_Mysql = sinon.mock(mysql);
        mock_Connection = sinon.mock(connection);
    });

    afterEach(function (done) {
        mock_Config.restore();
        mock_Mysql.restore();
        mock_Connection.restore();
        done();
    });
    it('selectMigrationTableLastRows OK', function (done) {

        // GIVEN
        var spy = sinon.spy();
        mock_Config.expects('get').atLeast(1).withArgs('database.hostname').returns('hostname');
        mock_Config.expects('get').atLeast(1).withArgs('database.login').returns('login');
        mock_Config.expects('get').atLeast(2).withArgs('database.password').returns('password');
        mock_Config.expects('get').atLeast(2).withArgs('database.name').returns('b7_portail_aa');
        mock_Mysql.expects('createConnection').atLeast(1).withArgs(
            {
                host: 'hostname',
                user: 'login',
                password: 'password',
                database: 'b7_portail_aa'
            }
        ).returns(connection);

        mock_Connection.expects('query')
        .withArgs('SELECT * FROM (SELECT * FROM migrations ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC')
        .callsArgWith(1, null, 'rows');


        service.selectMigrationTableLastRows(spy);

        assert(spy.calledWith(null, 'rows'));
        done();
    });

    it('selectMigrationTableLastRows KO', function (done) {

        // GIVEN
        var spy = sinon.spy();
        mock_Config.expects('get').atLeast(1).withArgs('database.hostname').returns('hostname');
        mock_Config.expects('get').atLeast(1).withArgs('database.login').returns('login');
        mock_Config.expects('get').atLeast(2).withArgs('database.password').returns('password');
        mock_Config.expects('get').atLeast(2).withArgs('database.name').returns('b7_portail_aa');
        mock_Mysql.expects('createConnection').atLeast(1).withArgs(
            {
                host: 'hostname',
                user: 'login',
                password: 'password',
                database: 'b7_portail_aa'
            }
        ).returns(connection);

        mock_Connection.expects('query')
        .withArgs('SELECT * FROM (SELECT * FROM migrations ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC')
        .callsArgWith(1, 'ERROR', null);


        service.selectMigrationTableLastRows(spy);

        assert(spy.calledWith('ERROR', null));
        done();
    });

});
