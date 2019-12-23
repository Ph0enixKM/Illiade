import fs from 'fs'
import electronPackager from 'electron-packager'

let fileSystem = $('#file-system')
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
                let dir = new Directory(inputDir, value)
                fileSystem.appendChild(dir.getElement())
            })


        }
    })    
}


class Directory {
    constructor(path, name) {
        this.element = document.createElement('div')
        this.element.className = 'directory'
        this.element.innerHTML = `
            <span class="dir"> ${name} </span>
        `
    }

    getElement() {
        return this.element
    }
}

class File {
    constructor(path, name) {

    }

}