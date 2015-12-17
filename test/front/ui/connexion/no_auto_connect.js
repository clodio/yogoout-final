var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture et fermeture popup connexion', function(test) {

    common.before();

    casper.thenOpen(BASE_URL + '/configs/features.auto_connect/false', {  method: 'put' });

    // PAGE ACCUEIL
    common.accueil();

    casper.wait(2000);

    // La connexion auto n'a pas eu lieu
    casper.then(function () {
        test.assertTextDoesntExist("DURAND", 'La page ne contient pas DURANT');
    });

    common.end(test);
});