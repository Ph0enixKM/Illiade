import { removeSync } from "fs-extra"

// Core of Directory and File
class FileCore {
    constructor(element, path, name) {
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
                }
            },
            {
                name: 'delete',
                action: () => {

                    // Ask some verification before
                    // removeSync(this.element.getAttribute('fullpath'))
                    fsCont.innerHTML = ''
                    changeDirectory(ROOT.val)
                }
            }
        ])
    }    
}