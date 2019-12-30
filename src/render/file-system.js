import fs from 'fs'

let fileSystem = $('#file-system')
let fsCont = $('#file-system #container')
let changeDir = $('#change-dir')

OPENED.trigger((element, lastElement) => {
    element.children[0].classList.add('selected')
    
    if (lastElement !== null && lastElement !== element) {
        lastElement.children[0].classList.remove('selected')
    }
})

// Menu "Change Directory" (button click)
changeDir.addEventListener('click', async e => {
    menu.on({
        title: 'Change root directory',
        subtitle: 'You can only write absolute path.',
        placeholder: '/home/'
    })

    let inputDir = await menu.get()
    fsCont.innerHTML = ''
    
    if (inputDir === null) return false
    changeDirectory(inputDir)
})

// Menu "Change Directory" (keyboard shortcut)
window.addEventListener('keydown', async e => {
    if (e.key.toLowerCase() == 'd' && e.altKey) {
        menu.on({
            title: 'Change root directory',
            subtitle: 'You can only write absolute path.',
            placeholder: '/home/'
        })
    
        let inputDir = await menu.get()
        fsCont.innerHTML = ''
        
        if (inputDir === null) return false
        changeDirectory(inputDir)
    }
})

// Menu "Change Directory" (init load)
window.onload = () => {
    if (ROOT.val != null && ROOT.val.length !== 0)
        changeDirectory(ROOT.val)
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
            ROOTS.push(inputDir)

            ROOTS.val = [...new Set(ROOTS.val)]
            
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
        if (path[path.length - 1] === '/')
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
        if (path[path.length - 1] === '/')
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
        let formatTag = ''
        
        if (format != null) {
            if (FORMATS.val.includes(format[1])) {
                formatTag = format[1]
            }
        }


        let short = (name.length > 17) ? name.slice(0, 17) + '...' : name

        this.element.innerHTML = `
            <span class="file ${formatTag}" file-name="${name}"> ${short} </span>
        `
        this.element.addEventListener('click', this.click.bind(this), false)
    }

    click(event) {
        OPENED.val = this.element
    }

    getElement() {
        return this.element
    }
    

}