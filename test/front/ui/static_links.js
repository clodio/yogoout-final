var BASE_URL = require('../../TEST_CONFIG').BASE_URL;
var common = require('../common.js');

casper.test.begin('search icon must point to configuration link', function(test) {

    common.before();

    common.accueil();

    casper.then(function () {
        // when
        var search_link = this.getElementInfo('#recherche');

        // then
        casper.test.assertEquals( search_link.attributes.href, 'https://www.google.com',
            'Le lien de recherche doit être celui du fichier de configuration' );
        casper.test.assertEquals( search_link.attributes.target, '_blank',
            'Le lien de recherche doit ouvrir un nouvel onglet' );
    });

    casper.then(function () {
        // when
        var search_link = this.getElementInfo('#evitement > ul > li:nth-of-type(3n) > a');

        // then
        casper.test.assertEquals( search_link.attributes.href, 'https://www.google.com',
            'Le lien d evitement de recherche doit être celui du fichier de configuration' );
        casper.test.assertEquals( search_link.attributes.target, '_blank',
            'Le lien de évitement de recherche doit ouvrir un nouvel onglet' );
    });

    casper.then(function () {
        // when
        var home_link   = this.getElementInfo('#home-link');

        // then
        casper.test.assertEquals( home_link.attributes.href, 'http://www.lemonde.fr',
            'Le lien home doit être celui du fichier de configuration' );
        casper.test.assertEquals( home_link.attributes.target, '_blank',
            'Le lien home doit ouvrir un nouvel onglet' );
    });

    casper.then(function () {
        // when
        var wac_link   = this.getElementInfo('#wac-link');

        // then
        casper.test.assertEquals( wac_link.attributes.href, 'http://www.wac.courrier.intra.laposte.fr',
            'Le lien home doit être celui du fichier de configuration' );
        casper.test.assertEquals( wac_link.attributes.target, '_blank',
            'Le lien home doit ouvir un nouvel onglet' );
    });

    common.end(test);

});