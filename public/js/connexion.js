/*eslint strict: [2, "never"]*/

var $ = require('jquery');
var utils = require('./utils');
var connexionModule = {};

(function () {
    this.init = function (data) {
        this.render(data);
    };

    this.render = function (data) {
       $('#connectButtn').on('click', function (event) {
            event.preventDefault();
            utils.popupCenter(data.baseURL + '/sp/login', 'SAML Login', 740, 580);
       });

        window.onmessage = function (e) {
            if (e.data === 'USER_AUTH_OK') {
                window.bandeauModule.notifyApplication();
            }
        };
    };

    this.refresh = function () {
        window.bandeauModule.refresh();
    };

}).apply(connexionModule);

module.exports = connexionModule;

