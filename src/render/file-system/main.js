
import tippy from 'tippy.js'
import fs from 'fs-extra'

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
async function changeDirectory(inputDir, container = fsCont) {
    fs.readdir(inputDir, (error, files) => {
        if (error) {
            $err.spawn(`Such directory like '${inputDir}' does not exist`)
        }

        else {
            // generateTree(container, files, inputDir)
            let dir = new Directory(
                path.join(inputDir, '../'), 
                OpenedAPI.extract(inputDir).name, 
                true
            )
            container.appendChild(dir.getElement())
            
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
    constructor(thepath, name, isExpanded = false) {
        super(document.createElement('div'), thepath, name)

        this.tree = isExpanded

        // Setup full path
        this.fullpath = path.join(thepath, name)

        // Element
        // this.element = document.createElement('div')
        this.element.className = 'item'

        this.element.setAttribute('path', thepath)
        this.element.setAttribute('dir-name', name)
        this.element.setAttribute('fullpath', this.fullpath)

        this.element.innerHTML = `
            <span class="dir"> ${name} </span>
            <div class="files">  </div>
        `
        this.element.addEventListener('click', this.click.bind(this), false)

        // Move file to the dir
        this.element.addEventListener('click', e => {
            if (FS_MOVE.val) {
                console.log(FS_MOVE.val)
                let src = path.join(FS_MOVE.val.path, FS_MOVE.val.name)
                let dest = path.join(this.fullpath, FS_MOVE.val.name)
                fs.move(src, dest, err => {
                    if (err) throw err
                    FS_MOVE.val = null
                    fsMove.off()
                    updateTree()
                })
            }
            
        })


        // Expend by default if needed
        if (isExpanded) {
            let insides = fs.readdirSync(this.fullpath)
            this.element.children[0].classList.toggle('expanded')
            generateTree(this.element.children[1], insides, this.fullpath)
        }
    }
    

    click(event) {
        if (FS_MOVE.val) return

        // Prevent from children capturing event
        if (![this.element, this.element.children[0]].includes(event.target)) return false

        this.tree = !this.tree
        this.element.children[0].classList.toggle('expanded')
                
        // Expand
        if (this.tree) {
            let insides = fs.readdirSync(this.fullpath)
            generateTree(this.element.children[1], insides, this.fullpath)
        }

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
    constructor(thepath, name) {
        super(document.createElement('div'), thepath, name)
        
        // Setup full path
        this.fullpath = path.join(thepath, name)
        this.name = name

        // Element
        // this.element = document.createElement('div')
        this.element.className = 'item'

        this.element.setAttribute('path', thepath)
        this.element.setAttribute('name', this.name)
        this.element.setAttribute('fullpath', this.fullpath)
        
        let format = new RegExp('\\.(.*)').exec(this.name)
        this.extension = (format) ? format[1].toLowerCase() : ""
        this.element.setAttribute('extension', this.extension)
        
        
        let ext = document.createElement('span')
        ext.className = 'icon'
        this.element.appendChild(ext)
        
        // Add icon if exists
        if (ICONS.val.includes(`${this.extension}-icon.svg`)) {
            ext.style.backgroundImage = `url('../../art/icons/${this.extension}-icon.svg')`
        }   
        
        this.element.innerHTML += `
            <span class="file ${this.extension}" file-name="${this.name}"> ${this.name} </span>
        `
        this.element.addEventListener('click', this.click.bind(this), false)
    }

    click(event) {
        OPENED.val = this.element

        const backup = OpenedAPI.extract(this.fullpath)
        storage.set('OPENED', backup)
        $('.inputarea').focus()
    }

    getElement() {
        return this.element
    }
}

// Get / Set attributes in OPENED Global file
// 'filepath'
// 'path'
// 'name'
// 'extension'
class OpenedAPI {
    constructor() {}
   
    static get(attr, element = null) {
        element = (element == null) ? OPENED.val : element
        
        if (attr === 'fullpath') {
            return (element.isVirtual) 
            ? element.fullpath
            : element.getAttribute('fullpath')
        }

        else if (attr === 'name') {
            return (element.isVirtual)
            ? element.name
            : element.getAttribute('name')
        }

        else if (attr === 'path') {
            return (element.isVirtual)
            ? element.path
            : element.getAttribute('path')
        }

        else if (attr === 'extension') {
            return (element.isVirtual)
            ? element.extension
            : element.getAttribute('extension')
        }

        else throw `Attr named ${attr} does not exist`
    }
    
    static extract(fullpath) {
        let name = path.basename(fullpath)
        let ext = path.extname(fullpath)
        let extension = ext.slice(1)
        return {
            fullpath,
            extension,
            name,
            isVirtual: true
        }
    }
}