class Menu{
    
    constructor() {
        this.element = $('#menu')

        this.ui = {
            title: $('#menu #title'),
            subtitle: $('#menu #subtitle'),
            input: $('#menu #input'),
            container: $('#container')
        }

        this.busy = false
        this.ready = true
        this.tries = 0
        this.maxTries = 15
        this.tryInterval = 200

        this.title = ''
        this.subtitle = ''
        this.input = ''
        this.placeholder = ''
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
        
        this.element.style.visibility = 'visible'
        this.element.style.backdropFilter = 'blur(0px)'
        this.ui.container.style.transitionTimingFunction = 'cubic-bezier(0, .97, .51, .99)'
        this.ui.container.style.transitionDuration = '1000ms'

        
        setTimeout(() => {
            this.element.style.backdropFilter = 'blur(10px)'
            this.ui.container.style.top = '50vh'
            this.ui.container.style.opacity = '1'
            this.ready = true
            this.tries = 0
            this.busy = true
            this.ui.input.focus()
        }, 300)
    }

    async get() {
        return new Promise(res => {
            this.ui.input.addEventListener('keydown', function _ (e) {
                if (e.key === 'Enter') {
                    menu.ui.input.removeEventListener('keydown',_ , false)
                    menu.off()
                    return res(menu.ui.input.value)
                }
            }, false)
        })
    }

    async off() {
        // Wait for animation to end
        while(!this.ready) {
            if (this.tries >= this.maxTries) return null
            await this._sleep()
            this.tries++
        }

        this.element.style.backdropFilter = 'blur(0px)'
        this.ui.container.style.top = '-50vh'
        this.ui.container.style.transitionTimingFunction = 'cubic-bezier(.84, 0, 0.96, .42)'
        this.ui.container.style.opacity = '0'
        this.ui.container.style.transitionDuration = '300ms'
        
        setTimeout(() => {
            this.element.style.visibility = 'hidden'
            this.ready = true
            this.tries = 0
            this.busy = false

            this.title = ''
            this.subtitle = ''
            this.input = ''
            this.placeholder = ''
            $('.inputarea').focus()
        }, 300)
    }
}

window.menu = new Menu()

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        menu.off()
    }
})