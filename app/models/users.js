'use strict';

var collections = require('../utils/collections.js');

var User = function () {};

User._collection = [{
    id: '0',
    login: 'john',
    password: 'pwd',
    name: 'John Durand'
}, {
    id: '1',
    login: 'jane',
    password: 'pwd',
    name: 'Jane Doe'
}];

User.getByLogin = function (login) {
    return collections.findByKeyValue(User._collection, 'login', login);
};

module.exports = User;