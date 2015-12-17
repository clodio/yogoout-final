/*eslint strict: [2, "never"]*/

// Expose bandeau module to the rest of the page
require('./bandeau');

var bandeau = window.bandeauModule;
var $ = window.bandeauModule.$;

require('./web-agency/jquery.vmap');
require('./web-agency/settings');
require('./web-agency/script');

$(document).on('DOMContentLoaded', function (event) {
    var mainDiv = document.getElementById('bandeau-portail');
    var scriptTag = document.getElementById('bandeau-script');

    if (!mainDiv || !scriptTag) {
        return;
    }

    bandeau.init(mainDiv, scriptTag);
});