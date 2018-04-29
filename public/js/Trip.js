function Trip() {
    this.tripWidgetTemplate = $("#trip_widget_template").html();
    this.showTripModalTemplate = $("#booking_modal_template").html();
    this.tripModalContainer = $("#booking_modal_container");
}

Trip.prototype = {
    tripWidgetTemplate: null,
    showTripModalTemplate: null,
    tripModalContainer: null,

    initialize: function() {
        /* Register events */
        $("#add_trip").on("click", _.bind(this.openAddTripModal, this));

        $(".book-trip").on("click", _.bind(this.openShowTripModal, this));
        // $(".book-trip").on("click", function(e) {
        //
        //     var tripID = $(this).data("tripid");
        //
        //     var template = $("#booking_modal").html();
        //     $("#booking_modal_container").html(_.template(template)({tripID: tripID}));
        //
        //     $("#booking_modal_container").addClass("show");
        //     $(".backdrop").addClass("show");
        //
        //     // var video = new Video();
        //     // video.init();
        // });
    },

    openShowTripModal: function(e) {
        var tripID = $(e.target).closest(".thumb").data("id");

        return $.ajax({
            method: "GET",
            url: "/trips/" + tripID,
            dataType: "json",
            success: _.bind(function(data) {
                this.tripModalContainer.html(_.template(this.showTripModalTemplate)(data));
                this.tripModalContainer.addClass("show");
                $(".backdrop").addClass("show");
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    renderNewTrip: function() {

    },

    openAddTripModal: function(e) {
        var template = $("#add_trip_template").html();
        $("#add_trip_modal_container").html(_.template(template)()).addClass("show");
        $(".backdrop").addClass("show");

        $(".close").one("click", _.bind(this.closeAddTripModal, this));
        $(".file_upload").off("click").on("click", function(e) { $(e.target).find("input[type='file']").click(); });
        $(".file_upload input[type='file']").change(function(e) {
            var path = $(e.target).val().split(/[/\\]/);
            $(e.target).parents().eq(1).find("input[type='text']").val(path[path.length - 1]);
        });

        $("#trip_date_range").dateRangePicker();

        $("#add_trip_form").on("submit", _.bind(this.submitTrip, this))
    },

    closeAddTripModal: function(e) {
        $("#add_trip_modal_container").empty().hide();
        $(".backdrop").removeClass("show");
    },

    submitTrip: function(e) {
        e.preventDefault();
        var form = $(e.target).closest("form").get(0);

        var title = form.title.value;
        var short_description = form.short_description.value;
        var description = form.description.value;
        var nights_no = form.nights_no.value;
        var price = form.price.value;
        var date_range = form.date_range.value.split(" to ");
        var start_date = date_range[0];
        var end_date = date_range[1];
        var poster = form.poster.files[0];

        var fd = new FormData();
        fd.append('title', title);
        fd.append('short_description', short_description);
        fd.append('description', description);
        fd.append('nights_no', nights_no);
        fd.append('price', price);
        fd.append('start_date', start_date);
        fd.append('end_date', end_date);
        fd.append('poster', poster);

        $.ajax({
            method: "POST",
            url: "/trips",
            dataType: "json",
            processData: false,
            contentType: false,
            data: fd,
            success: _.bind(function(data) {
                console.log(data)
            }, this),
            error: function(xhr) {
                // TODO: render a "message not sent" next or smth
                console.log(xhr);
            }
        });
    }
};