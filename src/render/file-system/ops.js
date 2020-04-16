import fs from 'fs-extra'
import { exec } from 'child_process'

// Core of Directory and File
class FileCore {
    constructor(element, thepath, name) {
        this.element = element
        new TinyMenu(this.element, [
            {
                name: 'rename',
                action: async () => {
                    menu.on({
                        title: 'Rename',
                        subtitle: 'Choose a new name',
                        placeholder: name
                    })

                    let newName = await menu.get()

                    if (newName === null) return false
                    let newPath = path.join(thepath, newName)
                    let oldPath = path.join(thepath, name)
                    
                    fs.renameSync(oldPath, newPath)

                    // If currently in the file - open it
                    if (OpenedAPI.get('fullpath') == oldPath) {
                        const newFile = OpenedAPI.extract(newPath)
                        OPENED.val = newFile
                    }
                }
            },
            {
                name: 'move',
                action: () => {
                    fsMove.on(thepath, name)
                }
            },
            {
                name: 'duplicate',
                action: async () => {
                    let newName = name
                    while (await pathExists(path.join(thepath, newName))) {
                        newName = '_' + newName
                    }
                    fs.copyFile(
                        path.join(thepath, name), 
                        path.join(thepath, newName),
                        (err) => {
                            if (err) throw err;
                    })
                }
            },
            {
                name: 'create file',
                action: async () => {
                    let targetDir = path.join(thepath, name)

                    // Get parent path if it's a file
                    if (this.isFile) {
                        targetDir = thepath
                    }

                    menu.on({
                        title: 'Create New File',
                        subtitle: 'Choose a filename (with extension)',
                        placeholder: 'name.ext'
                    })

                    let newName = await menu.get()
                    let newPath = path.join(targetDir, newName)
                    fs.writeFileSync(newPath, '')
                }
            },
            {
                name: 'create directory',
                action: async () => {
                    let targetDir = path.join(thepath, name)

                    // Get parent path if it's a file
                    if (this.isFile) {
                        targetDir = thepath
                    }

                    menu.on({
                        title: 'Create New Directory',
                        subtitle: 'Choose a folder name',
                        placeholder: 'name'
                    })

                    let newName = await menu.get()
                    let newPath = path.join(targetDir, newName)
                    fs.mkdirSync(newPath)
                }
            },
            {
                name: 'run',
                action: async () => {
                    if (process.platform == 'linux') {
                        exec('xdg-open ' + path.join(thepath, name))
                    }

                    else if (process.platform == 'win32') {
                        exec('start "" ' + path.join(thepath, name))
                    }

                    else if (process.platform == 'darwin') {
                        exec('open ' + path.join(thepath, name))
                    }

                    else msg.error(
                        'This feature is not supported on your operating system'
                    )
                }
            },
            {
                name: 'open parent folder',
                action: async () => {
                    if (process.platform == 'linux') {
                        exec('xdg-open ' + thepath)
                    }

                    else if (process.platform == 'win32') {
                        exec('explorer ' + thepath)
                    }

                    else if (process.platform == 'darwin') {
                        exec('open ' + thepath)
                    }

                    else msg.error(
                        'This feature is not supported on your operating system'
                    )
                }
            },
            {
                name: 'delete',
                action: async () => {
                    let answer = await decision.ask(`Are you sure you want to delete <br>${name}?`)

                    if (answer) {
                        fs.removeSync(this.element.getAttribute('fullpath'))
                    }
                }
            }
        ])
    }    
}

function pathExists(path) {
    return new Promise(res => {
        fs.exists(path, bool => {
            return res(bool)
        })
    })
}

class Move {
    constructor() {
        this.element = $('#fs-move')
        this.image = $('#fs-move-icon')
        this.hint = tippy(this.element, {
            content: 'Move File',
            placement: 'left',
            appendTo: document.body
        })

        this.element.addEventListener('click', this.off.bind(this))
    }

    on(thepath, name) {
        this.element.style.transform = 'scale(1)'
        this.hint.setContent(`Cancel moving ${name} (Esc)`)
        FS_MOVE.val = {
            path: thepath,
            name: name
        }
    }

    off() {
        this.element.style.transform = 'scale(0)'
        FS_MOVE.val = null
    }
}

window.fsMove = new Move()
window.addEventListener('keydown', e => {
    if (e.key == 'Escape')
    fsMove.off()
})