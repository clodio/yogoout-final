/*eslint strict: [2, "never"]*/

var $ = require('jquery');
var _ = require('underscore');
var viewManager = require('./components/ViewManager');

var modules = [
    require('./connexion')
];

var bandeauModule = {};

(function () {
    var baseURL = '';
    var authStatus = false;
    var userData = {};

    this.init = function (mainDiv, scriptTag) {
        _setURL(scriptTag);
        _loadCSS();
        _loadTemplate(mainDiv);
    };

    this.refresh = function () {
        viewManager.refresh();
    };

    function _setURL (scriptTag) {
        var href = scriptTag.getAttribute('src') || '';
        baseURL = href.split('/dist/js')[0];
    }

    function _loadCSS () {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.id = 'bandeau-css-id';
        link.href = baseURL + '/dist/css/bandeau.min.css';
        head.appendChild(link);
    }

    this.$ = $;

    function _loadTemplate (mainDiv) {
        $.ajax({
            url: baseURL + '/template',
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            mainDiv.innerHTML = data;
            viewManager.init();

            $(document).trigger('TemplateLoaded');

            modules.forEach(function (module) {
                module.init({ baseURL: baseURL });
            });
        });
    }

    this.getURL = function () {
        return baseURL;
    };

    this.isAuthenticated = function () {
        return authStatus;
    };

    this.setAuthentication = function (status) {
        authStatus = (typeof status === 'boolean') ? status : false;
    };

    this.setUserData = function (obj) {
        userData = _.clone(obj);
    };

    this.getUserData = function () {
        return userData;
    };

    this.notifyApplication = function () {
        var self = this;
        var event = document.createEvent('Event');

        $.ajax({
            url: baseURL + '/api/v1/users/self',
            xhrFields: { withCredentials: true },
            statusCode: {
                401: function () {
                    self.setAuthentication(false);
                    self.setUserData({});

                    self.refresh();

                    event.initEvent('UserDisconnected', true, true);
                    document.dispatchEvent(event);
                },
                200: function (data) {
                    self.setAuthentication(true);
                    self.setUserData(data);

                    self.refresh();

                    event.initEvent('UserAuthenticated', true, true);
                    document.dispatchEvent(event);
                }
            }
        });
    };
}).apply(bandeauModule);

// Expose bandeau module to the rest of the page for facilitate tests
window.bandeauModule = bandeauModule;

module.exports = bandeauModule;
