var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture et fermeture popup connexion', function(test) {

    common.before();

    common.accueil();

    common.login();

    casper.wait(2000);

    casper.then(function () {
        test.assertMatch(this.getElementInfo('.nom').text, /DURAND/, "la balise nom contient DURAND" );
    });

    common.end(test);
});