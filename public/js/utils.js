/*eslint strict: [2, "never"]*/

var utilsModule = {};

(function () {
    this.popupCenter = function (url, title, width, height) {
        var left = ((window.screen.width / 2) - (width / 2));
        var top = ((window.screen.height / 2) - (height / 2));
        var popup_window = window.open(url, title, 'resizable=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            popup_window.focus();
        }
    };
}).apply(utilsModule);

module.exports = utilsModule;

