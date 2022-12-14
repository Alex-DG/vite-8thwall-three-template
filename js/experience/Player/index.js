import track1 from '../../../assets/audio/Sharp Edges - half.cool.mp3'
import track2 from '../../../assets/audio/Make You Move - Ofshane.mp3'
import track3 from '../../../assets/audio/Indecision - Dyalla.mp3'
import track4 from '../../../assets/audio/Gemini - half.cool.mp3'
import track5 from '../../../assets/audio/India Fuse - French Fuse.mp3'
import track6 from '../../../assets/audio/Curtain Call - Pandrezz.mp4'
import track7 from '../../../assets/audio/How is It Supposed to Feel (Clean) - NEFFEX.mp3'
import track8 from '../../../assets/audio/This Close - half.cool.mp3'
import track9 from '../../../assets/audio/Pans Labyrinth - josh pan.mp3'

// List of tracks available from our playlist
const sources = [
  track1,
  track2,
  track3,
  track4,
  track5,
  track6,
  track7,
  track8,
  track9,
]

// Cache references to DOM elements.
const elms = [
  'track',
  'timer',
  'duration',
  'playBtn',
  'pauseBtn',
  'prevBtn',
  'nextBtn',
  'playlistBtn',
  'volumeBtn',
  'progress',
  'progressBar',
  'loading',
  'playlist',
  'list',
  'volume',
  'barEmpty',
  'barFull',
  'sliderBtn',
  'toggleAudioPlayer',
  'audioPlayer',
]

elms.forEach(function (elm) {
  window[elm] = document.getElementById(elm)
})

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */
const Player = function (playlist) {
  this.playlist = playlist
  this.index = 0

  // Display the title of the first track.
  track.innerHTML = '1. ' + playlist[0].title

  // Setup the playlist display.
  playlist.forEach((song, index) => {
    var div = document.createElement('div')
    div.className = 'list-song'
    div.innerHTML = `${index + 1}. ${song.title}`
    div.onclick = function () {
      player.skipTo(playlist.indexOf(song))
    }
    list.appendChild(div)
  })
}

Player.prototype = {
  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function (index) {
    var self = this
    var sound

    index = typeof index === 'number' ? index : self.index
    var data = self.playlist[index]

    const trackSrc = sources[index]

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl
    } else {
      sound = data.howl = new Howl({
        src: [trackSrc],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: () => {
          // Display the duration.
          duration.innerHTML = self.formatTime(Math.round(sound.duration()))

          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self))

          // Start the wave animation if we have already loaded
          pauseBtn.style.display = 'block'
        },
        onload: () => {
          // Start the wave animation.
          loading.style.display = 'none'
        },
        onend: () => {
          // Stop the wave animation.
          self.skip('next')
        },
        onpause: () => {},
        onstop: () => {},
        onseek: () => {
          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self))
        },
      })
    }

    // Begin playing the sound.
    sound.play()

    // Update the track display.
    track.innerHTML = index + 1 + '. ' + data.title

    // Show the pause button.
    if (sound.state() === 'loaded') {
      playBtn.style.display = 'none'
      pauseBtn.style.display = 'block'
    } else {
      loading.style.display = 'block'
      playBtn.style.display = 'none'
      pauseBtn.style.display = 'none'
    }

    // Keep track of the index we are currently playing.
    self.index = index
  },

  /**
   * Pause the currently playing track.
   */
  pause: function () {
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Puase the sound.
    sound.pause()

    // Show the play button.
    playBtn.style.display = 'block'
    pauseBtn.style.display = 'none'
  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function (direction) {
    var self = this

    // Get the next track based on the direction of the track.
    var index = 0
    if (direction === 'prev') {
      index = self.index - 1
      if (index < 0) {
        index = self.playlist.length - 1
      }
    } else {
      index = self.index + 1
      if (index >= self.playlist.length) {
        index = 0
      }
    }

    self.skipTo(index)
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function (index) {
    var self = this

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop()
    }

    // Reset progress.
    progressBar.style.width = '0%'

    // Play the new track.
    self.play(index)
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function (per) {
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per)
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function () {
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Determine our current seek position.
    var seek = sound.seek() || 0
    timer.innerHTML = self.formatTime(Math.round(seek))
    progressBar.style.width = ((seek / sound.duration()) * 100 || 0) + '%'

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self))
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function () {
    var self = this
    var display = playlist.style.display === 'block' ? 'none' : 'block'

    setTimeout(
      function () {
        playlist.style.display = display
      },
      display === 'block' ? 0 : 500
    )
    playlist.className = display === 'block' ? 'fadein' : 'fadeout'
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function (secs) {
    var minutes = Math.floor(secs / 60) || 0
    var seconds = secs - minutes * 60 || 0

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  },
}

/**
 * Setup our new audio player class and pass it the playlist.
 */
const player = new Player([
  {
    title: 'Sharp Edges',
    file: 'Sharp Edges - half.cool',
    howl: null,
  },
  {
    title: 'Make You Move',
    file: 'Make You Move - Ofshane',
    howl: null,
  },
  {
    title: 'Gemini',
    file: 'Gemini - half.cool.mp3',
    howl: null,
  },
  {
    title: 'Indecision',
    file: 'Indecision - Dyalla',
    howl: null,
  },
  {
    title: 'India Fuse',
    file: 'India Fuse - French Fuse.mp3',
    howl: null,
  },
  {
    title: 'Curtain Call',
    file: 'Curtain Call - Pandrezz.mp4',
    howl: null,
  },
  {
    title: 'How is It Supposed to Feel',
    file: 'How is It Supposed to Feel (Clean) - NEFFEX.mp3',
    howl: null,
  },
  {
    title: 'This Close',
    file: 'This Close - half.cool.mp3',
    howl: null,
  },
  {
    title: 'Pans Labyrinth',
    file: 'Pans Labyrinth - josh pan.mp3',
    howl: null,
  },
])

// Bind our player controls.
playBtn.addEventListener('click', () => {
  player.play()
})
pauseBtn.addEventListener('click', () => {
  player.pause()
})
prevBtn.addEventListener('click', () => {
  player.skip('prev')
})
nextBtn.addEventListener('click', () => {
  player.skip('next')
})
progress.addEventListener(
  'touchend',
  (e) => {
    player.seek(e.changedTouches[0].clientX / progress.clientWidth)
  },
  false
)
playlistBtn.addEventListener('click', () => {
  player.togglePlaylist()
})
playlist.addEventListener('click', () => {
  player.togglePlaylist()
})

toggleAudioPlayer.addEventListener('click', () => {
  const isVisible =
    audioPlayer.style.opacity == '1' || audioPlayer.style.opacity == ''
  console.log({ opacity: audioPlayer.style.opacity })
  if (isVisible) {
    audioPlayer.style.opacity = '0'
    toggleAudioPlayer.style.background = 'transparent'
  } else {
    audioPlayer.style.opacity = '1'
    toggleAudioPlayer.style.background = 'rgb(255, 255, 255)'
  }
})
