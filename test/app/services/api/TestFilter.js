'use strict';

var should = require('chai').should();
var sinon = require('sinon');

var formatter = require('../../../../app/services/api/filter');

describe('Test Filter service', function () {

    it('should return all the applications', function (done) {
        // given
        var query = {};
        var data = [
            {
                "name": "FAKE_APPLICATION_1",
                "default": true,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_2",
                "default": false,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_3",
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_4",
                "i2a_secured": true
            }
        ];

        // when
        var result = formatter.getMatches(query, data);

        //then
        result.should.have.length(4);
        result[1].should.have.property('name').equal('FAKE_APPLICATION_2');
        result[3].should.have.property('i2a_secured').equal(true);

        done();
    });

    it('should return the only default apps equal true', function (done) {
        // given
        var query = { default: 'true' };
        var data = [
            {
                "name": "FAKE_APPLICATION_1",
                "default": true,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_2",
                "default": false,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_3",
                "default": true,
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_4",
                "i2a_secured": true
            }
        ];

        // when
        var result = formatter.getMatches(query, data);

        // then
        result.should.have.length(2);
        result.forEach( function (elt) {
            elt.should.have.property('default').equal(true);
        });

        done();
    });

    it('should return only i2a secured application', function (done) {
        // given
        var query = { i2a_secured: 'true' };
        var data = [
            {
                "name": "FAKE_APPLICATION_1",
                "default": true,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_2",
                "default": false,
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_3",
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_4",
                "i2a_secured": true
            }
        ];

        // when
        var result = formatter.getMatches(query, data);

        // then
        result.should.have.length(3);
        result.forEach( function (elt) {
            elt.should.have.property('i2a_secured').equal(true);
        });

        done();
    });

    it('should return only i2a secured application with default property set to true', function (done) {
        // given
        var query = { i2a_secured: 'true', default: 'true' };
        var data = [
            {
                "name": "FAKE_APPLICATION_1",
                "default": true,
                "i2a_secured": false
            },
            {
                "name": "FAKE_APPLICATION_2",
                "default": false,
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_3",
                "default": true,
                "i2a_secured": true
            },
            {
                "name": "FAKE_APPLICATION_4",
                "i2a_secured": true
            }
        ];

        // when
        var result = formatter.getMatches(query, data);

        // then
        result.should.have.length(1);
        result.forEach( function (elt) {
            elt.should.have.property('i2a_secured').equal(true);
            elt.should.have.property('default').equal(true);
        });

        done();
    });

});