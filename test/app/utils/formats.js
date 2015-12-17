'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var assert = require('assert');

var formats = require('../../../app/utils/formats');

describe('Formats object', function () {
    var spy;

    before(function () {
        spy = sinon.spy(formats, 'validateFormatEspaces');
    });

    after(function (done) {
        spy.restore();
        done();
    });


    it('Validation of format for "espaces" should throw an error if format value is null', function (done) {
        try {
            // when
            formats.validateFormatEspaces(null);
        } catch (e) {
            // then
            expect(e.message).to.equal('value cannot be null');
        }
        done();
    });

    it('Validation of format for "espaces" should throw an error if format value is undefined', function (done) {
        try {
            // when
            formats.validateFormatEspaces(undefined);
        } catch (e) {
            // then
            expect(e.message).to.equal('value cannot be undefined');
        }
        done();
    });

    it('Validation of format for "espaces" should throw an error if argument isn\'t an array', function (done) {
        try {
            // when
            formats.validateFormatEspaces({ object: 'test' });
        } catch (e) {
            // then
            expect(e.message).to.equal('expected array, got object');
        }
        done();
    });

    it('Validation of format for "espaces" should throw an error if an object isn\'t {libelle: \'\', url: \'\'}', function (done) {
        // given
        var value = [{ libelle: 'libelle', not_url: 'not_url' }];

        try {
            // when
            formats.validateFormatEspaces(value);
        } catch (e) {
            // then
            expect(e.message).to.equal('array should only contain objects of type {libelle: \'libelle\', url: \'url\'}');
        }
        done();
    });

    it('Validation of format for "espaces" should throw an error if an object isn\'t {libelle: \'\', url: \'\'}', function (done) {
        // given
        var value = [{ not_libelle: 'not_libelle', url: 'not_url' }];

        try {
            // when
            formats.validateFormatEspaces(value);
        } catch (e) {
            // then
            expect(e.message).to.equal('array should only contain objects of type {libelle: \'libelle\', url: \'url\'}');
        }
        done();
    });

    it('Validation of format for "espaces" should throw an error if an url is invalid', function (done) {
        // given
        var value = [{ libelle: 'libelle', url: 'not a valid url' }];

        try {
            // when
            formats.validateFormatEspaces(value);
            assert.fail();
        } catch (e) {
            // then
            expect(e.message).to.equal('property url of ' + JSON.stringify(value[0]) + ' should be valid');
        }

        done();
    });

    it('Validation of format for "espaces" should throw an error if array contains more than 20 objects', function (done) {
        // given
        var value = [
            { libelle: '1', url: '' }, { libelle: '2', url: '' }, { libelle: '3', url: '' },
            { libelle: '4', url: '' }, { libelle: '5', url: '' }, { libelle: '6', url: '' },
            { libelle: '7', url: '' }, { libelle: '8', url: '' }, { libelle: '9', url: '' },
            { libelle: '10', url: '' }, { libelle: '11', url: '' }, { libelle: '12', url: '' },
            { libelle: '13', url: '' }, { libelle: '14', url: '' }, { libelle: '15', url: '' },
            { libelle: '16', url: '' }, { libelle: '17', url: '' }, { libelle: '18', url: '' },
            { libelle: '19', url: '' }, { libelle: '20', url: '' }, { libelle: '21', url: '' }
        ];
        try {
            // when
            formats.validateFormatEspaces(value);
            assert.fail();
        } catch (e) {
            // then
            expect(e.message).to.equal('array length cannot be bigger than 20');
        }

        done();
    });
});