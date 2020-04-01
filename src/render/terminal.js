import { spawn } from 'child_process'
import path from 'path'
import interact from 'interactjs'
import tippy from 'tippy.js'
import { INITIAL } from 'monaco-textmate'
import { SIGABRT, SIGINT } from 'constants'

// Function that is responsible for:
// - "Drag 'n Drop" functionality
// - "Resize" functionality
// All the mapping and customization must be done
// In the outer scope via global variables [1]

// Struct of terminal init values
class InitTerm {
    constructor(obj) {
        this.width = obj.width
        this.height = obj.height
        this.x = window.innerWidth * (obj.x) - this.width
        this.y = window.innerHeight * (obj.y) - this.height
    }
}

const initTerm = new InitTerm({
    width: 500,
    height: 200,
    x: 0.9,
    y: 0.9
})

function setupTerminal(options) {

    // [1] Globals
    const query = options.query // CSS element query
    const onMove = options.onMove // Move callback
    const onResize = options.onResize // Resize callback

    // On drag move terminal
    function dragMoveListener(event) {
        const target = event.target
        // keep the dragged position in the data-x/data-y attributes
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)'
    
        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        if (onMove != null) onMove(event, x, y)
    }
    
    interact(query)
        .draggable({
            inertia: true,
            onmove: dragMoveListener,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent'
                })
            ]
        })
        .resizable({
            // resize from all edges and corners
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            },
    
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true
                }),
    
                // minimum size
                interact.modifiers.restrictSize({
                    min: {
                        width: 100,
                        height: 50
                    }
                })
            ],
    
            inertia: true
        })
        .on('resizemove', (event) => {            
            const target = event.target
            let x = (parseFloat(target.getAttribute('data-x')) || 0)
            let y = (parseFloat(target.getAttribute('data-y')) || 0)
    
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top
            
            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)'
    
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            // if (onResize != null) onResize(event, x, y)
        })
}

// Terminal Globals
const button = $('#terminal-button')
const terminal = $('#terminal')
const grabbingTerminal = new Variable(false)

// Make the terminal to highlight on grab
grabbingTerminal.trigger(val => {
    if(val) {
        button.classList.add('grab')
    }
    else {
        button.classList.remove('grab')
    }
})

// Additional Events for handling the button highlight
terminal.addEventListener('mousedown', () => grabbingTerminal.val = true)
terminal.addEventListener('mouseup', e => {    
    grabbingTerminal.val = false
    let x = (parseFloat(terminal.getAttribute('data-x')) || 0)
    let y = (parseFloat(terminal.getAttribute('data-y')) || 0)
    onMove(e, x, y)
})

async function showTerminal() {
    return new Promise(res => {
        let x = (parseFloat(terminal.getAttribute('data-x')) || 0)
        let y = (parseFloat(terminal.getAttribute('data-y')) || 0)
    
        terminal.style.visibility = 'visible'
        terminal.style.transition = 'transform 200ms'
        terminal.style.transform = `translate(${x}px, ${y}px) scale(0)`
    
        setTimeout(() => {
            terminal.style.transform = `translate(${x}px, ${y}px) scale(1)`
            setTimeout(() => {
                terminal.style.transition = 'none'
            }, 100)
        }, 100)
    })
}


async function hideTerminal() {
    return new Promise(res => {
        let x = (parseFloat(terminal.getAttribute('data-x')) || 0)
        let y = (parseFloat(terminal.getAttribute('data-y')) || 0)
    
        terminal.style.transition = 'transform 200ms'
        terminal.style.transform = `translate(${x}px, ${y}px) scale(1)`
        
        setTimeout(() => {
            terminal.style.transform = `translate(${x}px, ${y}px) scale(0)`
            setTimeout(() => {
                terminal.style.transition = 'none'
                terminal.style.visibility = 'hidden'
            }, 100)
        }, 100)
    })
}

// Summon Terminal
button.addEventListener('click', () => {
    // terminal.style.visibility = 'visible'
    showTerminal()
    TERMINAL_OPEN.val = true
    term.input.focus()
})

// Summon Terminal (keyboard shortcut)
window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 't' && e.altKey) {
        if (TERMINAL_OPEN.val) {
            hideTerminal()
            TERMINAL_OPEN.val = false
            $('.inputarea').focus()
        }
        else {
            showTerminal()
            TERMINAL_OPEN.val = true
            term.input.focus()
        }
    }
})

function onMove(event, x, y) {
    // Hide the terminal to dock
    const target = event.target
    let pit = 100 
    
    // If the terminal is open
    if (TERMINAL_OPEN.val) {
        // Hover over recall point        
        if (x < pit && y < pit) {
            button.classList.add('over')
            
            // Drop to the recall point
            if (!grabbingTerminal.val) {
                TERMINAL_OPEN.val = false
            }
            
        }

        else {
            button.classList.remove('over')
        }

    }
    
}


