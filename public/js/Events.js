"use strict";

function Analytics() {}

Analytics.prototype = {

    mouseTrackInterval: null,
    linksList: [],

    initialize: function() {
        $(".mouse-statistics").off("click").on("click", _.bind(function() {
            $("#mouseStatistics").toggleClass("hidden");
            $(".backdrop").toggleClass("hidden");
        }, this));

        this.trackLinksClick();
    },

    trackLinksClick: function() {
        var $linksList = $(".navbar a, section a");

        $linksList.on("click", _.bind(function(e) {
            this.linksList.push(e.target.id);
        }, this));

        window.addEventListener("beforeunload", _.bind(function (event) {
            event.preventDefault();
            if (this.linksList.length) {
                $(document).off("mousemove");
                this.mouseTrackInterval = null;
                // console.log(JSON.stringify({linksList: this.linksList}));
                this.trackData("links", JSON.stringify({linksList: this.linksList}));
            }
        }, this));
    },

    trackMousemove: function() {
        var coordinates = {
            pageX: 0,
            pageY: 0,
            screenX: 0,
            screenY: 0
        };

        $(document).off("mousemove").on("mousemove", _.bind(function(e) {
            coordinates = {
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY
            };

            if (!this.mouseTrackInterval) {
                this.mouseTrackInterval = setInterval(_.bind(function () {
                    this.trackData("mousemove", JSON.stringify(coordinates));
                }, this), 5000);
            }
        }, this));
    },

    trackData: function(action, details) {
        $.ajax({
            method: "POST",
            url: "/track",
            dataType: "json",
            data: {
                action: action,
                details: details
            },
            success: function(data) {
                // console.log(data);
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
    },

    trackUserVisit: function() {
        this.trackData("visit", "")
    }
};
