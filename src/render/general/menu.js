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
            }, 300)
        }, 10)
    }

    async get() {
        return new Promise(res => {
            this.ui.input.addEventListener('keydown', function _ (e) {
                if (e.key === 'Enter') {
                    menu.off('DONE')
                    menu.ui.input.removeEventListener('keydown',_ , false)
                    return res(menu.ui.input.value)
                }
            }, false)

            this.closeEvent.triggerOnce(() => {
                return res(null)
            })
        })
    }

    async off(code) {
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


            $('.inputarea').focus()
        }, 300)
    }
}

window.menu = new Menu()

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        menu.off('ABORT')
    }
    e.stopPropagation()
})