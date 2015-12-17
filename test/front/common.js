'use strict';

var Common = function () {
};

Common.prototype.login = function () {
    casper.then(function () {
        this.click('#loginToggle');
        this.click('.subcon');
    });
};

Common.prototype.logout = function () {
    casper.then(function () {
        this.click('#loginToggle');
        this.click('.btn');
    });
};

Common.prototype.before = function () {
    phantom.clearCookies();
    casper.start(BASE_URL + '/configs');
    casper.thenOpen(BASE_URL + '/configs/reload', {method: 'post' });
    casper.on('remote.message', function(message) {
        this.echo('Console.log: ' + message);
    });
};

Common.prototype.accueil = function () {
    casper.thenOpen(BASE_URL);
};

Common.prototype.end = function (test) {
    casper.run(function() {
        test.done();
    });
};

module.exports = new Common();