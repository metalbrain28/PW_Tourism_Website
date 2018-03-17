
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
$(document).on("click", "#play-pause", function() {
    debugger;
    if (video.paused == true) {
        // Play the video
        video.play();

        // Update the button text to 'Pause'
        playButton.innerHTML = "Pause";
    } else {
        // Pause the video
        video.pause();

        // Update the button text to 'Play'
        playButton.innerHTML = "Play";
    }
});

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