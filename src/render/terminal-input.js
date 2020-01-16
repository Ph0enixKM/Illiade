import path from 'path'
import tippy from 'tippy.js'

// Terminal Input processing commands
const terminalInput = {

    // Simulate Interrupt Command
    interrupt: (e, cmd, inputReady) => {
        // If it's 'CTRL + C' and nothing is selected
        if (e.key.toLowerCase() === 'c' && e.ctrlKey && !window.getSelection().toString().length) {
            if (cmd == null) {
                inputReady(path)
            }
            else {
                process.kill(-cmd.pid)
            }
        }
                
    },

    // Simulate Clear Command
    clear: (command, terminal) => {
        if (command === 'clear') {
            terminal.innerHTML = ''
            return true
        }
    },

    // Simulate List Command
    ls: (command, write, data, isDir, thepath, changeDir) => {
        if (ifProbablyCMD(command, 'ls')) {
            const array = data.toString().split('\n').slice(0, -1)
            let content = ''

            for (const item of array) {
                content += `<div class="item" path-name="${path.join(thepath, item)}">${item}</div>`
            }
            write(content, 'free')
            const line = [...document.querySelectorAll('.input-line.free')].last()
            for (const child of line.children) {
                child.addEventListener('click', async e => {
                    const dir = e.target.getAttribute('path-name')
                    
                    if (await isDir(dir)) {
                        changeDir(dir)
                    }
                    else {
                        let format = new RegExp('\\.(.*)').exec(e.target.innerHTML)
                        let extension = ''
                        
                        if (format != null) {
                            let tempExt = format[1].toLowerCase()
                            if (FORMATS.val.includes(tempExt)) {
                                extension = tempExt
                            }
                        }

                        let backup = {
                            extension: extension,
                            fullpath: dir,
                            isVirtual: true
                        }
                        
                        OPENED.val = backup
                        storage.set('OPENED', backup)
                    }
                })
                
            }

            return true
        }
    },

    cd: (command, thepath, callback) => {        
        if (ifProbablyCMD(command, 'cd')) {
            const dir = command.slice(2, command.length).trim()
            if (dir[0] === '/') {
                callback(dir)
            }
            else {
                callback(path.join(thepath, dir))
            }
            
            return true
        }
    },

    exit(command, hideTerminal, terminal, clear, inputReady) {
        if (command === 'exit') {            
            hideTerminal()
            clear()
            terminal.innerHTML = ''
            inputReady()
            return true
        }
    }
}

// Checks if bases of commands are matching
function ifProbablyCMD(given, base) {
    if (given.slice(0, base.length) == base && 
        [undefined, ' '].includes(given[base.length])
    ) return true
}

// --- SKILLS ---

class Skills {
    constructor(options) {
        if (options != null){
            this.import = options
        }

        this.skills = []
    }

    update() {
        for (const skill of this.skills) {
            skill()
        }
    }

    portal(command, callback, callbackOnce) {
        if (command.trim() === 'portal') {
            this.import.write(`<div class="item-special portal" path="${this.import.path}"></div>`, 'free')
            this.import.inputReady()
            const portal = [...document.querySelectorAll('.input-line.free .portal')].last()
            const hint = tippy(portal, {
                content: this.import.path,
                boundary: 'viewport',
                placement: 'left-end',
                interactive: true,
                appendTo: document.body
            })
            
            callbackOnce(hint)
            portal.addEventListener('click', e => {                
                const path = e.target.getAttribute('path')
                callback(e, path)
            })
            return true
        }
    }

}