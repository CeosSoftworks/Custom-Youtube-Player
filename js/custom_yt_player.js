/**
 * Copyright 2016 Jeferson dos Santos Oliveira
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict"

function customYTPlayer(selector, params) {
  params.args = params.args || {};
  
  /* VARS / PROPERTIES DECLARATION -------------------------------------------------- */
  
  var self = this;
  
  self.isSeeking  = false;
  self.seekEl     = null;
  self.selector   = selector;
  self.el         = document.querySelector(selector);
  self.videoEl    = document.createElement('div');
  self.thumbnail  = document.createElement('div');
  self.overlay    = document.createElement('div');
  self.controls   = document.createElement('div');
  self.params     = params;

  self.log('Creating custom Youtube element.');
  
  if(!(self.el instanceof HTMLElement)) {
    self.log('Invalid element given. Element must be an instance of HTMLElement.');
    return;
  }
  
  if(!params.videoID){
    self.log('No video ID given.');
    return;
  }
  
  /* IMAGES OF THE CONTROLS --------------------------------------------------------- */
  
  var imgPlay = 
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="584.603px" viewBox="0 0 512 584.603" enable-background="new 0 0 512 584.603" xml:space="preserve">\
        <g><path d="M512,292.306c0-8.037-4.503-14.944-11.081-18.567L33.424,3.831C29.982,1.432,25.804,0,21.292,0C9.534,0,0,9.525,0,21.282   c0,0.825,0.153,1.603,0.246,2.4H0V565.72h0.246c1.205,10.618,10.113,18.883,21.046,18.883c3.877,0,7.463-1.111,10.595-2.928   l0.19,0.334l469.417-271.015l-0.186-0.324C507.664,306.982,512,300.182,512,292.306z" fill="#000000"/></g>\
      </svg>';

  var imgPause = 
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="691.205px" viewBox="0 0 512 691.205" enable-background="new 0 0 512 691.205" xml:space="preserve">\
        <g>\
          <path d="M147.068,0c-1.112,0-2.186,0.186-3.253,0.332V0H24.907h-0.011C11.156,0,0.011,11.134,0.011,24.885c0,0.022,0,0.034,0,0.056   H0v641.29h0.011c0,0.033-0.011,0.067-0.011,0.101c0,13.74,11.145,24.874,24.885,24.874l0,0l0,0h122.172l0,0   c13.74,0,24.874-11.134,24.874-24.874c0-0.033-0.012-0.067-0.012-0.101h0.012V24.941l0,0c0-0.022,0.011-0.045,0.011-0.056   C171.941,11.134,160.797,0,147.068,0z" fill="#000000"/>\
          <path d="M511.988,666.23V24.941l0,0c0-0.022,0.012-0.045,0.012-0.056C512,11.134,500.855,0,487.126,0   c-1.112,0-2.179,0.186-3.258,0.332V0H364.96l0,0c-13.751,0-24.896,11.134-24.896,24.885c0,0.022,0,0.034,0,0.056l0,0v641.29l0,0   c0,0.033,0,0.067,0,0.101c0,13.74,11.146,24.874,24.874,24.874l0,0l0,0h122.155l0,0c13.74,0,24.873-11.134,24.873-24.874   C511.988,666.298,511.978,666.264,511.988,666.23L511.988,666.23z" fill="#000000"/>\
        </g>\
      </svg>';
  
  var imgVolume =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="427.769px" viewBox="0 0 512 427.769" enable-background="new 0 0 512 427.769" xml:space="preserve">\
        <g>\
          <path d="M429.673,15.447c-0.153-0.156-0.329-0.252-0.488-0.402l0.048-0.05l-11.576-11.57l-0.135,0.132   c-6.317-5.03-15.442-4.742-21.377,0.97l-0.024-0.023l-20.571,20.566l0.135,0.138c-4.647,5.914-4.63,14.229,0.059,20.125   l-0.129,0.132l1.305,1.302l0,0l0,0l10.266,10.277l0.188-0.188c0.146,0.159,0.253,0.344,0.405,0.5   c86.39,86.392,86.648,226.771,0.829,313.509l-0.112-0.117l-10.271,10.271l0,0l0,0l-1.305,1.305l0.135,0.129   c-5.029,6.322-4.736,15.454,0.958,21.377l-0.023,0.029l20.578,20.578l0.141-0.141c5.917,4.653,14.231,4.63,20.131-0.065l0.13,0.13   l1.299-1.293l0,0l0,0l10.271-10.271l-0.023-0.023C539.437,302.917,539.167,124.944,429.673,15.447z" fill="#000000"/>\
          <path d="M372.587,94.735c-0.158-0.158-0.335-0.253-0.493-0.405l0.047-0.047l-11.582-11.57l-0.129,0.133   c-6.322-5.033-15.454-4.736-21.389,0.96l-0.023-0.023l-0.212,0.212c0,0.006-0.012,0.012-0.018,0.012   c-0.006,0.006-0.012,0.012-0.012,0.018l-18.95,18.941c0,0.006-0.012,0.012-0.012,0.012c-0.012,0.006-0.012,0.012-0.012,0.018   l-1.357,1.354l0.135,0.138c-4.647,5.921-4.624,14.232,0.071,20.123l-0.13,0.132l11.564,11.576l0.188-0.186   c0.153,0.156,0.259,0.341,0.406,0.5c42.665,42.666,42.912,111.879,0.811,154.915l-0.082-0.088l-10.271,10.271c0,0,0,0-0.006,0   h-0.006l-1.299,1.293l0.135,0.135c-5.029,6.313-4.741,15.457,0.964,21.38l-0.023,0.023l20.578,20.578l0.135-0.136   c5.917,4.648,14.227,4.625,20.126-0.064l0.135,0.13l11.564-11.57l-0.023-0.023C438.628,267.35,438.369,160.518,372.587,94.735z" fill="#000000"/>\
          <path d="M272.554,56.254c-2.274,0-4.378,0.651-6.199,1.715l-0.111-0.19l-123.136,71.091v0.07l-46.57,26.892H9.399v0.241   c-0.074,0-0.144-0.023-0.224-0.023c-5.065,0-9.175,4.116-9.175,9.176v124.312c0,5.065,4.11,9.173,9.175,9.173   c0.08,0,0.144-0.023,0.224-0.029v0.247h87.138l69.34,40.03v-0.188l99.572,57.491c2.021,1.398,4.466,2.245,7.104,2.245   c6.881,0,12.463-5.583,12.463-12.457c0-0.488-0.094-0.935-0.146-1.405h0.146V67.31h-0.146   C284.171,61.104,278.952,56.254,272.554,56.254z" fill="#000000"/>\
        </g>\
      </svg>';

  var imgMute =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="440.545px" viewBox="0 0 512 440.545" enable-background="new 0 0 512 440.545" xml:space="preserve">\
        <g>\
          <path d="M318.681,131.408l-0.13,0.133l11.565,11.576l0.188-0.186c0.152,0.156,0.258,0.344,0.405,0.5   c26.415,26.42,36.535,63.008,30.447,97.262l47.342,47.35c26.387-61.793,14.463-136.176-35.889-186.518   c-0.158-0.156-0.335-0.252-0.493-0.402l0.053-0.051l-11.583-11.57l-0.136,0.127c-6.312-5.025-15.449-4.736-21.379,0.969   l-0.029-0.025l-0.206,0.211c-0.012,0.006-0.012,0.006-0.023,0.012c0,0.006-0.012,0.012-0.012,0.018l-18.946,18.943   c-0.012,0.006-0.012,0.012-0.023,0.012c0,0.01-0.012,0.016-0.012,0.021l-1.352,1.354l0.141,0.129   C313.967,117.207,313.99,125.518,318.681,131.408z" fill="#000000"/>\
          <path d="M429.72,22.229c-0.158-0.15-0.335-0.252-0.493-0.402l0.047-0.047l-11.577-11.574l-0.135,0.132   c-6.317-5.031-15.444-4.74-21.38,0.969l-0.023-0.023l-20.574,20.568l0.135,0.138c-4.648,5.915-4.631,14.233,0.06,20.131   l-0.13,0.125l1.305,1.299l0,0l0,0l10.272,10.279l0.183-0.189c0.146,0.16,0.252,0.344,0.405,0.5   c67.111,67.117,82.215,166.805,45.403,248.621l44.122,44.123C536.023,249.943,520.215,112.723,429.72,22.229z" fill="#000000"/>\
          <path d="M285.042,74.096h-0.146c-0.699-6.205-5.918-11.053-12.317-11.053c-2.274,0-4.379,0.648-6.2,1.715l-0.111-0.193   l-51.501,29.732l70.282,70.283V74.096H285.042z" fill="#000000"/>\
          <path d="M96.542,162.629H9.4v0.24c-0.074,0-0.144-0.018-0.224-0.018c-5.065,0-9.176,4.117-9.176,9.176v124.33   c0,5.066,4.111,9.172,9.176,9.172c0.08,0,0.144-0.025,0.224-0.025v0.248h87.148l69.348,40.031v-0.188l99.583,57.498   c2.021,1.398,4.461,2.244,7.105,2.244c6.875,0,12.464-5.582,12.464-12.459c0-0.482-0.088-0.928-0.146-1.398h0.146v-56.65   L106.876,156.658L96.542,162.629z" fill="#000000"/>\
          <path d="M471.544,393.514L82.521,4.49l-0.012,0.012c-0.035-0.035-0.059-0.079-0.098-0.12c-5.841-5.845-15.314-5.839-21.155,0   c-0.206,0.206-0.35,0.446-0.544,0.661L39.903,25.96c-0.024,0.023-0.047,0.035-0.071,0.059c-5.844,5.838-5.844,15.317,0,21.153   L428.88,436.225l0.012-0.012c5.841,5.795,15.268,5.771,21.097-0.047l0.029,0.023l20.651-20.756c0.3-0.246,0.617-0.459,0.904-0.74   c5.836-5.842,5.836-15.314,0-21.156C471.556,393.537,471.544,393.525,471.544,393.514z" fill="#000000"/>\
        </g>\
      </svg>';
  
  /* VARS / PROPERTIES INITIALIZATION ----------------------------------------------- */
  
  self.el.className = self.el.className + ' custom-yt-player';
  self.el.appendChild(self.videoEl);
  
  self.thumbnail.className = 'custom-yt-player-thumbnail';
  self.thumbnail.style.backgroundImage = 
      'url("http://img.youtube.com/vi/' + self.params.videoID + '/hqdefault.jpg")';
  self.el.appendChild(self.thumbnail);
  
  self.overlay.className = 'custom-yt-player-overlay';
  self.el.appendChild(self.overlay);

  self.controls.className = 'custom-yt-player-controls';
  self.controls.innerHTML =
      '<div class="custom-yt-player-controls-inner">\
        <div class="custom-yt-player-playstate">\
          <div class="custom-yt-player-playstate-btn custom-yt-player-btn">\
            <div class="custom-yt-player-play custom-yt-player-btn-img">'
              + imgPlay +
            '</div>\
            <div class="custom-yt-player-pause custom-yt-player-btn-img">'
              + imgPause +
            '</div>\
          </div>\
        </div>\
        <div class="custom-yt-player-time">\
          <div class="custom-yt-player-time-current"></div>\
          <div class="custom-yt-player-time-separator">/</div>\
          <div class="custom-yt-player-time-total"></div>\
        </div>\
        <div class="custom-yt-player-track-wrap">\
          <div class="custom-yt-player-track">\
            <div class="custom-yt-player-track-bg"></div>\
            <div class="custom-yt-player-track-indicator">\
              <div class="custom-yt-player-track-buller"></div>\
            </div>\
          </div>\
        </div>\
        <div class="custom-yt-player-volume-wrap">\
          <div class="custom-yt-player-volume-btn custom-yt-player-btn">\
            <div class="custom-yt-player-volume-img custom-yt-player-btn-img">' 
              + imgVolume + 
            '</div>\
            <div class="custom-yt-player-mute-img custom-yt-player-btn-img">'
              + imgMute +
            '</div>\
          </div>\
          <div class="custom-yt-player-volume-track-wrap">\
            <div class="custom-yt-player-volume-track">\
              <div class="custom-yt-player-volume-track-indicator">\
                <div class="custom-yt-player-volume-track-bullet"></div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>';
  self.el.appendChild(self.controls);
  
  /* EVENTS DECLARATION ------------------------------------------------------------- */
  
  customYTPlayer.prototype.ytAPIReady = document.createEvent('Event');
  customYTPlayer.prototype.ytAPIReady.initEvent('yt-api-ready', true, true);
  
  /* PRIVATE FUNCTIONS -------------------------------------------------------------- */
  
  function dispatchYTAPIReady() {
    self.log('Youtube API ready. Dispatching event for listeners.');
    self.el.dispatchEvent(self.ytAPIReady);
  }
  
  /* EVENT LISTENERS HOOKING -------------------------------------------------------- */
    
  // Overlay click event
  self.overlay.addEventListener('click', self.playToggle.bind(self));
  
  // Video play/pause button event
  self.controls.querySelector('.custom-yt-player-playstate-btn')
      .addEventListener('click', self.playToggle.bind(self));
  
  // Video seeking event
  self.controls.querySelector('.custom-yt-player-track')
      .addEventListener('mousedown', self.startSeek.bind(self));
  
  document.addEventListener('mouseup', self.stopSeek.bind(self));
  
  // Volume slider event
  self.controls.querySelector('.custom-yt-player-volume-track')
      .addEventListener('mousedown', self.startVolumeChange.bind(self));
  
  document.addEventListener('mouseup', self.stopVolumeChange.bind(self));
  
  // Mute toggle button event
  self.controls.querySelector('.custom-yt-player-volume-btn')
      .addEventListener('click', self.toggleMute.bind(self));
  
  // API ready
  self.el.addEventListener('yt-api-ready', function() {
    self.log('Captured API signaling being ready. Creating Youtube Player iframe.');
    
    self.el.style.width = params.width || '720px';
    self.el.style.height = params.height || '480px';
    
    self.player = new YT.Player(self.videoEl, {
      videoId     : params.videoID,
      events      : params.events,
      playerVars  : {
        fs              : params.args.allowFullscreen,
        hl              : params.args.language,
        loop            : params.args.loop,
        autoplay        : 1,
        autohide        : 1,
        controls        : 0,
        enablejsapi     : 1,
        iv_load_policy  : 3,
        modestbranding  : 1,
        rel             : 0,
        showinfo        : 0
      }
    });
    
    // Video player ready
    self.player.addEventListener('onReady', function(e) {
      self.log('Player is ready.');

      // Set the video playback quality
      
      e.target.setPlaybackQuality(params.quality || 'default');
      
      // Get the duration of the video
      
      var minutes = Math.floor(e.target.getDuration() / 60),
          seconds = Math.ceil(e.target.getDuration() % 60);
          
      self.controls.querySelector('.custom-yt-player-time-total').innerHTML =
          (minutes < 10 ? '0' + minutes : minutes)
          + ':' + 
          (seconds < 10 ? '0' + seconds : seconds);
      
      // Starts counting the playback time of the video and updating both the time
      // counter and the playback progress bar
      
      self.timerPlayback = setInterval(function(){
        if(self.isSeeking) return;
        
        var minutes = Math.floor(e.target.getCurrentTime() / 60),
            seconds = Math.ceil(e.target.getCurrentTime() % 60),
            progress = e.target.getCurrentTime() / e.target.getDuration() * 100;
            
        self.controls.querySelector('.custom-yt-player-time-current').innerHTML =
            (minutes < 10 ? '0' + minutes : minutes)
            + ':' + 
            (seconds < 10 ? '0' + seconds : seconds);
        
        self.controls.querySelector('.custom-yt-player-track-indicator')
            .style.width = progress + '%';
      }, 50);
      
      // Start getting the volume level to be displayed in the volume meter
      
      self.timerVolume = setInterval(function(){
        var indicator = 
            self.controls.querySelector('.custom-yt-player-volume-track-indicator');
        
        if(self.player.isMuted()) {
          indicator.style.height = '0%';
          return;
        }
        
        var vol = self.player.getVolume();
        
        indicator.style.height = vol + '%';
      }, 50);
      
      // Set the initial volume
      
      self.player.setVolume(params.volume || 100);
      
      // Mute it or not

      params.mute ? self.mute() : self.unMute();

      // If the autoplay argument is set, then return. Else, pauses the video playback
      
      if(params.args.autoplay) {
        self.log('Autoplaying.');
        return;
      }

      e.target.pauseVideo();      
    });
    
    // Changed video quality
    self.player.addEventListener('onPlaybackQualityChange', function(e) {
      self.log('Playback quality changed to ' + e.target.getPlaybackQuality());
    });

    // Video state changes (pause, play, ended, etc.)
    self.player.addEventListener('onStateChange', function(e) {
      self.log('Player state changed.');

      switch(self.player.getPlayerState()) {
        case -1:
          self.log('Video not initialized.');
          self.controls.classList.add('video-not-initialized');
          break;

        case 0:
          self.log('Video has ended.');
          self.controls.classList.add('video-ended');
          self.controls.classList.remove('video-playing');
          self.controls.classList.remove('video-paused');
          self.thumbnail.style.opacity = 1;
          break;

        case 1:
          self.log('Playing.');
          self.controls.classList.add('video-playing');
          self.controls.classList.remove('video-paused');
          self.controls.classList.remove('video-ended');
          self.controls.classList.remove('video-not-initialized');
          self.thumbnail.style.opacity = 0;
          break;

        case 2:
          self.log('Paused.');
          self.controls.classList.add('video-paused');
          self.controls.classList.remove('video-playing');
          self.controls.classList.remove('video-ended');
          self.thumbnail.style.opacity = 0;
          break;

        case 3:
          self.log('Buffered.');
          self.controls.classList.add('video-buffered');
          break;

        case 5:
          self.log('Cued.');
          self.controls.classList.add('video-cued');
          self.thumbnail.style.opacity = 0;
          break;
      }
    });
  });
  
  /* CHECK IF YT API IS READY ------------------------------------------------------- */
  
  if(window.YT === undefined) {
    self.log('Youtube API not ready. Queuing dispatch function...');
    customYTPlayer.prototype.dispatchQueue.push(dispatchYTAPIReady);
  } else {
    self.log('Youtube API already loaded');
    dispatchYTAPIReady();
  }
};

