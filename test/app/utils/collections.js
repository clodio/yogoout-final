'use strict';

var chai = require('chai');
var expect = chai.expect;

var collections = require('../../../app/utils/collections.js');

describe('Collections utils', function () {
    before(function () {
    });

    it('should find the wanted object', function (done) {
        // given
        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 4 }];
        // when
        var result = collections.findByKeyValue(list, 'b', 3);
        // then
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(3);
        done();
    });

    it('should return undefined when searching empty list', function (done) {
        // given
        var list = [];
        // when
        var result = collections.findByKeyValue(list, 'c', 1);
        // then
        expect(result).to.equal(undefined);
        done();
    });

    it('should return undefined when not found', function (done) {
        // given
        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 4 }];
        // when
        var result = collections.findByKeyValue(list, 'c', 1);
        // then
        expect(result).to.equal(undefined);
        done();
    });
});