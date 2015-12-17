var BASE_URL = require('../../TEST_CONFIG').BASE_URL;
var common = require('../common.js');

casper.test.begin('Endpoint validation paramétrage', function(test) {


    common.before();

    casper.thenOpen(BASE_URL + '/configs');

	casper.then(function() {
	    this.open(BASE_URL + '/configs/reload', {
	        method: 'post',
	        headers: {'Accept': 'application/json'}
	    });
	});

	casper.then(function() {
		var json = JSON.parse(this.getPageContent());
		test.assertEquals(true , json.updated);
	});

    common.end(test);

});