'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var errors = require('../../../../../app/utils/errors');

var _ = require('underscore');

var formatter = require('../../../../../app/services/api/client/i2a_userApplications_formatter');

describe('i2a userApplications webservice client', function () {

    it('format function', function (done) {
        // GIVEN
        var mapApp_spy = sinon.spy(formatter, 'mapApp');
        var data = {
            service:[{
                nom: 'FALSE_APP_1',
                cumulRoles: 'oui'
            }, {
                nom: 'FALSE_APP_2',
                cumulRoles: 'non'
            }]
        };

        // WHEN
        formatter.format(data);

        // THEN
        assert(mapApp_spy.calledTwice);
        mapApp_spy.restore();
        done();
    });

    it('format function should throw an error if data is empty', function (done) {
        // GIVEN
        var mapApp_spy = sinon.spy(formatter, 'mapApp');
        var errors_spy = sinon.spy(errors, 'throw');
        var data = [{
            nom: 'FALSE_APP_1',
            cumulRoles: 'oui'
        }];

        // WHEN
        try {
            formatter.format(data);
            assert.fail();
        } catch (testedError) {

        }

        // THEN
        assert(mapApp_spy.notCalled);
        assert(errors_spy.calledWith('R999'));
        errors_spy.restore();
        mapApp_spy.restore();
        done();
    });

    it('mapApp function', function (done) {
        // GIVEN
        var mapAccesLogique_spy = sinon.spy(formatter, 'mapAccesLogique');
        var data = {
            nom: 'FALSE_APP_1',
            cumulRoles: 'non',
            accesLogique: [{
                'code': 'STUFF',
                'libelle': 'FALSE_ACCESS_1',
                'affichageLibelle': 'oui',
                'acces': [],
                'groupe': []
            }]
        };

        // WHEN
        var result = formatter.mapApp(data);

        // THEN
        assert(mapAccesLogique_spy.calledOnce);
        result.name.should.exist.and.be.a('string');
        result.name.should.equal('FALSE_APP_1');
        result.merge_roles.should.exist.and.be.a('boolean');
        result.merge_roles.should.equal(false);
        result.logical_access.should.exist.and.be.a('array');
        done();
    });

    it('mapAccesLogique function', function (done) {
        // GIVEN
        var mapAcces_spy = sinon.spy(formatter, 'mapAcces');
        var mapGroupe_spy = sinon.spy(formatter, 'mapGroupe');
        var data = {
            'code': 'STUFF',
            'libelle': 'FALSE_ACCESS_1',
            'affichageLibelle': 'oui',
            'acces': [
                {
                    'affichageLibelle': 'oui',
                    'disponible': 'oui',
                    'visible': 'oui',
                    'libelle': 'FAKE_LABEL',
                    'url': 'http://google.fr'
                }
                    ],
            'groupe': [
                {
                    'nom': 'FAKE_GROUP_1',
                    'role': 'FAKE_1',
                    'accesLogique': 'FAKE_ACCESS_1',
                    'code': 'FAKE CODE'
                },
                {
                    'nom': 'FAKE_GROUP_2',
                    'role': 'FAKE_2',
                    'accesLogique': 'FAKE_ACCESS_2',
                    'code': 'FAKE CODE'
                }
            ]
        };

        // WHEN
        var result = formatter.mapAccesLogique(data);

        // THEN
        assert(mapAcces_spy.calledOnce);
        assert(mapGroupe_spy.calledTwice);
        assert(result.code === undefined);
        result.label.should.exist.and.be.a('string');
        result.label.should.equal('FALSE_ACCESS_1');
        result.show_label.should.exist.and.be.a('boolean');
        result.show_label.should.equal(true);
        result.access.should.exist.and.be.a('array');
        result.groupe.should.exist.and.be.a('array');
        done();
    });

    it('mapAcces function', function (done) {
        // GIVEN
        var data = {
            'affichageLibelle': 'oui',
            'disponible': 'oui',
            'visible': 'oui',
            'libelle': 'FAKE_LABEL',
            'url': 'http://google.fr'
        };

        // WHEN
        var result = formatter.mapAcces(data);

        // THEN
        result.show_label.should.exist.and.be.a('boolean');
        result.show_label.should.equal(true);
        result.available.should.exist.and.be.a('boolean');
        result.available.should.equal(true);
        result.show.should.exist.and.be.a('boolean');
        result.show.should.equal(true);
        result.label.should.exist.and.be.a('string');
        result.label.should.equal('FAKE_LABEL');
        result.url.should.exist.and.be.a('string');
        result.url.should.equal('http://google.fr');
        done();
    });

    it('mapGroupe function', function (done) {
        // GIVEN
        var data = {
            'nom': 'FAKE_GROUP_2',
            'role': 'FAKE_2',
            'accesLogique': 'FAKE_ACCESS_2',
            'code': 'FAKE CODE'
        };

        // WHEN
        var result = formatter.mapGroupe(data);

        // THEN
        result.name.should.exist.and.be.a('string');
        result.name.should.equal('FAKE_GROUP_2');
        result.role.should.exist.and.be.a('string');
        result.role.should.equal('FAKE_2');
        result.access.should.exist.and.be.a('string');
        result.access.should.equal('FAKE_ACCESS_2');
        done();
    });
});