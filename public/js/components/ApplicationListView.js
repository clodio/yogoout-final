/*eslint strict: [2, "never"]*/
/*eslint space-infix-ops:0*/

var Backbone = require('backbone');
var $ = require('jquery');
var Handlebars = require('handlebars');

var ApplicationView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },

    render: function (data) {
        if (!data) {
            return this.showSpinner();
        }

        var html =
         '{{#applications}}' +
         '<li>' +
         '<style type="text/css">' +
         ' .appcube{{@index}} {background-image:url({{icon}}) !important;} .appcube{{@index}}:hover {background-image:url({{icon_hover}}) !important;}'+
         '</style>' +
         '<a href="{{url}}" class="liste appcube{{@index}}" style="background-image:url({{icon}})" target="_blank"><span class="text-regular text-uppercase text-center">{{short_name}}</span></a>' +
         '</li>' +
         '{{/applications}}';

        var template = Handlebars.compile(html);
        var result = template({applications: data});

        this.$el.html(result);
    },

    showSpinner: function () {
        var html = '<div id="spinner-applications" class="spinner" style="">' +
                   '<img id="img-spinner" src="' + window.bandeauModule.getURL() + '/dist/img/spinner.gif' + '" alt="Loading"/>' +
                   '</div>';
        this.$el.html(html);
    },

    update: function () {
        this.showSpinner();

        var url = window.bandeauModule.getURL() + '/api/v1/applications?default=true';

        if (window.bandeauModule.isAuthenticated()) {
            url = window.bandeauModule.getURL() + '/api/v1/users/self/favorites';
        }
        var self = this;
        $.ajax({
            url: url,
            xhrFields: { withCredentials: true },
            statusCode: {
                401: function () {
                    window.bandeauModule.setAuthentication(false);
                    self.update();
                }
            }
        }).done(function (data) {
            self.render(data);
        });
    }
});

module.exports = ApplicationView;