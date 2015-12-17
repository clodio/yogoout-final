'use strict';

var _ = require('underscore');
var errors = require('../../../utils/errors');

var Formatter = function () {};

Formatter.prototype.format = function (data) {
    if (!data.hasOwnProperty('service')) {
        errors.throw('R999');
    }
    return _.map(data.service, function (app) {
        return this.mapApp(app);
    }, this);
};

Formatter.prototype.mapApp = function (app) {
    return {
        name: app.nom,
        merge_roles: (app.cumulRoles === 'oui'),
        logical_access: _.map(app.accesLogique, function (access) {
            return this.mapAccesLogique(access);
        }, this)
    };
};

Formatter.prototype.mapAccesLogique = function (access) {
    return {
        label: access.libelle,
        show_label: (access.affichageLibelle === 'oui'),
        access: _.map(access.acces, function (acces) {
            return this.mapAcces(acces);
        }, this),
        groupe: _.map(access.groupe, function (groupe) {
            return this.mapGroupe(groupe);
        }, this)
    };
};

Formatter.prototype.mapAcces = function (acces) {
    return {
        show_label: (acces.affichageLibelle === 'oui'),
        available: (acces.disponible === 'oui'),
        show: (acces.visible === 'oui'),
        label: acces.libelle,
        url: acces.url
    };
};

Formatter.prototype.mapGroupe = function (groupe) {
    return {
        name: groupe.nom,
        role: groupe.role,
        access: groupe.accesLogique
    };
};

module.exports = new Formatter();