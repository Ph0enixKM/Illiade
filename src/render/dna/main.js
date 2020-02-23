class DNA {
    constructor() {
        this.element = $('#dna')
        this.cont = $('#dna #container')
        this.bg = $('#dna-bg')
        this.busy = false
    }

    on() {
        this.busy = true
        this.element.style.visibility = 'visible'
        setTimeout(() => {
            this.element.style.opacity = '1'
            this.bg.play()
            this.cont.style.opacity = '1'
        }, 200)
    }

    off() {
        this.busy = false
        this.element.style.opacity = '0'
        this.cont.style.opacity = '0'
        setTimeout(() => {
            this.bg.pause()
            this.bg.currentTime = 0
            this.element.style.visibility = 'hidden'
        }, 200)
    }

}

window.dna = new DNA()


window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (menu.busy) return null
        dna.off()
    }
})