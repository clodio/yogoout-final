var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;

casper.test.begin('Mes espaces - Button switch', function(test) {

    common.before();

    common.accueil();

    casper.then(function() {
        test.assertExists('#espace.espace-button');
        this.click('#espace.espace-button');
    });

    casper.then(function() {
        var informations_RH, logistique, courrier, colis, international, performance, vie_au_travail, autres_liens;


        // Test onglet 1
        informations_RH = casper.getElementInfo('#informations-rh > button');
        casper.test.assertEquals( informations_RH.text, 'Informations RH' );
        this.click('#informations-rh > button');

        informations_RH = casper.getElementInfo('#informations-rh > button');
        casper.test.assertEquals( informations_RH.attributes.class, 'dropdown-toggle active' );


        // Test onglet 2
        logistique = casper.getElementInfo('#logistique > button');
        casper.test.assertEquals( logistique.text, 'Logistique' );
        casper.test.assertEquals( logistique.attributes.class, 'dropdown-toggle' );

        this.click('#logistique > button');

        logistique = casper.getElementInfo('#logistique > button');
        informations_RH = casper.getElementInfo('#informations-rh > button');
        casper.test.assertEquals( informations_RH.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( logistique.attributes.class, 'dropdown-toggle active' );


        // Test onglet 4
        courrier = casper.getElementInfo('#courrier > button');
        casper.test.assertEquals( courrier.text, 'Courrier' );
        casper.test.assertEquals( courrier.attributes.class, 'dropdown-toggle' );

        this.click('#courrier > button');

        courrier = casper.getElementInfo('#courrier > button');
        logistique = casper.getElementInfo('#logistique > button');
        casper.test.assertEquals( logistique.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( courrier.attributes.class, 'dropdown-toggle active' );


        // Test onglet 5
        colis = casper.getElementInfo('#colis > button');
        casper.test.assertEquals( colis.text, 'Colis' );
        casper.test.assertEquals( colis.attributes.class, 'dropdown-toggle' );

        this.click('#colis > button');

        colis = casper.getElementInfo('#colis > button');
        courrier = casper.getElementInfo('#courrier > button');
        casper.test.assertEquals( courrier.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( colis.attributes.class, 'dropdown-toggle active' );


        // Test onglet 6
        international = casper.getElementInfo('#international > button');
        casper.test.assertEquals( international.text, 'International' );
        casper.test.assertEquals( international.attributes.class, 'dropdown-toggle' );

        this.click('#international > button');

        international = casper.getElementInfo('#international > button');
        colis = casper.getElementInfo('#colis > button');
        casper.test.assertEquals( colis.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( international.attributes.class, 'dropdown-toggle active' );


        // Test onglet 7
        performance = casper.getElementInfo('#performance > button');
        casper.test.assertEquals( performance.text, 'Performance' );
        casper.test.assertEquals( performance.attributes.class, 'dropdown-toggle' );

        this.click('#performance > button');

        performance = casper.getElementInfo('#performance > button');
        international = casper.getElementInfo('#international > button');
        casper.test.assertEquals( international.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( performance.attributes.class, 'dropdown-toggle active' );


        // Test onglet 8
        vie_au_travail = casper.getElementInfo('#vie-au-travail > button');
        casper.test.assertEquals( vie_au_travail.text, 'Vie au Travail' );
        casper.test.assertEquals( vie_au_travail.attributes.class, 'dropdown-toggle' );

        this.click('#vie-au-travail > button');

        vie_au_travail = casper.getElementInfo('#vie-au-travail > button');
        performance = casper.getElementInfo('#performance > button');
        casper.test.assertEquals( performance.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( vie_au_travail.attributes.class, 'dropdown-toggle active' );


        // Test onglet 9
        autres_liens = casper.getElementInfo('#autres-liens > button');
        casper.test.assertEquals( autres_liens.text, 'Autres liens' );
        casper.test.assertEquals( autres_liens.attributes.class, 'dropdown-toggle' );

        this.click('#autres-liens > button');

        autres_liens = casper.getElementInfo('#autres-liens > button');
        vie_au_travail = casper.getElementInfo('#vie-au-travail > button');
        casper.test.assertEquals( vie_au_travail.attributes.class, 'dropdown-toggle' );
        casper.test.assertEquals( autres_liens.attributes.class, 'dropdown-toggle active' );
    });


    common.end(test);
});
