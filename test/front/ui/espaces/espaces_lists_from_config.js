var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;

casper.test.begin('Mes espaces - Button switch', function(test) {

    common.before();

    common.accueil();

    casper.then(function() {
        var site;

        // Test onglet 1
        site = casper.getElementInfo('#informations-rh > ul > li:nth-of-type(4n) > a');
        casper.test.assertEquals( site.text, 'M@p' );
        casper.test.assertEquals( site.attributes.href, 'http://www.rh.laposte.fr' );

        // Test onglet 2
        site = casper.getElementInfo('#logistique > ul > li:nth-of-type(5n) > a');
        casper.test.assertEquals( site.text, 'DOCN Technique' );
        casper.test.assertEquals( site.attributes.href, 'http://app1.collaboratif.courrier.intra.laposte.fr/sites/IntranetDTC/Pages/Accueil.aspx' );

        // Test onglet 4
        site = casper.getElementInfo('#courrier > ul > li:nth-of-type(4n) > a');
        casper.test.assertEquals( site.text, 'Direction du Marketing des Grands Comptes et Entreprises' );
        casper.test.assertEquals( site.attributes.href, 'http://www.connexions-marketing.com' );

        // Test onglet 5
        site = casper.getElementInfo('#colis > ul > li:first-of-type > a');
        casper.test.assertEquals( site.text, 'Le Site du Pôle' );
        casper.test.assertEquals( site.attributes.href, 'http://www.intranet.intra-coliposte.gae2.intra.laposte.fr' );

        // Test onglet 6
        site = casper.getElementInfo('#international > ul > li:nth-of-type(3n) > a');
        casper.test.assertEquals( site.text, 'Asendia' );
        casper.test.assertEquals( site.attributes.href, 'http://www.asendia.com/en' );

        // Test onglet 7
        site = casper.getElementInfo('#performance > ul > li:nth-of-type(8n) > a');
        casper.test.assertEquals( site.text, 'Direction du Cabinet' );
        casper.test.assertEquals( site.attributes.href, 'http://www.cabinet.courrier.intra.laposte.fr' );

        // Test onglet 8
        site = casper.getElementInfo('#vie-au-travail > ul > li:nth-of-type(2n) > a');
        casper.test.assertEquals( site.text, 'Direction des Ressources Humaines et des Relations Sociales' );
        casper.test.assertEquals( site.attributes.href, 'http://www.idrhrs.courrier.intra.laposte.fr' );
    });


    common.end(test);
});
