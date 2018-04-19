var Login = function(){};

Login.prototype = {
    el: '#login-form',
    events: {
        "submit": "submitLogin"
    },

    initialize: function() {

        $(this.el).on("submit", _.bind(this.submitLogin, this));
    },

    submitLogin: function(e) {
        e.preventDefault();

        var email = $('#login-email').val();
        var pass = $('#login-password').val();

        this.loginUser(email, pass);
    },

    loginUser: function(email, pass) {
        $.ajax({
            url: "/login",
            method: "POST",
            data: {
                email: email,
                password: pass
            },
            dataType: "json",
            success: _.bind(function() {
                debugger;
                window.location.reload();
            }, this),
            error: function(res, err) {
                $(".invalid-data").removeClass("hidden");
                console.log ("Error logging in");
                console.log(err);
            }
        });
    }
};
