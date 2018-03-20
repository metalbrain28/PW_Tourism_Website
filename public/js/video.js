
    // Video
    // var video = $(document).find("#video").get(0);
    //
    // // Buttons
    // var playButton = $(document).find("#play-pause");
    // var muteButton = $(document).find("#mute");
    // var fullScreenButton = $(document).find("#full-screen");
    //
    // // Sliders
    // var seekBar = $(document).find("#seek-bar");
    // var volumeBar = $(document).find("#volume-bar");

// $(document).on("click", "#play-pause", function() { console.log("potato"); });

    // TODO: manage this with a class (construct/destroy every time a modal is opened; destroy events on close)

    // Event listener for the play/pause button
// $(document).on("click", "#play-pause", function() {
//     // debugger;
//     if (video.paused == true) {
//         // Play the video
//         video.play();
//
//         // Update the button text to 'Pause'
//         playButton.innerHTML = "Pause";
//     } else {
//         // Pause the video
//         video.pause();
//
//         // Update the button text to 'Play'
//         playButton.innerHTML = "Play";
//     }
// });

    // Event listener for the mute button
//     muteButton.addEventListener("click", function() {
//         if (video.muted == false) {
//             // Mute the video
//             video.muted = true;
//
//             // Update the button text
//             muteButton.innerHTML = "Unmute";
//         } else {
//             // Unmute the video
//             video.muted = false;
//
//             // Update the button text
//             muteButton.innerHTML = "Mute";
//         }
//     });
//
//     // Event listener for the full-screen button
//     fullScreenButton.addEventListener("click", function() {
//         if (video.requestFullscreen) {
//             video.requestFullscreen();
//         } else if (video.mozRequestFullScreen) {
//             video.mozRequestFullScreen(); // Firefox
//         } else if (video.webkitRequestFullscreen) {
//             video.webkitRequestFullscreen(); // Chrome and Safari
//         }
//     });
//
//     // Event listener for the seek bar
//     seekBar.addEventListener("change", function() {
//         // Calculate the new time
//         var time = video.duration * (seekBar.value / 100);
//
//         // Update the video time
//         video.currentTime = time;
//     });
//
//     // Update the seek bar as the video plays
//     video.addEventListener("timeupdate", function() {
//         // Calculate the slider value
//         var value = (100 / video.duration) * video.currentTime;
//
//         // Update the slider value
//         seekBar.value = value;
//     });
//
//     // Pause the video when the slider handle is being dragged
//     seekBar.addEventListener("mousedown", function() {
//         video.pause();
//     });
//
// // Play the video when the slider handle is dropped
//     seekBar.addEventListener("mouseup", function() {
//         video.play();
//     });
//
//     // Event listener for the volume bar
//     volumeBar.addEventListener("change", function() {
//         // Update the video volume
//         video.volume = volumeBar.value;
//     });
// };

var Video = function() {
    this.video = $(document).find("#video").get(0);
    this.playButton = $(document).find("#play-pause").get(0);
    this.muteButton = $(document).find("#mute").get(0);
    this.fullScreenButton = $(document).find("#full-screen").get(0);

    // Sliders
    this.seekBar = $(document).find("#seek-bar").get(0);
    this.volumeBar = $(document).find("#volume-bar").get(0);
};

Video.prototype = {
    video: null,
    playButton: null,
    muteButton: null,
    fullScreenButton: null,
    seekBar: null,
    volumeBar: null,

    playClass: "fa-play-circle",
    pauseClass: "fa-pause-circle",

    init: function() {
        this.enablePlayEvent();
        // this.enableVolume();

        //Store frequently elements in variables
        var slider  = $('#slider'),
            tooltip = $('.tooltip');

        //Hide the Tooltip at first
        tooltip.hide();

        //Call the Slider
        slider.slider({
            //Config
            range: "min",
            min: 1,
            value: 35,

            start: function(event,ui) {
                tooltip.fadeIn('fast');
            },

            //Slider Event
            slide: function(event, ui) { //When the slider is sliding

                var value  = slider.slider('value'),
                    volume = $('.volume');

                tooltip.css('left', value).text(ui.value);  //Adjust the tooltip accordingly

                if(value <= 5) {
                    volume.css('background-position', '0 0');
                }
                else if (value <= 25) {
                    volume.css('background-position', '0 -25px');
                }
                else if (value <= 75) {
                    volume.css('background-position', '0 -50px');
                }
                else {
                    volume.css('background-position', '0 -75px');
                };

            },

            stop: function(event,ui) {
                tooltip.fadeOut('fast');
            },
        });


    },

    destroy: function() {},

    enablePlayEvent: function() {
        this.playButton.addEventListener("click", _.bind(function() {
            if (this.video.paused) {
                // Play the video
                this.video.play();

                // Update the button text to 'Pause'
                $(this.playButton).find("i").removeClass(this.playClass).addClass(this.pauseClass);
            } else {
                // Pause the video
                this.video.pause();

                // Update the button text to 'Play'
                $(this.playButton).find("i").removeClass(this.pauseClass).addClass(this.playClass);
            }
        }, this));
    },

    enableVolume: function() {
        this.volumeBar.addEventListener("change", _.bind(function() {
            // Update the video volume

            console.log(this.volumeBar.value);

            this.video.volume = this.volumeBar.value;

            var volumeIcon = $(this.volumeBar).parent().find("i");
            if (this.volumeBar.value > 0.9) {
                volumeIcon
                    .removeClass("volume-off")
                    .removeClass("volume-down")
                    .addClass("volume-up");
            } else if (!this.volumeBar.value) {
                volumeIcon
                    .removeClass("volume-up")
                    .removeClass("volume-down")
                    .addClass("volume-off");
            } else {
                volumeIcon
                    .removeClass("volume-off")
                    .removeClass("volume-up")
                    .addClass("volume-down");
            }
        }, this));
    }
};
