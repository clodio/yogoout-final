/*eslint strict: [2, "never"]*/
/*eslint space-infix-ops:0*/

var Backbone = require('backbone');
var $ = require('jquery');
var Handlebars = require('handlebars');

var LoginIconView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var scriptID = '#login_form_script_view';

        if (window.bandeauModule.isAuthenticated()) {
            scriptID = '#popover_notification_script_view';
        }

        var template = Handlebars.compile($(scriptID).html());
        var result = template();

        this.$el.html(result);

        this.updateCSS();
    },

    updateCSS: function () {
        if (window.bandeauModule.isAuthenticated()) {
            $('#loginWin').attr('class', 'modecnx profil');
        } else {
            $('#loginWin').attr('class', 'cadre_compte profil');
        }
    }
});

module.exports = LoginIconView;