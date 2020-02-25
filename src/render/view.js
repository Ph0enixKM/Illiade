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
            return this.textConstruct(extension, fullpath)
        }
    }

    // --- Text Editor ---

    textConstruct(extension, path) {
        
        
        let language = 'plaintext'
        
        if (['cpp', 'c', 'h', 'hpp'].includes(extension)) {
            language = '$cpp'
        }
        
        else if (['js', 'mjs', 'jsx'].includes(extension)) {
            language = '$js'
        }
        
        else if (['ts', 'tsx'].includes(extension)) {
            language = '$ts'
        }
        
        else if (['sass'].includes(extension)) {
            language = '$sass'
        }
        
        else if (['cs'].includes(extension)) {
            language = 'csharp'
        }
        
        else if (['json'].includes(extension)) {
            language = '$json'
        }
        
        else if (['shell', 'bash', 'sh'].includes(extension)) {
            language = 'shell'
        }   
        
        else if (['py', 'python', 'pyx'].includes(extension)) {
            language = 'python'
        }
        
        else if (['kt', 'kotlin'].includes(extension)) {
            language = 'kotlin'
        }
        
        else if (['html', 'ejs'].includes(extension)) {
            language = 'html'
        }
        
        
        else if (['css', 'less'].includes(extension)) {
            language = 'css'
        }
        
        else if (['pug', 'scss', 'java', 'coffee', 'less', 'kotlin', 'markdown', 'rust', 'sql', 'xml'].includes(extension)) {
            language = extension
        }
        
        return language
    }
    
    textDestruct() {}
    
    
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