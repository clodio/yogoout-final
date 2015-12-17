/*eslint-disable strict, quotes, space-in-parens, padded-blocks, brace-style, no-multiple-empty-lines, one-var, no-trailing-spaces*/
/*eslint-disable no-undef, no-unused-vars*/

var bandeauModule = window.bandeauModule;
var jQuery = bandeauModule.$;
var $ = jQuery;

var dataMapBandeau = require('./map');

var ApplicationList = require('../components/ApplicationListView');

$(document).on("TemplateLoaded", function (event) {

    (function ($) {

        height = 60;
        heightEvitement = 22;
        heightWithEvitement = height + heightEvitement;
        mapHeight = 200;
        mapWidth = 200;

        $(document).ready(function () {

            /**
             * Init application list subview
             * @type {ApplicationView|exports|module.exports}
             */
            var applicationList = new ApplicationList({el: $('#appl')});
            applicationList.initialize();

            $("#bandeau .inactive").on('click', function () {
                return false;
            });

            $("#loginToggle").on('click', function () {
                if (!$("#loginToggle").closest('#header-right').hasClass('inactive')) {
                    if (!$("#loginToggle").hasClass('active')) {
                        $(".search-div").removeClass('active');
                        $("#recherche").removeClass('active');
                        $("#select").removeClass('active').find('.select-dropdown').hide();
                        $("#application-id").removeClass('active');
                        $("#liste-appli").removeClass('active');
                        openOverlay();
                        $("#loginToggle").addClass('active');

                        formContainer = $("#loginToggle").next();
                        formContainer.addClass('active');
                        formContainer.find('#champs').stop().fadeIn(300);
                    } else {
                        closeOverlay();
                        $("#loginToggle").removeClass('active');
                        formContainer = $("#loginToggle").next();
                        formContainer.removeClass('active');
                        formContainer.find('#champs').stop().hide();
                    }
                }
                return false;
            });
            $("#recherche").on('click', function () {
                if (!$("#recherche").closest('#header-right').hasClass('inactive')) {
                    if (!$("#recherche").hasClass('active')) {
                        $("#loginWin").removeClass('active');
                        $("#application-id").removeClass('active');
                        $("#liste-appli").removeClass('active');
                        $("#select").removeClass('active').find('.select-dropdown').hide();
                        $(".modecnx").removeClass('active');
                        $("#loginToggle").removeClass('active');
                        openOverlay();
                        $("#recherche").addClass('active');
                        formContainer = $("#recherche").next();
                        formContainer.addClass('active');
                        formContainer.find('#recherche').stop().fadeIn(25000);
                    } else {
                        closeOverlay();
                        $("#recherche").removeClass('active');
                        var formContainer = $("#recherche").next();
                        formContainer.removeClass('active');

                    }
                }
                return false;
            });

            $("#application-id").on('click', function () {
                applicationList.update();
                if (!$("#application-id").closest('#header-right').hasClass('inactive')) {
                    if (!$("#application-id").hasClass('active')) {
                        $("#loginWin").removeClass('active');
                        $(".modecnx").removeClass('active');
                        $("#loginToggle").removeClass('active');
                        $("#select").removeClass('active').find('.select-dropdown').hide();
                        $(".search-div").removeClass('active');
                        $("#recherche").removeClass('active');
                        openOverlay();
                        $("#application-id").addClass('active');
                        var formContainer = $("#application-id").next();
                        formContainer.addClass('active');
                        formContainer.find('#application-id').stop().fadeIn(300);
                    } else {
                        closeOverlay();
                        $("#application-id").removeClass('active');
                        formContainer = $("#application-id").next();
                        formContainer.removeClass('active');

                    }
                }
                return false;
            });

            is_map_set = false;
            $("#espace").on('click', function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $("#recherche").removeClass('noselect');
                    CloseEspaces();
                } else {
                    $(this).addClass('active');
                    $("#recherche").addClass('noselect');
                    OpenEspaces();
                    openOverlay();
                }

                if (!is_map_set) {

                    // MAP

                    jQuery.fn.vectorMap('addMap', 'france-map', dataMapBandeau);

                    jQuery('#vmap').vectorMap({
                        map: 'france-map',
                        backgroundColor: '#ea4d38',
                        color: '#fff',
                        hoverColor: '#942116',
                        selectedColor: '#942116',
                        borderColor: '#ea4d38',
                        enableZoom: false,
                        showTooltip: true
                    });

                    jQuery('body').on('mouseenter', '#vmap path', function () {
                        theDep = "#mapLink-" + jQuery(this).attr('id').substr(8, 2);
                        // Corse
                        if (theDep === '#mapLink-45' || theDep === '#mapLink-46') {
                            jQuery('#mapLink-45').addClass('hover');
                            jQuery('#jqvmap1_45').attr('fill', '#942116');
                            jQuery('#jqvmap1_46').attr('fill', '#942116');
                        }
                        // DOM
                        else if (theDep === '#mapLink-41' || theDep === '#mapLink-42' || theDep === '#mapLink-43' || theDep === '#mapLink-44') {
                            jQuery('#mapLink-41').addClass('hover');
                            jQuery('#jqvmap1_41').attr('fill', '#942116');
                            jQuery('#jqvmap1_42').attr('fill', '#942116');
                            jQuery('#jqvmap1_43').attr('fill', '#942116');
                            jQuery('#jqvmap1_44').attr('fill', '#942116');
                        }
                        // MEUSE
                        else if (theDep === '#mapLink-20' || theDep === '#mapLink-23') {
                            jQuery('#mapLink-20').addClass('hover');
                            jQuery('#jqvmap1_20').attr('fill', '#942116');
                            jQuery('#jqvmap1_23').attr('fill', '#942116');
                        } else {
                            jQuery(theDep).addClass('hover');
                        }
                    });

                    jQuery('body').on('mouseout', '#vmap path', function () {
                        theDep = "#mapLink-" + jQuery(this).attr('id').substr(8, 2);
                        // Corse
                        if (theDep === '#mapLink-45' || theDep === '#mapLink-46') {
                            jQuery('#mapLink-45').removeClass('hover');
                            jQuery('#jqvmap1_45').attr('fill', '#fff');
                            jQuery('#jqvmap1_46').attr('fill', '#fff');
                        }
                        // DOM
                        else if (theDep === '#mapLink-41' || theDep === '#mapLink-42' || theDep === '#mapLink-43' || theDep === '#mapLink-44') {
                            jQuery('#mapLink-41').removeClass('hover');
                            jQuery('#jqvmap1_41').attr('fill', '#fff');
                            jQuery('#jqvmap1_42').attr('fill', '#fff');
                            jQuery('#jqvmap1_43').attr('fill', '#fff');
                            jQuery('#jqvmap1_44').attr('fill', '#fff');
                        }
                        // MEUSE
                        else if (theDep === '#mapLink-20' || theDep === '#mapLink-23') {
                            jQuery('#mapLink-20').removeClass('hover');
                            jQuery('#jqvmap1_20').attr('fill', '#fff');
                            jQuery('#jqvmap1_23').attr('fill', '#fff');
                        } else {
                            jQuery(theDep).removeClass('hover');
                        }
                    });

                    jQuery('body').on('mouseenter', '#region-list a', function () {
                        theDep = "#jqvmap1_" + jQuery(this).attr('id').substr(8, 2);
                        // Corse
                        if (theDep === '#jqvmap1_45') {
                            jQuery('#jqvmap1_45').attr('fill', '#942116');
                            jQuery('#jqvmap1_46').attr('fill', '#942116');
                        }
                        // DOM
                        else if (theDep === '#jqvmap1_41' || theDep === '#jqvmap1_42' || theDep === '#jqvmap1_43' || theDep === '#jqvmap1_44') {
                            jQuery('#jqvmap1_41').attr('fill', '#942116');
                            jQuery('#jqvmap1_42').attr('fill', '#942116');
                            jQuery('#jqvmap1_43').attr('fill', '#942116');
                            jQuery('#jqvmap1_44').attr('fill', '#942116');
                        }
                        // MEUSE
                        else if (theDep === '#jqvmap1_20' || theDep === '#jqvmap1_23') {
                            jQuery('#jqvmap1_20').attr('fill', '#942116');
                            jQuery('#jqvmap1_23').attr('fill', '#942116');
                        } else {
                            jQuery(theDep).attr('fill', '#942116');
                        }
                    });

                    jQuery('body').on('mouseout', '#region-list a', function () {
                        theDep = "#jqvmap1_" + jQuery(this).attr('id').substr(8, 2);
                        // Corse
                        if (theDep === '#jqvmap1_45') {
                            jQuery('#jqvmap1_45').attr('fill', '#fff');
                            jQuery('#jqvmap1_46').attr('fill', '#fff');
                        }
                        // DOM
                        else if (theDep === '#jqvmap1_41' || theDep === '#jqvmap1_42' || theDep === '#jqvmap1_43' || theDep === '#jqvmap1_44') {
                            jQuery('#jqvmap1_41').attr('fill', '#fff');
                            jQuery('#jqvmap1_42').attr('fill', '#fff');
                            jQuery('#jqvmap1_43').attr('fill', '#fff');
                            jQuery('#jqvmap1_44').attr('fill', '#fff');
                        } // DOM
                        else if (theDep === '#jqvmap1_20' || theDep === '#jqvmap1_23') {
                            jQuery('#jqvmap1_20').attr('fill', '#fff');
                            jQuery('#jqvmap1_23').attr('fill', '#fff');
                        } else {
                            jQuery(theDep).attr('fill', '#fff');
                        }
                    });

                    is_map_set = true;
                }

                $("#vmap svg").attr("style", 'width:100%; height: 100%');
                $("#vmap svg g").attr("transform", "scale(0.51) translate(0, 105)");

                return false;
            });

            // Select
            $('#select').find('h2 a').on('click', function (e) {
                e.preventDefault();
                slct = $(this).parents('.select');
                selectDrop = slct.find('.select-dropdown');
                if (slct.hasClass('active')) {
                    slct.removeClass('active');
                    selectDrop.slideUp('fast');
                } else {
                    slct.addClass('active');
                    selectDrop.slideDown('fast');
                }

                if ($('#loginToggle').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#loginToggle, #loginWin, #loginToggle, .modecnx.profil').removeClass('active');
                    $('#champs').stop().hide();
                    closeOverlay();
                }

                if ($('#recherche').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#recherche, .search-div.profil').removeClass('active');
                    $('#champs').stop().hide();
                    closeOverlay();
                }

                if ($('#application-id').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#application-id, .prof.profil').removeClass('active');
                    $('#champs').stop().hide();
                    closeOverlay();
                }
            });

            $('#select').on('click', function (e) {
                e.stopPropagation();
            });

            $('html').on('click', function () {
                slct = $('#select');
                selectDrop = slct.find('.select-dropdown');
                if (slct.hasClass('active')) {
                    slct.removeClass('active');
                    selectDrop.slideUp('fast');
                }
            });

            $('#bandeau a.dropdown-toggle').focus(function () {
                $('#evitement').addClass('invis');
            });

            $('#evitement a').on('focus', function () {
                $('#evitement').removeClass('invis');
            }).on('blur', function () {
                $('#evitement').addClass('invis');
            });

            // Label

            setTimeout(function () {
                $('.bloc-input input').each(function () {
                    var elem = $(this);
                    if (elem.val()) elem.change();
                });
            }, 250);
            $('.bloc-input label').on('click', function () {
                $(this).addClass('focused');
                $(this).next('input').focus();
            });
            $('.bloc-input input').on('focus', function () {
                $(this).prev('label').addClass('focused');
            });
            $('.bloc-input input').on('blur', function () {
                $('.bloc-input input').each(function () {
                    if ($(this).val() === '') {
                        $(this).prev('label').removeClass('focused');
                    }
                });
            });

            // label recherche

            $('#recher-input').val('');
            $('#recher-label').on('click', function () {
                $(this).animate({
                    top: 0,
                    left: 31

                }, 300).hide();
                $(this).next('input').focus();
            });
            $('#recher-input').on('blur', function () {
                if ($(this).val() === '') {
                    $(this).prev('label').animate({
                        top: 0,
                        left: 31
                    }).show();
                }
            });
            $('#recher-input').on('focus', function () {
                if ($(this).val() === '') {
                    $(this).prev('label').animate({
                        top: 0,
                        left: 31
                    }).hide();
                }
            });


            //
            $("#header-menu li button").click(function () {
                if ($(this).hasClass('active')) {
                } else {
                    $("#header-menu li button").removeClass('active').attr("aria-expanded", "false");
                    $(this).addClass('active');
                    $(this).attr("aria-expanded", "true");
                    $("#header-menu li ul.sous-menu-header").hide();
                    $(this).next("ul.sous-menu-header").fadeIn();
                }
            });

            $(document).on('click', "#content, #select h2 a, #overlay-body, #id-header2 .logo, #id-header2 #select, #id-header2 .espace, #id-header2 .search, #id-header2 .application", function () {
                if ($('#loginToggle').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#loginToggle, #loginWin, #loginToggle, .modecnx.profil').removeClass('active');
                    $('#champs').stop().hide();
                    closeOverlay();
                }

                if ($('#recherche').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#recherche, .search-div.profil').removeClass('active');
                    $('#champs').stop().hide();
                    closeOverlay();
                }

                if ($('#application-id').hasClass('active')) {
                    // $('.profil').slideUp(400);
                    $('#application-id, .prof.profil').removeClass('active dragging');
                    formContainer = $("#loginToggle").next();
                    formContainer.find('#champs').stop().hide();
                    closeOverlay();
                }

            });

            $(document).on('click', "#overlay-body", function () {
                if ($('#espace').hasClass('active')) {
                    CloseEspaces();
                    $('#espace').removeClass('active');
                }
            });

            /**
             *        SAFARI HACK
             **/
            var isSafari = /constructor/i.test(window.HTMLElement);
            var OSName = "Unknown OS";
            if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
            else if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
            else if (navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
            else if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";

            if (isSafari && (OSName === 'MacOS')) {
                jQuery('.select h2 a .service').css({
                    'line-height': '0.8em'
                });
            }

            if (!isSafari && (OSName === 'MacOS')) {
                jQuery('.select h2 a .service').css({
                    'line-height': '0.7em'
                });
            }


            /* ----- APPLICATIONS ----- */

            var backtotop = $('#backtotop'),
                sideFilters = $('#side-filters');

            backtotop.on('click', function (e) {
                $('html, body').animate({
                    scrollTop: 0
                }, 'fast');
                return false;
            });

            $(window).on('scroll', function () {
                if ($(this).scrollTop() >= 110) {
                    sideFilters.addClass('fixed');
                } else {
                    sideFilters.removeClass('fixed');
                }
            });

            /* Drag n' Drop */

            var removeIntent = false;
            /*
             $( ".infos.drag" ).draggable({
             revert: 'invalid',
             helper: "clone",
             handle: ".dragger",
             refreshPositions: true,
             start: function( event, ui ) {
             $('#bandeau #liste-appli .dragging-over').fadeIn('fast');
             $('#app-notification').hide();
             }
             });

             $('#appl').droppable({
             accept: ".infos",
             tolerance: "pointer",
             hoverClass: "drop-hover",
             over: function( event, ui ) {
             $('#bandeau #liste-appli .dragging-over').fadeOut('fast');
             },
             out: function( event, ui ) {
             $('#bandeau #liste-appli .dragging-over').fadeIn('fast');
             },
             drop: function( event, ui ) {
             var appName = $(ui.helper).data('app');
             var appLink = $(ui.helper).data('link');
             var appAlert = ($(ui.helper).data('alert') == true) ? ' alert' : '';
             var appId = $(ui.helper).data('id');
             if ( $(this).find('li').length < 15 ) {
             $(this).append(' <li class="ui-sortable-handle"><a href="'+appLink+'" data-id="'+appId+'"" class="liste'+appAlert+'">'+appName+'</a></li> ');
             $('#apps .app .infos[data-id="'+appId+'"]').find('.pin').addClass('pinned');
             }
             },
             activate: function( event, ui ) {
             $('#liste-appli').addClass('active dragging');
             $('#application-id').addClass('active');
             }
             }).sortable({
             over: function (event, ui) {
             removeIntent = false;
             ui.item.addClass('dragging');
             ui.item.removeClass('removed');
             },
             out: function (event, ui) {
             removeIntent = true;
             ui.item.addClass('dragging removed');
             },
             beforeStop: function (event, ui) {
             if(removeIntent == true){
             theId = ui.item.find('.liste').data('id');
             ui.item.remove();
             $('#apps .app .infos[data-id="'+theId+'"]').find('.pin').removeClass('pinned');
             }
             },
             stop: function (event, ui) {
             $(this).find('li').removeClass('removed dragging');
             }
             });

             var pinApp = $('#apps .pin'),
             pinNotif = $('#app-notification'),
             timer;

             pinApp.on('click', function() {
             _self = $(this);
             theId = _self.parents('.infos').data('id');
             pinNotif.find('span').hide();
             if ( _self.hasClass('pinned') ) {
             pinNotif.find('.remove').show();
             _self.removeClass('pinned');
             $('#appl a[data-id="'+theId+'"]').parent('li').remove();
             } else {
             if ( $('#appl').find('li').length < 15 ) {
             pinNotif.find('.add').show();
             _self.addClass('pinned');

             var appName = _self.parents('.infos').data('app');
             var appLink = _self.parents('.infos').data('link');
             var appAlert = (_self.parents('.infos').data('alert') == true) ? ' alert' : '';
             if ( $('#appl').find('li').length < 15 ) {
             $('#appl').append(' <li class="ui-sortable-handle"><a href="'+appLink+'" data-id="'+theId+'" class="liste'+appAlert+'">'+appName+'</a></li> ');
             }
             } else {
             pinNotif.find('.toomuch').show();
             }
             }
             pinNotif.fadeIn('fast');
             timer = setTimeout(function() {
             pinNotif.fadeOut('fast');
             clearTimeout(timer);
             }, 3000);
             });
             */


        });

// Overlay
        function openOverlay () {
            $('#overlay-body').fadeIn();
        }

        function closeOverlay () {
            $('#overlay-body').fadeOut();
        }

        function OpenEspaces () {
            $("#header-menu li ul.sous-menu-header").hide();
            $("#header-menu li > button").removeClass('active');
            $("#header-menu li:nth-child(1) ul.sous-menu-header").fadeIn(1000);
            $("#header-menu li:nth-child(1) > button").addClass('active').attr("aria-expanded", "true");
            $('#select').removeClass('active').find('.select-dropdown').slideUp('fast');
            h = $(window).height();

            h_espaces = $(window).height() - 180;

            $("#menu").animate({
                height: h_espaces
            }, 400);

            /* $(window).resize(function() {
             h_espaces = $(window).height() - 180;

             $("#menu").css({
             height: h_espaces,
             });
             });*/

            $('#line-sous').show();
            $("#header-right").addClass('inactive');
            openOverlay();
            if ($('#loginToggle , #recherche , #application-id').hasClass('active')) {
                $('#loginToggle, #loginWin , #recherche , #application-id').removeClass('active');
                $('#champs').stop().hide();
                closeOverlay();
            }
            $('#affichage').addClass('ombre');

            $("#loginToggle , #recherche , #application-id").removeClass('active');
            formContainer = $("#loginToggle , #recherche , #application-id").next();
            formContainer.removeClass('active');
        }

        function CloseEspaces () {
            $("#header-menu li ul.sous-menu-header").hide();
            $("#menu").animate({
                height: "0"
            }, function () {
                $('#id-header2').attr('style', '');
            });
            $('#line-sous').hide();
            $("#header-right").removeClass('inactive');
            closeOverlay();
            $('#affichage').removeClass('ombre');
        }

// Scroll notifs
        $(window).load(function () {

        });

    })(jQuery);

    // TODO enable later
    $('#select').find('h2 a').off('click');
    $("#recherche").off('click');
    // $("#application-id").off('click');

    bandeauModule.notifyApplication();
});
