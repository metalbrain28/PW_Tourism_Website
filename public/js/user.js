"use strict";

$(document).on("submit", "#register-form", function (e) {
    e.preventDefault();

    var form = e.target;

    if (!validate(form)) {
        console.log("Invalid register form.");
        return;
    }

    var formData = {
        firstname: form.firstname.value,
        lastname: form.lastname.value,
        email: form.email.value,
        password: form.password.value
    };

    $.ajax({
        method: "POST",
        url: "/register",
        data: formData
    }).done(function(data) {
        console.log(data);
    });

    console.log(formData);

    console.log("register form submitted.");
});

function validate(form) {
    return "potato";
}