'use strict';

var utils = require('../../utils/utils');

var Formatter = function () {};


Formatter.prototype.formatApplicationList = function (obj) {

    var clone = utils.clone(obj);
    clone = clone.service || [];

    for (var i = 0; i < clone.length; i++) {
        clone[i] = {
            name: clone[i]['nom'],
            i2a_secured: true,
            default: false
        };
    }

    return clone;
};

Formatter.prototype.formatDefaultAppList = function (obj) {

    var clone = utils.clone(obj);

    clone.forEach(function (elt) {
        if (elt.icon) {
            elt.icon = utils.getURL() + elt.icon;
        }
        if (elt.icon_hover) {
            elt.icon_hover = utils.getURL() + elt.icon_hover;
        }

        elt.i2a_secured = false;
    });

    return clone;
};


module.exports = new Formatter();