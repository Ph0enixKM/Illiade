import fs from 'fs-extra'
import tippy from 'tippy.js'

let fileSystem = $('#file-system')
let fsCont = $('#file-system #container')
let panel = $('#panel')
let changeDir = $('#panel #change-dir')
let title = $('header #title')

// Title tippy feature
const titleTip = tippy(title, {
    content: 'Illiade',
    boundary: 'viewport',
    placement: 'bottom',
    trigger: 'click',
    interactive: true,
    appendTo: document.body
})

// Main function to change current ROOT directory
async function changeDirectory(inputDir) {
    fs.readdir(inputDir, (error, files) => {
        if (error) {
            err.spawn(`Such directory like '${inputDir}' does not exist`)
        }

        else {
            generateTree(fsCont, files, inputDir)
            
            ROOT.val = inputDir
            ROOTS.unshift(inputDir)

            ROOTS.val = [...new Set(ROOTS.val)]

            let historyLength = 20
            if (ROOTS.val.length > historyLength) {
                ROOTS.val = ROOTS.val.slice(0, historyLength)
            }
            
            // Automate em
            storage.set('ROOT', ROOT.val)
            storage.set('ROOTS', ROOTS.val)

        }
    })    
}

// Directory Object Class
// - Contains HTML representation
class Directory extends FileCore {
    constructor(path, name, isExpanded = false) {
        super(document.createElement('div'), path, name)

        this.tree = isExpanded

        // Setup full path
        if (path.last() === '/')
            this.fullpath = path + name
        else
            this.fullpath = path + '/' + name

        // Element
        // this.element = document.createElement('div')
        this.element.className = 'item'        

        this.element.setAttribute('path', path)
        this.element.setAttribute('dir-name', name)
        this.element.setAttribute('fullpath', this.fullpath)

        this.element.innerHTML = `
            <span class="dir"> ${name} </span>
            <div class="files">  </div>
        `

        this.element.addEventListener('click', this.click.bind(this), false)

        // Expend by default if needed
        if (isExpanded) {
            let insides = fs.readdirSync(this.fullpath)
            this.element.children[0].classList.toggle('expanded')
            generateTree(this.element.children[1], insides, this.fullpath)
        }
    }
    

    click(event) {
        // Prevent from children capturing event
        if (![this.element, this.element.children[0]].includes(event.target)) return false

        this.tree = !this.tree
        this.element.children[0].classList.toggle('expanded')

        // Expand
        if (this.tree) {
            let insides = fs.readdirSync(this.fullpath)
            generateTree(this.element.children[1], insides, this.fullpath)
        }

        // Hide
        else {
            this.element.children[1].innerHTML = ''
        }
        
        // Add / Remove from expanded
        if (this.tree) TREE_MAP.push(this.fullpath)
        else TREE_MAP.val = TREE_MAP.val.filter(v => v != this.fullpath)
        
    }

    getElement() {
        return this.element
    }
}

// File Object Class
// - Contains HTML representation
class File extends FileCore {
    constructor(path, name) {
        super(document.createElement('div'), path, name)

        // Setup full path
        if (path.last() === '/')
            this.fullpath = path + name
        else
            this.fullpath = path + '/' + name

        // Element
        // this.element = document.createElement('div')
        this.element.className = 'item'

        this.element.setAttribute('path', path)
        this.element.setAttribute('name', name)
        this.element.setAttribute('fullpath', this.fullpath)
        
        let format = new RegExp('\\.(.*)').exec(name)
        this.extension = ''
        
        if (format != null) {
            let tempExt = format[1].toLowerCase()
            if (FORMATS.val.includes(tempExt)) {
                this.extension = tempExt
            }
        }
        
        this.element.setAttribute('extension', this.extension)
        this.element.innerHTML = `
            <span class="file ${this.extension}" file-name="${name}"> ${name} </span>
        `
        this.element.addEventListener('click', this.click.bind(this), false)
    }

    click(event) {
        OPENED.val = this.element

        let backup = {
            extension: this.extension,
            fullpath: this.fullpath,
            isVirtual: true
        }
        
        storage.set('OPENED', backup)
    }

    getElement() {
        return this.element
    }
    

}