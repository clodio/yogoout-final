/*eslint strict: [2, "never"]*/
/*eslint space-infix-ops:0*/

var $ = require('jquery');
var utils = require('../utils');
var LoginIconView = require('./LoginIconView');
var PopoverView = require('./PopoverView');

var ViewManager = function () {};

ViewManager.prototype.views = {};

ViewManager.prototype.init = function () {
    this.views.loginView = new LoginIconView({ el: $('#loginToggle') });
    this.views.popoverView = new PopoverView({ el: $('#loginWin') });
};

ViewManager.prototype.refresh = function () {
    this.views.popoverView.render();
    this.views.loginView.render();

    this.fadeOut();

    this.rebindEvents();
};

ViewManager.prototype.fadeOut = function () {
    $('#overlay-body').fadeOut();
    $('#loginToggle').removeClass('active');
};

ViewManager.prototype.rebindEvents = function () {
    $('#connectButtn').on('click', function (event) {
        event.preventDefault();
        utils.popupCenter(window.bandeauModule.getURL() + '/sp/login', 'SAML Login', 740, 580);
    });

    $('#disconnectButtn').on('click', function (event) {
        event.preventDefault();
        $.ajax({
            url: window.bandeauModule.getURL() + '/logout',
            xhrFields: { withCredentials: true },
            method: 'POST'
        }).done(function (data) {
            window.bandeauModule.notifyApplication();
        });
    });
};

module.exports = new ViewManager();