class Terminal {
    constructor() {
        this.paralels = $('#paralels')
        this.path = ROOT.val
        this.cmd = null
        this.input = null
        this.stdin = null
        this.busy = false
        this.hints = []
        this.skills = new Skills({
            path: this.path,
            terminal,
            write: this.write.bind(this),
            inputReady: this.inputReady.bind(this)
        })

        ROOT.diverses((val, prev) => {
            this.path = val
            terminal.innerHTML = ''
            this.inputReady()            
        })
        
        // Context menu
        new TinyMenu(terminal, [
            {
                name: 'run in background',
                action: () => {
                    if (this.paralels.children.length >= 5) {
                        $err.spawn('Too many background terminals. Remove one to be able to add more.')
                        return
                    }
                    const el = document.createElement('div')
                    el.className = 'paralel'
                    new Paralel(el, this.input.value, this.path)
                    this.paralels.appendChild(el)
                    this.inputReady()   
                }
            }
        ])
        
        const quickCommand = (e, number) => {
            if (e.key == number && e.altKey) {
                if (!window[`COMMAND${number}`].val.length)
                    return $err.spawn(`Command ${number} is empty`)
    
                // Interrupt existing
                if (this.cmd) process.kill(-this.cmd.pid)
                    
                this.input.value = window[`COMMAND${number}`].val
                this.theInputFunction({
                    target: this.input,
                    key: 'Enter'
                })
            }
        }
        
        // Quick Commands
        window.addEventListener('keydown', e => quickCommand(e, '1'))
        window.addEventListener('keydown', e => quickCommand(e, '2'))
        window.addEventListener('keydown', e => quickCommand(e, '3'))
        
        // Position of the terminal
        terminal.style.webkitTransform = 
            terminal.style.transform = 
                'translate(' + initTerm.x + 'px, ' + initTerm.y + 'px) scale(0)'

        // Save position
        terminal.setAttribute('data-x', initTerm.x)
        terminal.setAttribute('data-y', initTerm.y)
        
        // Size of the terminal
        terminal.style.width = `${initTerm.width}px`
        terminal.style.height = `${initTerm.height}px`
        

        TERMINAL_OPEN.trigger(val => {
            if (val) {
                showTerminal()
            }
            
            else {
                hideTerminal()
                button.classList.remove('over')
            }
        })

        setupTerminal({
            query: '#terminal',
            onMove
        })

        this.inputReady()
    }

    // New stdin creation
    newStdin(parent) {
        this.deleteStdin()

        
        
        let el = document.createElement('textarea')
        el.className = 'input-line'
        
        el.addEventListener('keydown', e => {
            // Get rid of new line
            if (e.target.value.length && !e.target.value.trim().length) {
                e.target.value = e.target.value.trim()
            }
            
            if (e.key === 'Enter') {
                e.target.setAttribute('disabled', '')
                this.cmd.stdin.write(e.target.value + '\n')
            }
            
            terminalInput.interrupt(
                e, 
                this.cmd, 
                this.inputReady.bind(this)
                )
            })
            
            parent.appendChild(el)
            this.stdin = el
            el.focus()
        }
        
    // Old stdin removal
    deleteStdin() {
        if (this.stdin != null) {            
            if (!this.stdin.value.trim().length) {
                this.stdin.remove()
            }

            else {
                this.stdin.setAttribute('disabled', '')
            }
        }
    }

    wrapHTML(content, container, mode = '') {
        let lastLine = null
        let lines = []
        let line = ''

        for (const sym of content.toString()) {
            if (sym === '\n') {
                lines.push(line)
                line = ''
            }
            line += sym
        }
        lines.push(line)

        for (const line of lines) {
            const inputLine = document.createElement('div')  
            inputLine.className = 'input-line ' + mode
            inputLine.innerHTML = line
            container.appendChild(inputLine)
            lastLine = inputLine
        }

        return lastLine
    }

    write(content, mode = '') {
        const inputLine = this.wrapHTML(content, terminal, mode)
        this.newStdin(inputLine)
    }

    error(content) {
        const inputLine = this.wrapHTML(`<span style="color:red">${content}</span>`, terminal)
        this.newStdin(inputLine)
    }

    isDir(directory) {
        return new Promise(res => {
            fs.stat(directory, (err, stats) => {
                if (err) return res(null)            
                return res(stats.isDirectory())
            })
        })
    }

    clear() {
        for (const hint of this.hints) {
            hint.destroy()
        }
        this.hints = []
    }

    addHint(hint) {
        this.hints.push(hint)
    }
    

