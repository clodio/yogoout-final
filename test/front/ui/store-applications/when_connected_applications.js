var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;
var common = require('../../common.js');

casper.test.begin('Ouverture du kiosque d\'application', function(test) {


    common.before();

    common.accueil();

    common.login();

    casper.wait(2000, function() {
        this.echo("J'ai attendu 2000ms");
    });

    casper.then(function () {
        this.click('#application-id');
    });

    casper.wait(200, function() {
        this.echo("J'ai attendu 200ms");
    });

    casper.then(function () {
        test.assertElementCount("a.liste", 6);
    });

    // LIENS APPLICATIONS CLIQUABLES
    casper.then(function () {
        var links = this.getElementsInfo('a.liste');

        this.each(links, function(self, link) {
            test.assertEquals(link.nodeName, 'a');
            test.assertEquals(link.attributes.target, '_blank');
            test.assertMatch(link.attributes.href, /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
        });
    });

    common.end(test);
});