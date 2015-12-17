var BASE_URL = require('../../TEST_CONFIG').BASE_URL;
var common = require('../common.js');

casper.test.begin('Page de monitoring', function(test) {

    common.before();

	casper.thenOpen(BASE_URL + '/monitoring', {	method: 'get' });

	casper.then(function() {
		var page = this.getPageContent();
		test.assertTextExists("revision svn", page);
	});

	casper.then(function() {
		link = this.getElementInfo('a');
		test.assertEquals(link.text, "CONFIGURATION");
	});

	casper.then(function() {
		this.click('a');
	});

	casper.then(function() {
		var page = this.getPageContent();
		test.assertTextExists("hapi_auth_cookie", page);
	});

    common.end(test);
});