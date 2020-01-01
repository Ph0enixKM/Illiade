import fs from 'fs'

class View {

    constructor() {
        this.ui = {
            text: $('#editor'),
            image: $('#image'),
            welcome: $('#welcome')
        }

        this.imageExtensions = ['png', 'jpg', 'svg']
        this.current = 'welcome'
    }

    _switchTo(element) {
        for (const element of Object.values(this.ui)) {
            element.style.visibility = 'hidden'
            element.style.opacity = '0'
        }
        this.ui[element].style.visibility = 'visible'
        this.ui[element].style.opacity = '1'

        if (this.current === 'welcome') this.welcomeDestruct()
        if (this.current === 'image') this.imageDestruct()
        if (this.current === 'text') this.textDestruct()

        this.current = element
    }

    open(extension, fullpath) {
        if (extension == null) {
            this._switchTo('welcome')
            this.welcomeConstruct()
            return
        }

        // If it's an image
        if (this.imageExtensions.includes(extension)) {
            this._switchTo('image')
            this.imageConstruct(fullpath)
            return
        }

        // If it's a text
        else {
            this._switchTo('text')
            this.textConstruct(extension, fullpath)
            return
        }
    }

    // --- Text Editor ---

    textConstruct(extension, path) {
        let file = fs.readFileSync(path, 'utf-8')
        window.editor.setValue(file)
    }

    textDestruct() {
        window.editor.setValue('')
    }

    
    // --- Image Editor ---
    
    imageConstruct(path) {
        let img = $('#image #image-container')
        img.style.backgroundImage = `url('file://${path}')`
    }
    
    imageDestruct() {
        let img = $('#image #image-container')
        img.style.backgroundImage = 'none'
    }
    
    // --- Welcome Splash Screen ---
    welcomeConstruct() {}
    welcomeDestruct() {}
    
}

window.view = new View()