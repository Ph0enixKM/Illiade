class Tabs {
    constructor() {
        this.busy = false
        this.tabs = $('#tabs')
        this.cont = $('#tabs #container')
        this.items = $('#tabs #items')
        this.path = $('#tabs #path')
        this.index = 0
        this.delta = 15
        this.paths = []

        // Hold
        new Shortcut('CTRL W', e => {
            this.init()
        })
        
        // Release
        window.addEventListener('keyup', e => {
            const isCtrl = (process.platform === 'darwin') ? e.key === 'Meta' : e.ctrlKey
            if ((e.key === 'w' || isCtrl) && this.busy) {
                this.paths = []
                this.enter()
                updateChanges()
            }          
        })
        
        // Remove
        window.addEventListener('keydown', e => {
            if (e.key === 'Delete' && this.busy) {
                if (OPENED_LAST.val.length <= 1) return
                OPENED_LAST.val.splice(this.index, 1)
                this.paths.splice(this.index, 1)
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

        // Copy message
        this.path.addEventListener('click', e => {
            navigator.clipboard.writeText(this.paths[this.index]).then(() => {}, (error) => {
                err.spawn('Couldn\'t copy to clipboard: ' + error)
            })
        })
    }
    
    static indexOfOpened(fullpath = OpenedAPI.get('fullpath')) {
        for (let i = 0; i < OPENED_LAST.val.length; i++) {
            if (OPENED_LAST.val[i].fullpath == fullpath) {
               return i 
            }
        }
    }
    
    // Initialize the menu
    init () {
        $('.inputarea').blur()
        this.tabs.style.visibility = 'visible'
        this.tabs.focus()
        this.busy = true
        
        for (const obj of OPENED_LAST.val) {
            const el = document.createElement('div')
            const title = document.createElement('div')
            const img = document.createElement('div')
            const unsaved = document.createElement('div')
            
            el.className = 'item'
            title.className = 'title'
            title.innerHTML = obj.name
            img.className = 'image'
            unsaved.className = 'unsaved'
            
            if (obj.unsaved) {
                unsaved.classList.add('on')
            }
            
            // Add icon if exists
            if (ICONS.val.includes(`${obj.extension}-icon.svg`)) {
                img.style.backgroundImage = `url('../../art/icons/${obj.extension}-icon.svg')`
            }
            
            // Add path
            this.paths.push(obj.fullpath)
            
            el.appendChild(title)
            el.appendChild(img)
            el.appendChild(unsaved)
            this.items.appendChild(el)
        }
        this.items.style.transition = 'transform 300ms'
        this.items.children[0].style.transform = `scale(1.3)`
        this.path.innerHTML = this.renderPathHTML(this.paths[0])
    }
    
    // Before updating the menu
    beforeUpdate() {
        this.items.children[this.index].style.transform = `scale(1)`
    }
    
    // Update the menu
    update() {
        this.items.style.transform = `translate(${-this.index * this.delta}vw, -50%) scale(1)`
        this.items.children[this.index].style.transform = `scale(1.3)`
        this.path.innerHTML = this.renderPathHTML(this.paths[this.index])
    }

    renderPathHTML(loc) {
        const uno = path.basename(loc)
        const dos = path.basename(path.dirname(loc))
        const tres = path.basename(path.dirname(path.dirname(loc)))
        const cuatro = path.dirname(path.dirname(path.dirname(loc)))
        return `<div class="loc cuatro">${cuatro.replace(/[\\\/]/g, ' ')}</div>
                <div class="loc tres">${tres}</div>
                <div class="loc dos">${dos}</div>
                <div class="loc uno">${uno}</div>`
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

    removeFromTabs(path) {
        for (const [index, file] of OPENED_LAST.val.entries()) {
            if(path == file.fullpath) {
                OPENED_LAST.val.splice(index, 1)
                if (this.busy) {
                    this.items.children[this.index].remove()
                    if (this.index > 0) this.index--
                    this.beforeUpdate()
                    this.update()
                }
                return true
            }
        }
    }
    
}

let TabsManager = new Tabs()