class Tabs {
    constructor() {
        this.busy = false
        this.tabs = $('#tabs')
        this.cont = $('#tabs #container')
        this.items = $('#tabs #items')
        this.index = 0
        this.delta = 30
        
        // Hold
        window.addEventListener('keydown', e => {
            if (e.key === 'q' && e.altKey && !this.busy) {
                this.init()
            }
        })
        
        // Release
        window.addEventListener('keyup', e => {
            if (e.key === 'q') {
                this.enter()
            }
        })
        
        window.addEventListener('keydown', e => {
            if (e.key === 'Delete' && this.busy) {
                if (OPENED_LAST.val.length <= 1) return
                OPENED_LAST.val.splice(this.index, 1)
                this.items.children[this.index].remove()
                if (this.index > 0) this.index--
                this.beforeUpdate()
                this.update()
            }
        })
        
        // Move Left
        window.addEventListener('keydown', e => {
            if (e.key == 'ArrowRight' && this.busy) {
                if (this.index < OPENED_LAST.val.length - 1) {
                    this.beforeUpdate()
                    this.index++
                    this.update()
                }
            }
        })
        
        // Move Right
        window.addEventListener('keydown', e => {
            if (e.key == 'ArrowLeft' && this.busy) {
                if (this.index > 0) {
                    this.beforeUpdate()
                    this.index--
                    this.update()
                }
            }
        })
    }
    
    // Initialize the menu
    init () {
        this.tabs.style.visibility = 'visible'
        this.tabs.focus()
        this.busy = true
        
        for (const obj of OPENED_LAST.val) {
            const el = document.createElement('div')
            const title = document.createElement('div')
            const img = document.createElement('div')
            el.className = 'item'
            title.className = 'title'
            title.innerHTML = obj.name
            img.className = 'image'
            
            // Add icon if exists
            if (ICONS.val.includes(`${obj.extension}-icon.svg`)) {
                img.style.backgroundImage = `url('../../art/icons/${obj.extension}-icon.svg')`
            }
            
            
            el.appendChild(title)
            el.appendChild(img)
            this.items.appendChild(el)
        }
        this.items.style.transition = 'transform 300ms'
        this.items.children[0].style.transform = `scale(1.3)`
    }
    
    // Before updating the menu
    beforeUpdate() {
        this.items.children[this.index].style.transform = `scale(1)`
    }
    
    // Update the menu
    update() {
        this.items.style.transform = `translate(${-this.index * this.delta}vw, -50%) scale(1)`
        this.items.children[this.index].style.transform = `scale(1.3)`
    }
    
    // Enter the item
    enter() {
        this.tabs.style.visibility = 'hidden'
        this.busy = false
        this.items.innerHTML = ''

        OPENED.val = OPENED_LAST.val[this.index]

        this.index = 0
        this.items.style.transition = 'transform 0ms'
        this.items.style.transform = `translate(0, -50%)`
        $('.inputarea').focus()

    }
    
}

new Tabs()