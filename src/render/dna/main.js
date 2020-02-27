class DNA {
    constructor() {
        this.element = $('#dna')
        this.bg = $('#dna #dna-bg')
        this.cont = $('#dna #dna-bg .container')
        this.busy = false
        this.parseMenu()
    }

    on() {
        this.busy = true
        this.element.style.visibility = 'visible'
        setTimeout(() => {
            this.element.style.opacity = '1'
            this.bg.style.opacity = '1'
        }, 200)
    }

    off() {
        this.busy = false
        this.element.style.opacity = '0'
        this.bg.style.opacity = '0'
        setTimeout(() => {
            this.element.style.visibility = 'hidden'
        }, 200)
    }


    menu() {
        return [
            'Sound',

            {
                id: 'ambient-sound',
                name: 'Ambient Sound',
                type: 'switch',
                attach: 'AMBIENT_SOUND',
                trigger() {
                    AMBIENT_SOUND.val = !AMBIENT_SOUND.val
                },
                update() {
                    console.log(AMBIENT_SOUND.val, audioController.audio.volume)
                    if (AMBIENT_SOUND.val) {
                        audioController.audio.volume = 
                            audioController.level * 0.0005
                    }

                    else {
                        audioController.audio.volume = 0
                    }
                }
            }
        ]
    }

    parseMenu() {
        let obj = this.menu()
        for(const item of obj) {
            // If it's a title
            if (typeof item === 'string') {
                // Create a title
                let el = document.createElement('div')
                el.className = 'title'
                el.innerHTML = item
                this.cont.appendChild(el)
            }
            // If it's a setting
            else {
                const el = document.createElement('div')
                const name = document.createElement('div')
                const control = document.createElement('div')

                el.className = 'row'
                name.className = 'name'
                name.innerHTML = item.name
                control.className = 'setting'
                el.appendChild(name)
                el.appendChild(control)
                this.cont.appendChild(el)
                
                if (item.type === 'switch') {
                    let setting = document.createElement('div')
                    setting.id = item.id
                    setting.className = 'switch'
                    setting.addEventListener('click', item.trigger)
                    control.appendChild(setting)

                    window[item.attach].trigger(value => {
                        setting.classList.toggle('on', value)
                        storage.set(item.attach, value)
                    })

                    window[item.attach].trigger(item.update)
                    window[item.attach].tick(window[item.attach].val)
                    item.update()


                }
            }
        }
    }
}

window.dna = new DNA()


window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (menu.busy) return null
        dna.off()
    }
})




























