import os from 'os'
import { Terminal } from 'xterm'
import { clipboard } from 'electron'
const pty = require('node-pty')

// Initialize node-pty with an appropriate shell
const termElem = $('#terminal')
const xtermsElem = $('#xterms')
const xtermElem = $('#xterm')
const tabsElem = $('#term-tabs')
const termButton = $('#panel #terminal-button')
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
const ptyConfig = {
    name: 'xterm-color',
    cols: TERM_X.val,
    rows: TERM_Y.val,
    cwd: ROOT.val,
    env: process.env
}

TERMINAL_OPEN.trigger(val => {
    if (val) {
        termElem.style.visibility = 'hidden'
        termElem.style.transform = 'scale(0)'

        setTimeout(() => {
            termElem.style.visibility = 'visible'
            termElem.style.transform = 'scale(1)'
            TERMINALS.val[TERMINAL_ID.val].xterm.focus()
        }, 200)
    }

    else {
        termElem.style.visibility = 'visible'
        termElem.style.transform = 'scale(0)'
        
        setTimeout(() => {
            termElem.style.visibility = 'hidden'
            $('.inputarea').focus()
        }, 200)
    }
})


termButton.addEventListener('click', e => {
    TERMINAL_OPEN.val = !TERMINAL_OPEN.val
})

window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 't' && e.altKey) {
        TERMINAL_OPEN.val = !TERMINAL_OPEN.val
    }
})

function calcTermPixels(percentX, percentY) {
    return [
        window.innerWidth * percentX,   
        window.innerHeight * percentY
    ]
}

// Load drag functionality
window.addEventListener('DOMContentLoaded', () => {
    window.drag = new Draggable(termElem, {
        limit: document.body,
        onDragEnd: val => {
            TERM_POS.val = [
                parseInt(val.style.left) / window.innerWidth,
                parseInt(val.style.top) / window.innerHeight
            ]
        }
    })
    
    // Set initial position
    drag.set(...calcTermPixels(...TERM_POS.val))
    
    // Listen to window resizal
    window.addEventListener('resize', e => {
        drag.set(...calcTermPixels(...TERM_POS.val))
        drag.setOption('limit', document.body)
    })
})

TERM_POS.trigger(val => {
    storage.set('TERM_POS', TERM_POS.val)
})

// Run Terminal
initTerm()
changeTerm(0)

// Hide terminal once rendered
setTimeout(() => {
    termElem.style.transform = 'scale(0)'
    termElem.style.visibility = 'hidden'
}, 100)

