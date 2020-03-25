import { remote } from 'electron'

// Audio controller which
// is responsible for ambient
// audio that is played when
// dna option ambient-sound
// is set to true.
class AudioController {
    // Init the audio master
    // controller and play it.
    constructor() {
        // Custom global ranges.
        this.FOCUS_RANGE = [0.2, 0.4]
        this.BLUR_RANGE = [0.05, 0.1]

        // Setup all global attributes.
        this.win = remote.getCurrentWindow()
        this.audio = $('audio')
        this.audio.volume = 0
        this.range = this.FOCUS_RANGE
        this.isFocused = true
        this.audioMaster = new Transition(0, 300)
        this.audio.play()

        // Set event to update volume of audio.
        this.audioMaster.update((value) => {
            this.audio.volume = value
        })
        
        // Increase the sound when
        // window is focused.
        this.win.on('focus', () => {
            this.isFocused = true
            if (AMBIENT_SOUND.val) {
                this.range = this.FOCUS_RANGE
                this.audioMaster.set(0.3)
            }
        })

        // Decreate the sound when
        // window is blured.
        this.win.on('blur', () => {
            this.isFocused = false
            if (AMBIENT_SOUND.val) {
                this.range = this.BLUR_RANGE
                this.audioMaster.set(0.075)
            }
        })

        // Change sound level
        // every 10 seconds so that
        // the ambient feels alive.
        setInterval(() => {
            if (AMBIENT_SOUND.val) this.loop()
        }, 10000)
    }

    // Changes sound level
    // to be a little bit
    // louder of to be a
    // little bit quieter.
    loop() {
        if(!this.isFocused) return
        let choice = Math.round(Math.random())
        let level = this.audioMaster.get()

        if (level >= this.range[1]) choice = false
        if (level <= this.range[0]) choice = true
        
        // Turn volume up
        if (choice) {
            this.audioMaster.set(level + 0.025)
        }

        // Turn volume down
        else {
            this.audioMaster.set(level - 0.025)
        }
    }
}

window.audioController = new AudioController()
