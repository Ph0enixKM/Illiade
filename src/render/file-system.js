import fs from 'fs'
import { formatDiagnostic } from 'typescript'

let fileSystem = $('#file-system')
let fsCont = $('#file-system #container')
let changeDir = $('#change-dir')

changeDir.addEventListener('click', changeDirectory)
window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 'd' && e.altKey)
        changeDirectory()
})


async function changeDirectory() {
    menu.on({
        title: 'Change root directory',
        subtitle: 'You can only write absolute path.',
        placeholder: '/home/'
    })

    let inputDir = await menu.get()
    fsCont.innerHTML = ''

    fs.readdir(inputDir, (error, files) => {
        if (error) {
            err.spawn(`Such directory like '${inputDir}' does not exist`)
        }

        else {
            let isDirs = []
            
            for (const file of files) {
                let boolValue = fs.statSync(path.join(inputDir, file)).isDirectory()
                isDirs.push(boolValue)
            }
            
            files.forEach((value, index) => {
                if (isDirs[index]) {
                    let dir = new Directory(inputDir, value)
                    fsCont.appendChild(dir.getElement())
                }

                else {
                    let file = new File(inputDir, value)
                    fsCont.appendChild(file.getElement())
                }
            })
            
            ROOT.val = inputDir
            ROOTS.push(inputDir)

        }
    })    
}


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
        this.element.setAttribute('name', name)
        this.element.setAttribute('fullpath', this.fullpath)

        this.element.innerHTML = `
            <span class="dir"> ${name} </span>
            <div class="files">  </div>
        `

        this.element.children[0].addEventListener('click', this.click, false)
    }

    click(event) {
        this.tree = !this.tree
        console.log(`Is expanded tree? ${this.tree}`)
    }

    getElement() {
        return this.element
    }
}

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
    }

    getElement() {
        return this.element
    }

}