var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Déclenchement de l\'évènement de connexion', function(test) {

    common.before();

    casper.thenOpen(BASE_URL + '/test-evenement-connexion');

    casper.then(function () {
        test.assertEquals(this.getElementInfo('#txt').text, "Utilisateur non connecté", "Affichage utilisateur déconnecté");
    });

    common.login();

    // Attente retour popup et connexion
    casper.wait(2000);

    casper.then(function () {
        test.assertEquals(this.getElementInfo('#txt').text, "Utilisateur connecté", "Affichage utilisateur connecté");
    });

    common.end(test);
});