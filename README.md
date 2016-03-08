# Custom Youtube Player
Provides a method of customizing a Youtube player look-and-fell.
Custom Youtube Player runs in any modern browser (Chrome, Firefox, Safari, IE 10+) without the need of external libraries (jQuery, Mootols, etc.).

## How to start using Custom Youtube Player
To use Custom Youtube Player, simply run the code below after the DOM element you want to act as a Youtube player has been loaded.
  
    new customYTPlayer('#your-dom-element', {
      videoID       : 'VlcLuRR8LL0',  // ID of the video you want to play
      width         : '720px',        // Width of the player
      height        : '480px',        // Height of the player
      quality       : 'default',      // Playback quality. For more info, check the Youtube API 
      mute          : false,          // Start the video muted
      volume        : 50,             // Initial volume of the video
      args: {
        autoplay: false,              // Start playing the video once its metadata has been loaded
        loop: false                   // Loops the video once it has finished playing
      }
    });

## 
