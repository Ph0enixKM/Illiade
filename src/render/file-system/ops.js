import { removeSync } from "fs-extra"

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
                    fs.renameSync(path.join(thepath, name), path.join(thepath, newName))
                    updateTree()
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
                            updateTree()
                    })
                }
            },
            {
                name: 'delete',
                action: () => {

                    // Ask some verification before
                    removeSync(this.element.getAttribute('fullpath'))
                    updateTree()
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