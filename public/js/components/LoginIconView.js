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
        var data = { first_name: '', last_name: ''};

        if (window.bandeauModule.isAuthenticated()) {
            data = window.bandeauModule.getUserData();
        }

        var template = Handlebars.compile($('#login_icon_status_script_view').html());
        var result = template(data);

        this.$el.html(result);
    }
});

module.exports = LoginIconView;