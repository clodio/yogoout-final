'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');

var formatter = require('../../../../app/services/api/formatter');
var utils = require('../../../../app/utils/utils');

describe('test formatter service', function () {
    var mock_utils = sinon.mock(utils);

    afterEach(function (done) {
        mock_utils.restore();
        done();
    });

    it('formatApplicationList', function (done) {
        // given
        var data = {
            service: [
                {
                    "code": "KW_",
                    "nom": "FAKE_NAME_APPLI_1",
                    "accesLogique": []
                },
                {
                    "code": "H3",
                    "nom": "FAKE_NAME_APPLI_2",
                    "accesLogique": []
                }
            ]
        };

        // and
        mock_utils.expects('clone').returns(data);

        // when
        var result = formatter.formatApplicationList(data);

        // then
        result.should.be.an('array');
        result.should.have.length(2);
        result[0].should.not.have.property('code');
        result[1].should.have.property('name').equal('FAKE_NAME_APPLI_2');

        done();
    });

    it('formatDefaultAppList', function (done) {
        // given
        var data = [
            {
                "short_name": "CONTACT",
                "icon": "/dist/img/fake-image.png",
                "icon_hover": "/dist/img/fake-image-over.png",
                "i2a_secured": false
            },
            {
                "short_name": "E-POLL-IT"
            }
        ];

        // and
        mock_utils.expects('clone').returns(data);
        mock_utils.expects('getURL').atMost(9).returns('http://fake.base.url');

        // when
        var result = formatter.formatDefaultAppList(data);

        // then
        result.should.be.an('array');
        result.should.have.length(2);

        result[0].should.have.property('short_name').equal('CONTACT');
        result[0].should.have.property('icon').equal('http://fake.base.url/dist/img/fake-image.png');
        result[0].should.have.property('icon_hover').equal('http://fake.base.url/dist/img/fake-image-over.png');
        result[0].should.have.property('i2a_secured').equal(false);
        result[1].should.not.have.property('icon');
        result[1].should.not.have.property('icon_hover');
        result[1].should.have.property('i2a_secured').equal(false);

        done();
    });

});