customYTPlayer.prototype.DEBUG_MODE = true;
customYTPlayer.prototype.dispatchQueue = [];

customYTPlayer.prototype.log = function (msg) {
  if(!customYTPlayer.prototype.DEBUG_MODE) return;
  console.log('Custom YT Player >> ' + this.selector + ' : ' + msg);
}

customYTPlayer.prototype.playToggle = function (e) {
  if(this.player.getPlayerState() !== 1) {
    this.player.playVideo();
  } else {
    this.player.pauseVideo();
  }
}

customYTPlayer.prototype.startSeek = function (e) {
  this.log('Started seeking.');
  
  this.isSeeking = true;
  this.seekEl = this.controls.querySelector('.custom-yt-player-track');
  this.bindSeek = this.seek.bind(this);
  this.bindSeek(e);
  this.seekEl.addEventListener('mousemove', this.bindSeek);
}

customYTPlayer.prototype.stopSeek = function (e) {
  if(!this.isSeeking) return;
  
  var layerX = e.clientX - this.seekEl.getBoundingClientRect().left,
      seconds = (layerX / this.seekEl.clientWidth) * this.player.getDuration();
  
  this.player.seekTo(seconds, true);
  
  this.isSeeking = false;
  
  this.seekEl.removeEventListener('mousemove', this.bindSeek);
  this.log('Stopped seeking.');
}

