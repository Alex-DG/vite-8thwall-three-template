import { Howl, Howler } from 'howler'

import audioSrc from '../../assets/audio/Sharp Edges - half.cool.mp3'

class _Analyser {
  init() {
    console.log('YO!')
    // this.audio = new Audio(audioSrc)
    // this.audio.sound

    try {
      // Setup the new Howl.
      const sound = new Howl({
        src: [audioSrc],
        format: ['dolby', 'webm', 'mp3'],
        onplayerror: function () {
          // sound.once('unlock', function() {
          //   sound.play();
          // });
          console.log('error!')
        },
      })

      // Play the sound.
      sound.play()

      // Change global volume.
      Howler.volume(0.5)
    } catch (error) {
      console.log('error', { error })
    }
  }
}

const Analyser = new _Analyser()
export default Analyser
