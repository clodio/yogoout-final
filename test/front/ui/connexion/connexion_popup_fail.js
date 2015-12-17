var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Overture popup avec message d\'erreur', function(test) {

    //BEFORE
    common.before();

    casper.thenOpen(BASE_URL + '/configs/features.connexion_sans_i2a_reussie/false', {  method: 'put' });

    common.accueil();

    common.login();

    //THEN
    casper.waitForPopup(/sp\/assert/, function() {
        this.test.assertEquals(this.popups.length, 1);
     });

    casper.withPopup(/sp\/assert/, function () {
        this.test.assertTitle('error');
    });

    common.end(test);
});