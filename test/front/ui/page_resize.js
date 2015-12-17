var BASE_URL = require('../../TEST_CONFIG').BASE_URL;
var common = require('../common.js');

casper.test.begin('Le bandeau ne s\'ouvre pas automatiquement après redimensionnement de la page', function(test) {

    common.before();

    // PAGE ACCUEIL
    common.accueil();

    // TAILLE DU BANDEAU AU CHARGEMENT DE LA PAGE
    casper.then(function () {
        // when
        var bandeau_height = this.getElementInfo('#bandeau').height;

        // then
        test.assertEquals(bandeau_height, 60, 'Taille initiale du bandeau 60px');
    });

    // OUVERTURE MES ESPACES
    casper.then(function () {
        this.click('#espace');
    });

    // ATTENTE
    casper.wait(600, function() {});

    // FERMETURE MES ESPACES
    casper.then(function () {
        this.click('#espace');
    });

    // ATTENTE
    casper.wait(600, function() {});

    // RESIZE FENETRE ET TEST TAILLE BANDEAU
    casper.then(function () {
        casper.viewport(1024, 768).then(function() {
            // when
            var bandeau_height = this.getElementInfo('#bandeau').height;

            // then
            test.assertEquals(bandeau_height, 60, 'Taille du bandeau après redimensionnement de la page 60px');
        });
    });

    common.end(test);
});