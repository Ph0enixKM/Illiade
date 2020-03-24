import { remote } from 'electron'

class AudioController {
    constructor() {
        // Custom global ranges
        this.FOCUS_RANGE = [0.2, 0.4]
        this.BLUR_RANGE = [0.05, 0.1]

        // Get current window
        this.win = remote.getCurrentWindow()
        this.audio = $('audio')
        this.audio.volume = 0.3
        this.range = this.FOCUS_RANGE
        this.isFocused = true
        this.audioMaster = new Transition(0.2, 300)

        // Set event to update volume of audio
        this.audioMaster.update((value) => {
            this.audio.volume = value
        })
        
        this.win.on('focus', () => {
            this.isFocused = true
            if (AMBIENT_SOUND.val) {
                this.range = this.FOCUS_RANGE
                this.audioMaster.set(0.3)
            }
        })

        this.win.on('blur', () => {
            this.isFocused = false
            if (AMBIENT_SOUND.val) {
                this.range = this.BLUR_RANGE
                this.audioMaster.set(0.075)
            }
        })

        setInterval(() => {
            if (AMBIENT_SOUND.val) this.loop()
        }, 10000)
    }

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
