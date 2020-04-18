class Menu{
    
    constructor() {
        this.element = $('#menu')

        this.ui = {
            title: $('#menu #title'),
            subtitle: $('#menu #subtitle'),
            input: $('#menu #input'),
            container: $('#menu #container'),
            options: [...document.querySelectorAll('#menu #option')]
        }

        this.busy = false
        this.ready = true
        this.tries = 0
        this.maxTries = 15
        this.tryInterval = 200
        this.hints = ['']
        this.index = 0
        this.fsScope = false

        this.hooks = {
            off : [],
            on : []
        }

        this.title = ''
        this.subtitle = ''
        this.input = ''
        this.placeholder = ''

        this.closeEvent = new Variable(false)

        this.element.addEventListener('click', e => {
            if(e.target == this.element) {
                menu.off('ABORT')
            }
        })

        this.ui.input.addEventListener('keyup', async e => {
            let change = false
            let value = 20
            let normal = +1

            if(e.key === 'ArrowDown') {
                change = true
                if (this.index === this.hints.length - 1) return false
                normal = -1
                this.index++
            }
            else if(e.key === 'ArrowUp') {
                change = true
                if (this.index === 0) return false
                normal = +1
                this.index--
            }

            if (change) {
                let index = this.index
                this.ui.options[0].innerHTML = (this.hints[index - 2] == null) ? '' : this.hints[index - 2]
                this.ui.options[1].innerHTML = (this.hints[index - 1] == null) ? '' : this.hints[index - 1]

                this.ui.input.value = this.hints[index]

                this.ui.options[2].innerHTML = (this.hints[index + 1] == null) ? '' : this.hints[index + 1]
                this.ui.options[3].innerHTML = (this.hints[index + 2] == null) ? '' : this.hints[index + 2]
            }
        })
    }

    // supply array of hints
    uploadHints(given) {
        for (const item of given) {
            this.hints.push(item)
        }
    }

    _sleep() {
        return new Promise(res => {
            setTimeout(() => {
                return res(true)
            }, this.tryInterval)
        })
    }

    async on(options) {
        if (this.busy) return null

        this.fsScope = FS_SCOPE.val
        FS_SCOPE.quiet = false
        this.value = null

        // Set values
        if (options) {
            if (options.title != null) this.title = options.title
            if (options.subtitle != null) this.subtitle = options.subtitle
            if (options.input != null) this.input = options.input
            if (options.placeholder != null) this.placeholder = options.placeholder 
        }

        // Wait for animation to end
        while(!this.ready) {
            if (this.tries >= this.maxTries) return null
            await this._sleep()
            this.tries++
        }

        this.ui.title.innerHTML = this.title
        this.ui.subtitle.innerHTML = this.subtitle
        this.ui.input.value = this.input
        this.ui.input.placeholder = this.placeholder
        
        this.element.classList.add('on')

        if (options.wide === true) {
            this.element.style.textAlign = 'center'
            for (const option of this.ui.options) {
                option.style.width = 'calc(80vw - 200px)'
            }
            this.ui.input.style.width = 'calc(80vw - 200px)'
        }
        
        this.ready = true
        this.tries = 0
        this.busy = true
        
        setTimeout(() => {
            // Set Options if existing
            this.ui.options[2].innerHTML = (this.hints[1] == null) ? '' : this.hints[1]
            this.ui.options[3].innerHTML = (this.hints[2] == null) ? '' : this.hints[2]
            setTimeout(() => {
                this.ui.input.focus()
                // Run all the hooks
                for (const fun of this.hooks.on) {
                    fun()
                }
            }, 300)
        }, 10)
    }

    // Off event hook
    turnedOff(callback) {
        this.hooks.off.push(callback)
    }

    // On event hook
    turnedOn(callback) {
        this.hooks.on.push(callback)
    }

    async get() {
        return new Promise(res => {
            this.ui.input.addEventListener('keydown', function _ (e) {
                if (e.key === 'Enter') {
                    menu.off('DONE')
                    menu.ui.input.removeEventListener('keydown',_ , false)
                    this.value = menu.ui.input.value
                    return res(menu.ui.input.value)
                }
            }, false)

            this.closeEvent.triggerOnce(() => {
                return res(null)
            })
        })
    }

    async off(code) {
        FS_SCOPE.quiet = this.fsScope
        // Wait for animation to end
        while(!this.ready) {
            if (this.tries >= this.maxTries) return null
            await this._sleep()
            this.tries++
        }

        if (code === 'ABORT') {
            this.closeEvent.tick(true)
        }
        else if (code === 'DONE') {
            // Nothing yet
        }
        else throw 'BAD CODE'

        this.element.classList.remove('on')
        this.index = 0

        for (const option of this.ui.options) {
            option.innerHTML = ''
        }
        
        setTimeout(() => {
            this.ready = true
            this.tries = 0
            this.busy = false

            this.title = ''
            this.subtitle = ''
            this.input = ''
            this.placeholder = ''
            this.hints = ['']

            // Remove wide attributes 
            this.element.style.textAlign = 'left'
            for (const option of this.ui.options) {
                option.style.width = '250px'
            }
            this.ui.input.style.width = 'auto'

            if (!FS_SCOPE.val) {
                $('.inputarea').focus()
            }
            // Run all the hooks
            for (const fun of this.hooks.off) {
                fun(this.value)
            }
        }, 300)
    }
}

window.menu = new Menu()
new Shortcut('Escape', e => {
    if (menu.busy) {
        menu.off('ABORT')
        e.stopPropagation()
    }
})