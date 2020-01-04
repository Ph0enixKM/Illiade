import { spawn } from 'child_process'
import path from 'path'


import interact from 'interactjs'

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
            if (onResize != null) onResize(event, x, y)
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
        this.path = '/'
        this.cmd = null
        this.input = null

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

    write(content) {
        const inputLine = document.createElement('div')
        inputLine.className = 'input-line'
        inputLine.innerHTML = content
        terminal.appendChild(inputLine)
    }
    

    inputReady(path) {
        const inputLine = document.createElement('div')
        const input = document.createElement('textarea')

        inputLine.className = 'input-line'
        inputLine.innerHTML = `
        <span class="path">root${this.path}</span>
        <span class="dollar">$</span>
        `

        inputLine.appendChild(input)
        terminal.appendChild(inputLine)
        this.input = input

        input.focus()
        input.addEventListener('keydown', e => {
            if (e.key == 'Enter') {
                // e.preventDefault()
                e.target.setAttribute('disabled', '')
                let command = e.target.value
                
                this.cmd = spawn(command, [], {
                    shell: true,
                    cwd: window.path.join(ROOT.val, this.path)
                });
                // ls.stdin.write('HELLO')
                
                this.cmd.stdout.on('data', (data) => {
                    this.write(data)
                    // console.log(`stdout: ${data}`);
                });

                this.cmd.stderr.on('data', (data) => {
                    this.write('ERR:' + data)
                });

                this.cmd.on('close', (code) => {
                    fsCont.innerHTML = ''
                    changeDirectory(ROOT.val)
                    OPENED.tick(OPENED.val)

                    console.log(`child process exited with code ${code}`);
                    this.inputReady(this.path)
                });
                // cmd.stdin.end()


            }
        })

    }


}

window.term = new Terminal()