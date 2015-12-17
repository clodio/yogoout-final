var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture et fermeture popup connexion', function(test) {

    common.before();

    common.accueil();

    common.login();

    casper.wait(2000);

    common.logout();

    casper.wait(2000);

    casper.then(function () {
        test.assertTextDoesntExist("DURAND", 'La page ne contient pas DURANT');
        test.assertTextExists("Les espaces", 'La page contient Les espaces');
    });

    common.end(test);
});