    inputReady() {
        const inputLine = document.createElement('div')
        const input = document.createElement('textarea')

        let short = (this.path.length > 25) ? '...' + this.path.slice(this.path.length - 20, this.path.length) : this.path

        
        inputLine.className = 'input-line'
        inputLine.innerHTML = `
        <span class="path" data-tippy-content="${this.path}">${short}</span>
        <span class="dollar">$</span>
        `

        // Block input
        if (this.input !== null) {
            this.input.setAttribute('disabled', '')
            this.input.removeEventListener('keydown', this.theInputFunctionSeed)
        }
        
        this.deleteStdin()
        inputLine.appendChild(input)
        terminal.appendChild(inputLine)
        this.input = input
        const hint = tippy(inputLine.children[0], {
            boundary: 'viewport',
            placement: 'bottom',
            trigger: 'click',
            interactive: true,
            appendTo: document.body
        })
        
        this.addHint(hint)
        this.theInputFunctionSeed = this.theInputFunction.bind(this)

        input.focus()
        input.addEventListener('keydown', this.theInputFunctionSeed)

    }

    async theInputFunction (e) {
        // Get rid of new line
        if (e.target.value.length && !e.target.value.trim().length) {
            e.target.value = e.target.value.trim()
        }

        if (e.key == 'Enter') {            
            let command = e.target.value

            // Block input
            e.target.setAttribute('disabled', '')
            e.target.removeEventListener('keydown', this.theInputFunctionSeed)

            // If no command passed
            if (!e.target.value.trim().length) {
                this.inputReady(this.path)
                return
            }

            // Portal
            if (this.skills.portal(command, (_e, path) => {
                this.path = path
                this.inputReady()
            }, hint => {
                this.addHint(hint)
            })) return 

            // Handle CD
            if (terminalInput.cd(command, this.path, async val => {
                if (val != null) {
                    if (await this.isDir(val)) {
                        this.path = val
                        this.inputReady()
                    }
                    else {
                        this.error(`"${val}" is not a directory`)
                        this.inputReady()
                    }
                }
            })) return

            // Handle Exit Terminal
            if (terminalInput.exit(
                command, 
                hideTerminal, 
                terminal, 
                this.clear.bind(this), 
                this.inputReady.bind(this),
            )) return
            
            // Handle Background Command
            if (terminalInput.bg(
                command, 
                this.paralels, 
                this.path,
                this.inputReady.bind(this)
            )) return
            
            // Handle File Open Command
            if (await terminalInput.open(
                command, 
                this.path,
                this.isDir.bind(this),
                this.error.bind(this),
                this.inputReady.bind(this)
            )) return

            
            // Handle Clear
            if (terminalInput.clear(
                command, 
                terminal,
                this.inputReady.bind(this)
            )) return
            
            this.write('')
            // Spawn command
            this.busy = true
            this.cmd = spawn(command, [], {
                shell: true,
                cwd: this.path,
                detached: true
            })
            
            
            // Listen for the output
            this.cmd.stdout.on('data', (data) => {
                // If there is defined way of output
                if (terminalInput.ls(
                        command, 
                        this.write.bind(this), 
                        data, 
                        this.isDir.bind(this), 
                        this.path, 
                        (path) => {                                
                            terminalInput.cd(`cd ${path}`, this.path, async val => {
                                this.path = val
                                this.inputReady()                                    
                            })
                        }
                    )
                ) return this.busy = false

                this.write(data)
            })

            // Listen for the error
            this.cmd.stderr.on('data', (data) => {
                this.error(data)
            })

            // Listen for the terminal
            this.cmd.on('close', (code) => {
                this.clear()
                OPENED.tick(OPENED.val)

                console.log(`child process exited with code ${code}`);
                this.inputReady(this.path)
                this.cmd = null
                this.busy = false
            })

        }

        // Interupt shortcut
        terminalInput.interrupt(
            e, 
            this.cmd, 
            this.inputReady.bind(this)
        )
    }


}

class Paralel {
    constructor(element, command, path) {
        this.element = element
        this.cont = document.createElement('div')
        this.cont.className = 'content'
        this.cont.innerHTML = `<div style="color: purple">${command}</div>`
        
        this.element.appendChild(this.cont)
        this.cmd = spawn(command, [], {
            shell: true,
            cwd: path,
            detached: true
        })
        
        new TinyMenu(this.element, [
            {
                name: 'kill',
                action: () => {
                    this.cmd.kill(SIGINT)
                    this.close()
                }
            }
        ])
        
        // Listen for the output
        this.cmd.stdout.on('data', (data) => {
            const div = document.createElement('div')
            div.innerHTML = data
            this.cont.appendChild(div)
            this.cont.scrollTop = this.cont.scrollHeight
        })
        
        // Listen for the error
        this.cmd.stderr.on('data', (data) => {
            $err.spawn(data)
        })
        
        // Listen for the terminal
        this.cmd.on('close', (code) => {
            this.close()
        })
        
    }
    
    close() {
        this.element.style.height = '0'
        this.element.style.width = '0'
        setTimeout(() => {
            this.element.remove()
        }, 300)
    }
    
    
}

window.term = new Terminal()