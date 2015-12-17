'use strict';

var Filter = function () {};

Filter.prototype.getMatches = function (query, array) {

    (function () {
        if (query.default) {
            query.default = query.default === 'true';
        }
        if (query.i2a_secured) {
            query.i2a_secured = query.i2a_secured === 'true';
        }
    })();

    if (Object.getOwnPropertyNames(query).length === 0) {
        return array;
    }

    var result = [];

    array.forEach(function (elt) {
        var is_a_match = true;

        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                if (elt[key] !== query[key]) {
                    is_a_match = false;
                    break;
                }
            }
        }

        if (is_a_match) {
            result.push(elt);
        }
    });

    return result;

};



module.exports = new Filter();