function initTerm() {
    const ID = TERMINALS.val.length

    ptyConfig.cwd = ROOT.val
    let ptyProcess = pty.spawn(shell, [], ptyConfig)

    // Create tab
    const tab = document.createElement('div')
    tab.className = 'term-tab'
    tabsElem.appendChild(tab)

    // Initialize xterm.js and attach it to the DOM
    let xterm = new Terminal({
        cols: TERM_X.val,
        rows: TERM_Y.val,
        allowTransparency: true,
        cursorStyle: 'bar',
        fontFamily: 'monospace',
        fontSize: TERM_FONT_SIZE.val,
        drawBoldTextInBrightColors: false,
        theme: {
            background: 'transparent',
            foreground: '#CFB8AB',
            black: 'transparent',
            red: '#C7565A',
            green: '#B0B81A',
            yellow: '#E0BB3F',
            blue: '#2A968A',
            magenta: '#AA6BC4',
            cyan: '#65B57B',
            white: '#F2E7A9',
            lightBlack: '#686868',
            lightRed: '#C7565A',
            lightGreen: '#B0B81A',
            lightYellow: '#E0BB3F',
            lightBlue: '#2A968A',
            lightMagenta: '#AA6BC4',
            lightCyan: '#65B57B',
            lightWhite: '#CFB8AB'
        }
    })    
    
    // Assign the terminal 
    // to existing terminals
    TERMINALS.push({
        xterm,
        ptyProcess,
        tab
    })
    
    xterm.open(xtermsElem)

    TERM_X.trigger(val => {
        TERMINALS.val.map(term => {
            if (term == null) return null
            term.xterm.resize(TERM_X.val, TERM_Y.val)
        })
        ptyProcess.resize(TERM_X.val, TERM_Y.val)
        storage.set('TERM_X', TERM_X.val)
        storage.set('TERM_Y', TERM_Y.val)
        drag.setOption('limit', document.body)
    })

    TERM_Y.trigger(val => {
        TERMINALS.val.map(term => {
            if (term == null) return null
            term.xterm.resize(TERM_X.val, TERM_Y.val)
        })
        ptyProcess.resize(TERM_X.val, TERM_Y.val)
        storage.set('TERM_X', TERM_X.val)
        storage.set('TERM_Y', TERM_Y.val)
        drag.setOption('limit', document.body)
    })

    TERM_FONT_SIZE.trigger(val => {
        TERMINALS.val.map(term => {
            if (term == null) return null
            term.xterm.setOption('fontSize', TERM_FONT_SIZE.val)
        })
        storage.set('TERM_FONT_SIZE', TERM_FONT_SIZE.val)
        xterm.resize(TERM_X.val + 1, TERM_Y.val + 1)
        xterm.resize(TERM_X.val, TERM_Y.val)
        drag.setOption('limit', document.body)
    })

    xterm.attachCustomKeyEventHandler(e => {
        // Copy text
        if (e.key.toLowerCase() == 'c' && e.ctrlKey && e.shiftKey) {
            clipboard.writeText(xterm.getSelection(), 'clipboard')
        }
        
        // Paste text
        if (e.key.toLowerCase() == 'v' && e.ctrlKey && e.shiftKey) {
            console.log(xterm.paste())
        }

        // Resize
        if (e.type == 'keydown') {
            if (e.key == 'ArrowRight' && e.altKey) {
                if (TERM_X.val < 500)
                TERM_X.val = TERM_X.val + 1
            }
            
            if (e.key == 'ArrowLeft' && e.altKey) {
                if (TERM_X.val > 5)
                TERM_X.val = TERM_X.val - 1
            }

            if (e.key == 'ArrowDown' && e.altKey) {
                if (TERM_Y.val < 500)
                TERM_Y.val = TERM_Y.val + 1
            }
            
            if (e.key == 'ArrowUp' && e.altKey) {
                if (TERM_Y.val > 5)
                TERM_Y.val = TERM_Y.val - 1
            }

            if (e.key == '=' && e.ctrlKey) {
                if (TERM_FONT_SIZE.val < 100)
                TERM_FONT_SIZE.val = TERM_FONT_SIZE.val + 2
            }

            if (e.key == '-' && e.ctrlKey) {
                if (TERM_FONT_SIZE.val > 4)
                TERM_FONT_SIZE.val = TERM_FONT_SIZE.val - 2
            }
        }
    })

    // Setup communication between xterm.js and node-pty
    xterm.onData((data) => {
        ptyProcess.write(data)
    })
    ptyProcess.on('data', function (data) {
        xterm.write(data)
    })

    // Xterm bindings
    xterm.onKey(key => {
        // Invoke terminal
        if (key.domEvent.key.toLowerCase() == 't' && key.domEvent.altKey) {
            TERMINAL_OPEN.val = false
            TERMINALS.val[TERMINAL_ID.val].xterm.focus()
            key.domEvent.preventDefault()
            key.domEvent.stopPropagation()
        }
        
        // Create new tab
        if (key.domEvent.key.toLowerCase() == 't' && key.domEvent.ctrlKey) {
            initTerm()
            changeTerm(1)
            key.domEvent.preventDefault()
            key.domEvent.stopPropagation()
        }

        // Switch to the next tab
        if (key.domEvent.key == 'ArrowRight' && key.domEvent.ctrlKey) {
            changeTerm(1)
            key.domEvent.preventDefault()
            key.domEvent.stopPropagation()
        }

        // Switch to the previous tab
        if (key.domEvent.key == 'ArrowLeft' && key.domEvent.ctrlKey) {
            changeTerm(-1)
            key.domEvent.preventDefault()
            key.domEvent.stopPropagation()
        }

        // Close current tab
        if (key.domEvent.key.toLowerCase() == 'w' && key.domEvent.ctrlKey) {
            removeTerm(TERMINAL_ID.val)
            key.domEvent.preventDefault()
            key.domEvent.stopPropagation()
        }
    })
    
    ptyProcess.onExit(val => {
        removeTerm(ID)
    })

    termButton.addEventListener('click', () => {
        // Open terminal
        termElem.style.visibility = 'visible'
    })

}

// Returns true if done
// Returns false if failed
function changeTerm(next) {
    let len = TERMINALS.val.length    
    let index = null

    // Go up
    if (next > 0) {
        for (let i = TERMINAL_ID.val + 1; i < len; i++) {
            if (TERMINALS.val[i] != null) {
                index = i
                break
            }
        }
    }

    // Stay here...
    // in other words update terminal
    else if (next == 0) {
        index = TERMINAL_ID.val
    }

    // Go Down
    else {
        for (let i = TERMINAL_ID.val - 1; i >= 0; i--) {
            if (TERMINALS.val[i] != null) {
                index = i
                break
            }
        }
    }

    // If it's not possible to go further
    // then return false (fail)
    if (index == null) return false

    // Otherwise - continue
    // changing GUI part
    else {
        // Set the new index
        TERMINAL_ID.val = index

        // Disable all terminals
        TERMINALS.val.map(val => {
            if (val == null) return
            val.xterm.element.style.display = 'none'
            val.tab.classList.remove('on')
        })

        // Enable the terminal that actually should be enabled
        TERMINALS.val[index].xterm.element.style.display = 'block'
        TERMINALS.val[index].xterm.focus()
        TERMINALS.val[index].tab.classList.add('on')
        return true
    }
}


// Remove tab by ID
function removeTerm(ID) {
    let isLast = TERMINALS.val.filter(tab => tab != null).length == 1
    
    // Handle current tab if there are no other tabs
    if (isLast) {    
        initTerm()
        changeTerm(1) 
    }
    

    // Regular behavior
    else {
        let canGoBack = changeTerm(-1)
        if(!canGoBack) {
            changeTerm(1)
        }
    }
    
    // The actual removing part
    TERMINALS.val[ID].tab.style.display = 'none'
    TERMINALS.val[ID] = null
    
}