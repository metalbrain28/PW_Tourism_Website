"use strict";

var Register = function(){};

Register.prototype = {
    el: "#register-form",
    form: null,

    initialize: function() {
        this.form = $(this.el).get(0);

        $(this.el).on("submit", _.bind(this.submitForm, this));
        $(this.el).on("blur", ".form-control", _.bind(this.checkInput, this));
    },

    submitForm: function(e) {
        e.preventDefault();

        var base_elements = {
            firstname: $(this.form.firstname),
            lastname: $(this.form.lastname),
            email: $(this.form.email),
            phone: $(this.form.phone),
            password: $(this.form.password),
            confpass: $(this.form.confirm_password)
        };

        var errs = this.validateBaseElements(base_elements);

        if (!errs) {
            this.sendForm();
        }
    },

    sendForm: function(e) {
        var data = {
            firstname: this.form.firstname.value,
            lastname: this.form.lastname.value,
            email: this.form.email.value,
            phone: this.form.phone.value,
            password: this.form.password.value,
            confpass: this.form.confirm_password.value
        };

        $.ajax({
            url: "/register",
            method: "POST",
            data: data,
            dataType: "json",
            success: _.bind(function(data) {
                if (!data.length) {
                    $(this.el).html("<p class='success-log'>You have been successfully registered!</p>");

                    setTimeout(_.bind(function() {
                        window.location.reload();
                    }, this), 3000);
                }

            }, this),
            error: _.bind(function(err) {

                if (err.status === 400) {
                    $(this.el).find('.form-error').text("You are already registered.");
                }

                console.log(err);
                console.log ("Error registering");
            }, this)
        });
    },

    close: function() {
        $(this.el).closest(".modal").removeClass("show");
        $(".backdrop").addClass("hidden");
    },

    validateBaseElements: function(data) {
        var errors = [];
        Object.keys(data).map(_.bind(function(field) {
            if (!this.checkInput(data[field])) {
                errors.push(field);
            }
        }, this));

        !this.checkPassMatch() ? errors.push("confpass") : null;

        return errors.length;
    },

    checkInput: function(e) {
        var $el;
        if (e.length) {
            $el = e;
        } else {
            $el = $(e.target);
        }

        /* Mandatory fields */
        if ($el.hasClass('mandatory')) {
            if (!$el.val().length) {
                $el.addClass('error');
                return false;
            } else {
                $el.removeClass('error');
            }
        }

        /* Email check */
        if ($el.hasClass('email')) {
            if (!this.validateEmail($el.val())) {
                $el.addClass('error');
                return false;
            } else {
                $el.removeClass('error');
            }
        }

        /* Password strength */
        if ($el.hasClass('pass')) {
            if (!this.checkPassStrength($el.val())) {
                $el.addClass('error');
                return false;
            } else {
                $el.removeClass('error');
            }
        }

        if ($el.hasClass('confirm-pass')) {
            return this.checkPassMatch();
        }

        return true;
    },

    validateEmail: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    checkPassStrength: function(pass) {
        return pass.trim().length > 7;
    },

    checkPassMatch: function() {
        var pass = this.form.password.value;
        var confPass = this.form.confirm_password.value;

        if (pass !== confPass) {
            $(this.form.password).addClass('error');
            $(this.form.confirm_password).addClass('error');
            return false;
        } else {
            $(this.form.password).removeClass('error');
            $(this.form.confirm_password).removeClass('error');
        }
        return true;
    }
};