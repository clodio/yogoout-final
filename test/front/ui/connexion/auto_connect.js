var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture et fermeture popup connexion', function(test) {

    common.before();

    casper.thenOpen(BASE_URL + '/configs/features.auto_connect/true', {  method: 'put' });

    // PAGE ACCUEIL
    common.accueil();

    casper.wait(2000);

    // La connexion auto a eu lieu
    casper.then(function () {
        test.assertMatch(this.getElementInfo('.nom').text, /DURAND/, "la balise nom contient DURAND" );
    });

    // DECONNEXION explicite
    common.logout();

    casper.wait(1500);
    casper.then(function () {
        test.assertTextDoesntExist("DURAND", "La page ne contient pas DURAND");
    });
    casper.wait(2000);

    // Pas de reconnexion auto après deconnexion explicite.
    casper.then(function () {
        test.assertTextDoesntExist("DURAND", "La page ne contient pas DURAND");
    });

    common.end(test);
});