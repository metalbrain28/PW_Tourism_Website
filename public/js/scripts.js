"use strict";

/* Scrolling to sections with anchors */
$('a[href*="#"]')
// Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            // Does a scroll target exist?
            if (target.length) {
                $(".nav-link").removeClass("active");
                $(event.target).addClass("active");
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });

$(document).ready(function() {
    var $loginModal = $("#login_register_modal");
    var $loginForm = $("#login-form");
    var $registerForm = $("#register-form");

    var register = new Register();
    register.initialize();

    var login = new Login();
    login.initialize();

    window.trips = new Trip();
    trips.initialize();

    window.tracker = new Analytics();
    tracker.initialize();
    tracker.trackMousemove();
    tracker.trackUserVisit();

    if (window.user) {
        var chat = new Chat();
        chat.initialize();
    }

    $("#login_button").on("click", function(e) {
        e.preventDefault();
        $loginModal.addClass("show");
        $(".backdrop").removeClass("hidden");
    });

    $("#logout_button").on("click", function(e) {
        $.post('/logout')
            .done(function() {
                window.location.reload();
            });
    });

    $("#login-form-link").click(function(e) {
        $registerForm.hide();
        $loginForm.show();
    });

    $("#register-form-link").click(function(e) {
        $loginForm.hide();
        $registerForm.show();
    });

    $(document).on("click", ".close-modal", function() {
        $(this).closest(".modal").removeClass("show");
        $(".backdrop").addClass("hidden");
    });

    $(document).on("click", ".backdrop", function() {
        $(".modal").removeClass("show");
        $(".backdrop").addClass("hidden");
    });

    $("#links_order_show").on("click", function() {
        if ($(this).hasClass("on")) {
            $(this).removeClass("on");
            $(this).text("Show links statistics");

            _.map(window.linksStatistics, function(count, link) {
                $("#" + link).find("span").remove();
            });
        } else {
            $(this).addClass("on");
            $(this).text("Hide links statistics");
            var index = 0;
            _.map(window.linksStatistics, function(count, link) {
                $("#" + link).append($("<span class='link-statistic'>" + (++index) + "</span>"));
            });
        }
    });
});