customYTPlayer.prototype.seek = function(e) {
  var layerX = e.clientX - this.seekEl.getBoundingClientRect().left,
      seconds = (layerX / this.seekEl.clientWidth) * this.player.getDuration(),
      progress = (seconds / this.player.getDuration()) * 100,
      minutes = Math.floor(seconds / 60),
      seconds = Math.round(seconds % 60);
  
  this.player.seekTo(seconds, false);
  this.controls.querySelector('.custom-yt-player-track-indicator')
      .style.width = progress + '%';
  
  this.log('Seeking to ' + 
      (minutes < 10 ? '0' + minutes : minutes) 
      + ':' + 
      (seconds < 10 ? '0' + seconds : seconds) + ' seconds');
}

customYTPlayer.prototype.unMute = function(e) {
  this.player.unMute();
  this.controls.classList.add('unmuted');
  this.controls.classList.remove('muted');
}

customYTPlayer.prototype.mute = function (e) {
  this.player.mute();
  this.controls.classList.add('muted');
  this.controls.classList.remove('unmuted');
}

customYTPlayer.prototype.toggleMute = function(e) {
  this.player.isMuted() ? this.unMute() : this.mute();
}

customYTPlayer.prototype.startVolumeChange = function(e) {
  this.log('Started changing volume level.');
  
  this.isChangingVolume = true;
  
  this.volumeChangeEl = this.controls.querySelector('.custom-yt-player-volume-track');
  
  this.bindVolumeChange = this.volumeChange.bind(this);
  this.bindVolumeChange(e);
  this.volumeChangeEl.addEventListener('mousemove', this.bindVolumeChange);
}

