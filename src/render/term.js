import os from 'os'
import { Terminal } from 'xterm'
import { clipboard } from 'electron'
const pty = require('node-pty')

// Initialize node-pty with an appropriate shell
const termElem = $('#terminal')
const xtermElem = $('#xterm')
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
        }, 200)
    }

    else {
        termElem.style.visibility = 'visible'
        termElem.style.transform = 'scale(0)'
        
        setTimeout(() => {
            termElem.style.visibility = 'hidden'
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

// Load drag functionality
window.addEventListener('DOMContentLoaded', () => {
    const drag = new Draggable(termElem, {
        limit: document.body,
        onDragEnd: val => {
            TERM_POS.val = [
                parseInt(val.style.left),
                parseInt(val.style.top)
            ]
        }
    })
    
    // Set initial position
    drag.set(...TERM_POS.val)
    
    // Listen to window resizal
    window.addEventListener('resize', e => {
        drag.setOption('limit', document.body)
    })
})

TERM_POS.trigger(val => {
    storage.set('TERM_POS', TERM_POS.val)
})
// Run Terminal
initTerm()

function initTerm() {
    let ptyProcess = pty.spawn(shell, [], ptyConfig)

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

    xterm.open(xtermElem)

    TERM_X.trigger(val => {
        xterm.resize(TERM_X.val, TERM_Y.val)
        ptyProcess.resize(TERM_X.val, TERM_Y.val)
        storage.set('TERM_X', TERM_X.val)
        storage.set('TERM_Y', TERM_Y.val)
        drag.setOption('limit', document.body)
    })

    TERM_Y.trigger(val => {
        xterm.resize(TERM_X.val, TERM_Y.val)
        ptyProcess.resize(TERM_X.val, TERM_Y.val)
        storage.set('TERM_X', TERM_X.val)
        storage.set('TERM_Y', TERM_Y.val)
        drag.setOption('limit', document.body)
    })

    TERM_FONT_SIZE.trigger(val => {
        xterm.setOption('fontSize', TERM_FONT_SIZE.val)
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
            if (e.key == 'ArrowRight' && e.ctrlKey) {
                TERM_X.val = TERM_X.val + 1
            }
            
            if (e.key == 'ArrowLeft' && e.ctrlKey) {
                TERM_X.val = TERM_X.val - 1
            }

            if (e.key == 'ArrowDown' && e.ctrlKey) {
                TERM_Y.val = TERM_Y.val + 1
            }
            
            if (e.key == 'ArrowUp' && e.ctrlKey) {
                TERM_Y.val = TERM_Y.val - 1
            }

            if (e.key == '=' && e.ctrlKey) {
                TERM_FONT_SIZE.val = TERM_FONT_SIZE.val + 2
            }

            if (e.key == '-' && e.ctrlKey) {
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

    ptyProcess.onExit(val => {
        console.log('exited', ptyProcess)
        xtermElem.innerHTML = ''
        xterm = null
        initTerm()
    })

    termButton.addEventListener('click', () => {
        // Open terminal
        termElem.style.visibility = 'visible'
    })

    termElem.style.transform = 'scale(0)'
}

