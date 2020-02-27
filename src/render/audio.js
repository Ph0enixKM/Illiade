import { remote } from 'electron'

class AudioController {
    constructor() {
        // Get current window
        this.win = remote.getCurrentWindow()
        this.audio = $('audio')
        this.audio.volume = 0.2
        this.upLimit = 500
        this.level = 500
        this.isFocused = true

        this.win.on('focus', () => {
            this.isFocused = true
            if (AMBIENT_SOUND.val) this.audio.volume = this.level * 0.0005
        })

        this.win.on('blur', () => {
            this.isFocused = false
            if (AMBIENT_SOUND.val) this.audio.volume = 0
        })

        setInterval(() => {
            if (AMBIENT_SOUND.val) this.loop()
        }, 10000)
    }

    loop() {
        if(!this.isFocused) return
        let choice = Math.round(Math.random())

        if (this.level >= this.upLimit) choice = false
        if (this.level <= 100) choice = true
        
        // Turn volume up
        if (choice) {
            let seed = setInterval(() => {
                this.level += 1
                this.audio.volume = this.level * 0.0005

                if (this.level % 100 == 0) {
                    clearInterval(seed)
                    if (!AMBIENT_SOUND.val) this.audio.volume = 0
                    return
                }
            }, 10)
        }

        // Turn volume down
        else {
            let seed = setInterval(() => {
                this.level -= 1
                this.audio.volume = this.level * 0.0005

                if (this.level % 100 == 0) {
                    clearInterval(seed)
                    if (!AMBIENT_SOUND.val) this.audio.volume = 0
                    return
                }
            }, 10)
        }
    }
}

window.audioController = new AudioController()
