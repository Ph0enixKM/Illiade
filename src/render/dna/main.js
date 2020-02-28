import fs from 'fs-extra'

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
                    if (AMBIENT_SOUND.val) {
                        audioController.audio.volume = 
                            audioController.level * 0.0005
                    }

                    else {
                        audioController.audio.volume = 0
                    }
                }
            },

            'Quick Commands',

            {
                id: 'cmd-1',
                name: '(ALT + 1)',
                type: 'text',
                placeholder: 'compile src.code -o here.out',
                attach: 'COMMAND1',
                trigger(val) {
                    COMMAND1.val = val
                },
                update() {}
            },
            {
                id: 'cmd-2',
                name: '(ALT + 2)',
                type: 'text',
                placeholder: 'package-manager run build',
                attach: 'COMMAND2',
                trigger(val) {
                    COMMAND2.val = val
                },
                update() {}
            },
            {
                id: 'cmd-3',
                name: '(ALT + 3)',
                type: 'text',
                placeholder: 'git pull origin master',
                attach: 'COMMAND3',
                trigger(val) {
                    COMMAND3.val = val
                },
                update() {}
            },
            
            'Project File',
            
            {
                id: 'save-project-config',
                name: 'Save config of this project to a file',
                type: 'switch',
                attach: 'SAVE_PROJECT_CONFIG',
                trigger() {
                    SAVE_PROJECT_CONFIG.val = !SAVE_PROJECT_CONFIG.val
                },
                update: updateProjectConfig
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

                else if (item.type === 'text') {
                    let setting = document.createElement('input')
                    setting.id = item.id
                    setting.className = 'text'
                    setting.placeholder = item.placeholder
                    setting.addEventListener('change', e => {
                        // console.log(e.target.value)
                        item.trigger(e.target.value)
                    })
                    control.appendChild(setting)
                    
                    window[item.attach].trigger(value => {
                        setting.value = value
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




























