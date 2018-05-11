function Trip() {
    this.tripWidgetTemplate = $("#trip_widget_template").html();
    this.showTripModalTemplate = $("#booking_modal_template").html();
    this.tripModalContainer = $("#booking_modal_container");
}

Trip.prototype = {
    tripWidgetTemplate: null,
    showTripModalTemplate: null,
    tripModalContainer: null,
    singlePrice: 0,
    tripID: null,
    mapMarker: null,
    latitude: 0,
    longitude: 0,

    initialize: function() {
        /* Register events */
        $("#add_trip").on("click", _.bind(this.openAddTripModal, this));

        $(document).on("click", ".book-trip", _.bind(this.openShowTripModal, this));
    },

    openShowTripModal: function(e) {
        var tripID = (typeof e === "number" ?  e : $(e.target).closest(".thumb").data("id"));

        return $.ajax({
            method: "GET",
            url: "/trips/" + tripID,
            dataType: "json",
            success: _.bind(function(data) {
                this.tripID = data.data.id;
                this.singlePrice = data.data.price;
                this.tripModalContainer.html(_.template(this.showTripModalTemplate)(data));
                this.tripModalContainer.addClass("show");
                $(".backdrop").removeClass("hidden");

                $("#people_no").on("change", _.bind(function(e){
                    $(".total-price").text(parseInt(this.singlePrice * parseFloat(e.target.value) * 100, 10) / 100);
                }, this));

                $("#book_trip_form").on("submit", _.bind(this.submitBookTrip, this));

                $(".fa-star").on("mouseover", _.bind(function(e) {
                    var starIndex = $(".fa-star").index(e.target);

                    $(".fa-star").removeClass("active");

                    for (var i = 0; i <= starIndex; i++) {
                        $(".fa-star").eq(i).addClass("active");
                    }
                }, this));

                $(".btn-rate").on("click", _.bind(function(e) {
                    var rating = $(".stars").find("input[type='radio']:checked").eq(0).data("value");

                    $.ajax({
                        method: "POST",
                        url: "/rating/" + this.tripID,
                        dataType: "json",
                        data: {rating: rating},
                        success: _.bind(function(data) {
                            console.log("Rated!");
                            $(".stars").removeClass("enabled");
                            $(".btn-rate").addClass("disabled").off("click");
                        }, this),
                        error: function(xhr) {
                            // TODO: render a "message not sent" next or smth
                            console.log(xhr);
                        }
                    });
                }, this));

            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    submitBookTrip: function(e) {
        e.preventDefault();

        var form = e.target;
        var data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            people_no: form.number.value
        };

        return $.ajax({
            method: "POST",
            url: "/trips/" + this.tripID,
            dataType: "json",
            data: data,
            success: _.bind(function(data) {
                this.closeBookTripModal();
            }, this),
            error: function(xhr) {
                // TODO: render a "message not sent" next or smth
                console.log(xhr);
            }
        });
    },

    openAddTripModal: function(e) {
        var template = $("#add_trip_template").html();
        $("#add_trip_modal_container").html(_.template(template)()).addClass("show");
        $(".backdrop").removeClass("hidden");

        this.initializeAddTripMap();

        $(".close").one("click", _.bind(this.closeAddTripModal, this));
        $(".file_upload").off("click").on("click", function(e) { $(e.target).find("input[type='file']").click(); });
        $(".file_upload input[type='file']").change(function(e) {
            var path = $(e.target).val().split(/[/\\]/);
            $(e.target).parents().eq(1).find("input[type='text']").val(path[path.length - 1]);
        });

        $("#trip_date_range").dateRangePicker();

        $("#add_trip_form").on("submit", _.bind(this.submitTrip, this));
    },

    initializeAddTripMap: function() {
        var myLatLng = {lat: 45.4408, lng: 12.3155};

        var map = new google.maps.Map(document.getElementById('map_add'), {
            zoom: 3,
            center: myLatLng
        });

        google.maps.event.addListener(map, 'click', _.bind(function(event) {
            this.addMarker(event.latLng, map);
        }, this));
    },

    addMarker: function(location, map) {
        this.mapMarker ? this.mapMarker.setMap(null) : null;
        var label = $("#add_trip_form").find("input[name='title']").val();
        this.mapMarker = new google.maps.Marker({
            position: location,
            label: label,
            map: map
        });
    },

    closeAddTripModal: function() {
        $("#add_trip_modal_container").empty().hide();
        $(".backdrop").addClass("hidden");
    },

    closeBookTripModal: function() {
        $("#booking_modal_container").empty().hide();
        $(".backdrop").addClass("hidden");
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
        var lat = this.mapMarker.position.lat();
        var lng = this.mapMarker.position.lng();
        var poster = form.poster.files[0];

        var fd = new FormData();
        fd.append('title', title);
        fd.append('short_description', short_description);
        fd.append('description', description);
        fd.append('nights_no', nights_no);
        fd.append('price', price);
        fd.append('start_date', start_date);
        fd.append('end_date', end_date);
        fd.append('latitude', lat);
        fd.append('longitude', lng);
        fd.append('poster', poster);

        $.ajax({
            method: "POST",
            url: "/trips",
            dataType: "json",
            processData: false,
            contentType: false,
            data: fd,
            success: _.bind(function(data) {
                $("#all_trips_container").append(_.template(this.tripWidgetTemplate)(data));

                $("#add_trip_modal_container").removeClass("show");
                $(".backdrop").addClass("hidden");
            }, this),
            error: function(xhr) {
                // TODO: render a "message not sent" next or smth
                console.log(xhr);
            }
        });
    }
};