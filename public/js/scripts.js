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


window.onload = function() {

    var $loginModal = $("#login_register_modal");
    var $loginForm = $("#login-form");
    var $registerForm = $("#register-form");

    var register = new Register();
    register.initialize();

    var login = new Login();
    login.initialize();

    var chat = new Chat();
    chat.initialize();

    /* Open trip booking modal */
    $(".book-trip").on("click", function(e) {

        var tripID = $(this).data("tripid");

        var template = $("#booking_modal").html();
        $("#booking_modal_container").html(_.template(template)({tripID: tripID}));

        $("#booking_modal_container").addClass("show");

        $(".backdrop").addClass("show");

        // var video = new Video();
        // video.init();
    });

    $("#login_button").on("click", function(e) {
        e.preventDefault();
        $loginModal.addClass("show");
        $(".backdrop").addClass("show");
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
        $(".backdrop").removeClass("show");
    });

    $(document).on("click", ".backdrop", function() {
        $(".modal").removeClass("show");
        $(".backdrop").removeClass("show");
    });

    $("#test").click(function() {
        $.ajax({
            method: "POST",
            url: "/chat",
            data: {
                chat_data: JSON.stringify({
                    message: "potato"
                })
            },
            success: function(data) {
                console.log(data);
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
};
