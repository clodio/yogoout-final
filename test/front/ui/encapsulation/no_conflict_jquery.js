var BASE_URL = require('../../../TEST_CONFIG').BASE_URL;

casper.test.begin('JQuery du bandeau indépendant de JQuery de la page', function(test) {

    common.before();

    casper.thenOpen(BASE_URL + '/test-modules');

    casper.then(function () {
        test.assertEquals(this.getElementInfo('#jq-banner-version').text, "1.11.3", "Version JQuery du bandeau");
        test.assertEquals(this.getElementInfo('#jq-page-version').text, "2.1.4", "Version JQuery de la page");
    });

    common.end(test);
});