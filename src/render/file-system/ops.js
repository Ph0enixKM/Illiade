import fs from 'fs-extra'
import { exec } from 'child_process'

// FS Events
window.events = {
    unlink: new Event('fs-unlink'),
    rename: new Event('fs-rename'),
    move: new Event('fs-move'),
    duplicate: new Event('fs-duplicate'),
    newFile: new Event('fs-new-file'),
    newDir: new Event('fs-new-dir'),
}

// Core of Directory and File
class FileCore {
    constructor(element, thepath, name) {
        this.element = element
        new TinyMenu(this.element, [
            {
                name: 'rename',
                action: rename.bind(this)
            },
            {
                name: 'move',
                action: move.bind(this)
            },
            {
                name: 'duplicate',
                action: duplicate.bind(this)
            },
            {
                name: 'create file',
                action: createFile.bind(this)
            },
            {
                name: 'create directory',
                action: createDir.bind(this)
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
                    decision.spawn(
                        `Are you sure you want to delete <br>${name}?`,
                    answer => {
                        if (answer) {
                            unlink.bind(this)()
                        }
                    })
                }
            }
        ])

        // Give ability to do operations remotely
        this.element.addEventListener('fs-unlink', unlink.bind(this))
        this.element.addEventListener('fs-new-dir', createDir.bind(this))
        this.element.addEventListener('fs-new-file', createFile.bind(this))
        this.element.addEventListener('fs-duplicate', duplicate.bind(this))
        this.element.addEventListener('fs-rename', rename.bind(this))
        this.element.addEventListener('fs-move', move.bind(this))


        // Unlink Directory or File
        function unlink() {
            fs.removeSync(this.element.getAttribute('fullpath'))
        }


        // Create Directory 
        async function createDir() {
            let targetDir = path.join(thepath, name)
            // Get parent path if it's a file
            if (this.isFile) {
                targetDir = thepath
            }
            // Create menu
            menu.on({
                title: 'Create New Directory',
                subtitle: 'Choose a folder name',
                placeholder: 'name'
            })
            // Create the directory
            let newName = await menu.get()
            let newPath = path.join(targetDir, newName)
            fs.mkdirSync(newPath)
        }


        // Create File
        async function createFile() {
            let targetDir = path.join(thepath, name)
            // Get parent path if it's a file
            if (this.isFile) {
                targetDir = thepath
            }
            // Create menu
            menu.on({
                title: 'Create New File',
                subtitle: 'Choose a filename (with extension)',
                placeholder: 'name.ext'
            })
            // Create the file
            let newName = await menu.get()
            let newPath = path.join(targetDir, newName)
            fs.writeFileSync(newPath, '')
        }


        // Duplicate Directory or File
        async function duplicate() {
            let newName = name
            while (await pathExists(path.join(thepath, newName))) {
                newName = '_' + newName
            }
            fs.copyFile(
                path.join(thepath, name), 
                path.join(thepath, newName),
                (err) => {
                    if (err) throw err
            })
        }


        // Rename Directory or File
        async function rename() {
            menu.on({
                title: 'Rename',
                subtitle: 'Choose a new name',
                placeholder: name
            })
            // Create menu
            let newName = await menu.get()
            // Don't rename if escaped menu
            if (newName === null) return false
            let newPath = path.join(thepath, newName)
            let oldPath = path.join(thepath, name)
            // Do rename the file
            fs.renameSync(oldPath, newPath)
            // If currently in the file - open it
            if (OpenedAPI.get('fullpath') == oldPath) {
                const newFile = OpenedAPI.extract(newPath)
                OPENED.val = newFile
            }
        }


        // Move Directory or File
        async function move() {
            fsMove.on(thepath, name)
        }



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
new Shortcut('Escape', e => {
    fsMove.off()
})