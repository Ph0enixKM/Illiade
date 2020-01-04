import { spawn } from 'child_process'
import path from 'path'

// -- TEST --

// const ps = spawn('ps', ['ax']);
// const grep = spawn('grep', ['ssh']);

// ps.stdout.on('data', (data) => {
//   grep.stdin.write(data);
// });

// ps.stderr.on('data', (data) => {
//   console.error(`ps stderr: ${data}`);
// });

// ps.on('close', (code) => {
//   if (code !== 0) {
//     console.log(`ps process exited with code ${code}`);
//   }
//   grep.stdin.end();
// });

// grep.stdout.on('data', (data) => {
//   console.log("out:", data.toString());
// });

// grep.stderr.on('data', (data) => {
//   console.error(`grep stderr: ${data}`);
// });

// grep.on('close', (code) => {
//     console.log(`grep process exited with code ${code}`);
//   if (code !== 0) {
//     console.log(`grep process exited with code ${code}`);
//   }
// });
// -- TEST --


import interact from 'interactjs'
import tippy from 'tippy.js'

// Function that is responsible for:
// - "Drag 'n Drop" functionality
// - "Resize" functionality
// All the mapping and customization must be done
// In the outer scope via global variables [1]

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
        this.path = ROOT.val
        this.cmd = null
        this.input = null
        this.stdin = null
        this.busy = false

        ROOT.diverses((val, prev) => {
            this.path = val
            terminal.innerHTML = ''
            this.inputReady()            
        })

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
        this.wrapHTML(`<span style="color:red">${content}</span>`, terminal)
    }

    isDir(directory) {
        return new Promise(res => {
            fs.stat(directory, (err, stats) => {
                if (err) return res(null)            
                return res(stats.isDirectory())
            })
        })
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
        tippy(inputLine.children[0], {
            boundary: 'viewport',
            placement: 'bottom',
            trigger: 'click',
            interactive: true,
            appendTo: document.body
        })

        this.theInputFunctionSeed = this.theInputFunction.bind(this)

        input.focus()
        input.addEventListener('keydown', this.theInputFunctionSeed)

    }

    theInputFunction (e) {
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
            if (terminalInput.exit(command, hideTerminal, terminal, this.inputReady.bind(this))) return

            
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
                if (
                    terminalInput.clear(command, terminal) ||
                    terminalInput.ls(
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
                fsCont.innerHTML = ''
                changeDirectory(ROOT.val)
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

window.term = new Terminal()