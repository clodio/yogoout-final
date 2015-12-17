'use strict';

var sinon = require('sinon');

var users = require('../../../app/models/users.js');
var collections = require('../../../app/utils/collections.js');

describe('User model', function () {
    before(function () {
        users._collection = [{
            id: '0',
            login: 'john',
            password: 'pwd',
            name: 'John Doe'
        }, {
            id: '1',
            login: 'jane',
            password: 'pwd',
            name: 'Jane Doe'
        }];
        collections = sinon.mock(collections);
    });

    after(function (done) {
        collections.restore();
        done();
    });

    it('should call the getByLogin function once from collections utils', function (done) {
        // given
        var login = 'john';
        var expectation = collections.expects('findByKeyValue');
        // when
        users.getByLogin(login);
        // then
        expectation.once();
        collections.verify();
        done();
    });
});