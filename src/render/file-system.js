import fs from 'fs'

let fileSystem = $('#file-system')
let fsCont = $('#file-system #container')

let panel = $('#panel')
let changeDir = $('#panel #change-dir')

function viewResize () {
    let view = $('#view')
    let max = document.body.getBoundingClientRect()
    let fsWidth = fileSystem.getBoundingClientRect().width

    view.style.width = `calc(100vw - ${fsWidth}px)`
    window.editor.layout({width: max.width - fsWidth, height: max.height})
    updateResizer()
}

window.addEventListener('resize', viewResize)
new Resizer({
    element: fileSystem,
    resizer: $('#file-system #resizer'),
    x: true,
    y: false,
    on: viewResize
})

// Selecting files
OPENED.trigger((element, lastElement) => {
    if (element == null || element.isBackup) return
    
    // Deselect
    if (element === lastElement) {
        element.children[0].classList.remove('selected')
        OPENED.quiet = null
    }

    // Select
    else {
        element.children[0].classList.add('selected')
        if (lastElement != null && !lastElement.isBackup)
            lastElement.children[0].classList.remove('selected')
    }
})


// Opening Files
OPENED.trigger(element => {
    
    // Open Welcome
    if (element == null) {
        view.open(null, null)
        return
    }
    
    if (element.isBackup)
        return EDITOR_LOAD.trigger(_ => view.open(element.extension, element.fullpath)) 

    // Open File
    else {

        let extension = element.getAttribute('extension')
        let fullpath = element.getAttribute('fullpath')
        view.open(extension, fullpath)
    }

})

// Menu "Change Directory" (button click)
changeDir.addEventListener('click', async e => {
    menu.on({
        title: 'Change root directory',
        subtitle: 'You can only write absolute path.',
        placeholder: '/home/',
        wide: true
    })

    menu.uploadHints(ROOTS.val)
    let inputDir = await menu.get()
    
    if (inputDir === null) return false
    fsCont.innerHTML = ''
    changeDirectory(inputDir)
})

// Menu "Change Directory" (keyboard shortcut)
window.addEventListener('keydown', async e => {
    if (e.key.toLowerCase() == 'd' && e.altKey) {
        menu.on({
            title: 'Change root directory',
            subtitle: 'You can only write absolute path.',
            placeholder: '/home/',
            wide: true
        })
        
        menu.uploadHints(ROOTS.val)
        let inputDir = await menu.get()
        
        if (inputDir === null) return false
        fsCont.innerHTML = ''
        changeDirectory(inputDir)
    }
})

// Menu "Change Directory" (init load)
window.onload = () => {
    if (ROOT.val != null && ROOT.val.length !== 0)
        changeDirectory(ROOT.val)
    OPENED.tick(OPENED.val)
}

// Reshape Resizer to match height of tree
function updateResizer() {
    let resizer = $('#file-system #resizer')
    let minHeight = fileSystem.getBoundingClientRect().height
    let treeHeight = fsCont.getBoundingClientRect().height
    let panelHeight = panel.getBoundingClientRect().height
    let safe = 10
    resizer.style.height = `${treeHeight + panelHeight + safe}px`
    if (minHeight > treeHeight) {
        resizer.style.height = `${minHeight + safe}px`
    }
}

// This function generates file system tree
async function generateTree(container, files, directory) {
    let isDirs = []

    // Avoid this way stack overflow
    async function checkFileStats(directory, file) {
        return new Promise(res => {
            fs.stat(path.join(directory, file), (err, stats) => {
                if (err) return res(null)            
                return res(stats.isDirectory())
            })
        })
    }
    
    for (const file of files) {
        let boolValue = await checkFileStats(directory, file)
        isDirs.push(boolValue)
    }
    
    files.forEach((value, index) => {
        if (isDirs[index] === null) return

        if (isDirs[index]) {
            let dir = new Directory(directory, value)
            container.appendChild(dir.getElement())
        }

        else {
            let file = new File(directory, value)
            container.appendChild(file.getElement())
        }
    })

    updateResizer()
}

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
class Directory {
    constructor(path, name) {
        this.tree = false

        // Setup full path
        if (path.last() === '/')
            this.fullpath = path + name
        else
            this.fullpath = path + '/' + name

        // Element
        this.element = document.createElement('div')
        this.element.className = 'item'        

        this.element.setAttribute('path', path)
        this.element.setAttribute('dir-name', name)
        this.element.setAttribute('fullpath', this.fullpath)

        this.element.innerHTML = `
            <span class="dir"> ${name} </span>
            <div class="files">  </div>
        `

        this.element.addEventListener('click', this.click.bind(this), false)
    }
    

    click(event) {
        // Prevent from children captiring event
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
        console.log(`Is expanded tree? ${this.tree}`)
    }

    getElement() {
        return this.element
    }
}

// File Object Class
// - Contains HTML representation
class File {
    constructor(path, name) {
        // Setup full path
        if (path.last() === '/')
            this.fullpath = path + name
        else
            this.fullpath = path + '/' + name

        // Element
        this.element = document.createElement('div')
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
            isBackup: true
        }
        
        storage.set('OPENED', backup)
    }

    getElement() {
        return this.element
    }
    

}