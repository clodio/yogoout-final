var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture et fermeture popup connexion', function(test) {

    common.before();

    var activer_popup = BASE_URL + '/configs/features.activer_popup_connexion/true';
    var desactiver_i2a = BASE_URL + '/configs/features.activer_connexion_i2a/false';


    casper.thenOpen(activer_popup, {method: 'put' });

    casper.thenOpen(desactiver_i2a, {method: 'put' });

    common.accueil();

    common.login();

    casper.waitForPopup(/sp\/assert/, function() {
        this.echo('Popup ouverte');
        this.test.assertEquals(this.popups.length, 1);
    });

    casper.wait(3000, function() {
        this.echo("J'ai attendu 1 seconde.");
    });

    casper.then(function () {
        this.echo('Retour au template.');
        this.test.assertEquals(this.popups.length, 0);
    });

    casper.wait(1000, function() {
        this.evaluate(function() {
            __utils__.echo(__utils__.findOne('.nom').textContent);
        });
    });

    common.end(test);
});