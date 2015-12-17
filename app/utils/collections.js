'use strict';

var Collections = function () {};

Collections.prototype.findByKeyValue = function (array, key, value) {
    var result = array.filter(function (object) { return object[key] === value; });
    return result ? result[0] : undefined;
};

module.exports = new Collections();