customYTPlayer.prototype.stopVolumeChange = function(e) {
  if(!this.isChangingVolume) return;
  
  var layerY = e.clientY - this.volumeChangeEl.getBoundingClientRect().top,
      volume = 100 - (layerY / this.volumeChangeEl.clientHeight) * 100;
  
  this.player.setVolume(volume);
  
  this.isChangingVolume = false;
  
  this.volumeChangeEl.removeEventListener('mousemove', this.bindVolumeChange);
  this.log('Stopped changing volume level.');
}

customYTPlayer.prototype.volumeChange = function(e) {
  if(window.YT === undefined) return;
  
  var layerY = e.clientY - this.volumeChangeEl.getBoundingClientRect().top,
      volume = 100 - (layerY / this.volumeChangeEl.clientHeight) * 100;
  
  this.player.setVolume(volume);
  
  this.controls.querySelector('.custom-yt-player-volume-track-indicator')
      .style.height = volume + '%';
  
  this.log('Volume set to ' + volume + '%');
};

// Loads the Youtube API

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var ytAPIScript = document.createElement('script');
    ytAPIScript.src = "https://www.youtube.com/iframe_api";

    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(ytAPIScript, firstScript);
  });
  
  window.onYouTubeIframeAPIReady = function() {
    for(var i = 0; i < customYTPlayer.prototype.dispatchQueue.length; i++) {
      customYTPlayer.prototype.dispatchQueue[i].call();
      customYTPlayer.prototype.dispatchQueue[i] = null;
    }
  };
})();