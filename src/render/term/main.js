import os from 'os'
import { clipboard } from 'electron'
import { WebglAddon } from 'xterm-addon-webgl'
const { Terminal: xTerminal } = require('xterm')
const pty = require('node-pty')

// Global variables which are shared
// Across the 'term' directory
const termElem = $('#terminal')
const xtermsElem = $('#xterms')
const xtermElem = $('#xterm')
const tabsElem = $('#term-tabs')
const termButton = $('#panel #terminal-button')
const termEditElem = $('#terminal #term-edit')
// const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
const shell = TERM_ENV.val;
const ptyConfig = {
    name: 'xterm-color',
    cols: TERM_X.val,
    rows: TERM_Y.val,
    cwd: ROOT.val,
    env: process.env
}

// The main terminal class
// that is responsible for the
// entire terminal mechanism.
class Terminal {

    // Run Terminal
    // and hide it
    // initially.
    constructor() {
        this.initTerm()
        this.changeTerm(0)
        this.edit = {
            move: [false, false, false, false],
            resize: [false, false, false, false]
        }

        // Hide terminal once rendered
        setTimeout(() => {
            termElem.style.transform = 'scale(0)'
            termElem.style.visibility = 'hidden'
        }, 100)

        TERMINALS.trigger((v) => {
            console.log(v);
        })
    }


    // Create a new terminal
    // in a new tab and
    // setup the entire terminal
    // event handling
    initTerm() {
        const ID = TERMINALS.val.length

        // Initialize a new pty context
        ptyConfig.cwd = ROOT.val
        let ptyProcess = pty.spawn(shell, [], ptyConfig)

        // Create tab
        const tab = document.createElement('div')
        tab.className = 'term-tab'
        tabsElem.appendChild(tab)
        const cursor = ['block', 'underline', 'bar']

        // Initialize xterm.js and attach it to the DOM
        let xterm = new xTerminal({
            cols: TERM_X.val,
            rows: TERM_Y.val,
            allowTransparency: true,
            cursorStyle: TERM_CURSOR_STYLE.val.toLowerCase(),
            cursorColor: '#FF0000',
            fontFamily: 'monospace',
            fontSize: TERM_FONT_SIZE.val,
            drawBoldTextInBrightColors: false,
            theme: {
                background: 'transparent',
                foreground: '#CFB8AB',
                black: '#111111',
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
                lightWhite: '#CFB8AB',
                cursor: TERM_CURSOR_COLOR.val
            }
        })

        // Assign the terminal
        // to existing terminals
        TERMINALS.push({
            xterm,
            ptyProcess,
            tab
        })

        // Initialize xterm frontend
        xterm.open(xtermsElem)
        // xterm.loadAddon(new WebglAddon())

        // Update width of the terminal
        // notify client and backend and
        // persist changes to the dna
        TERM_X.trigger(val => {
            TERMINALS.val.map(term => {
                if (term == null) return null
                term.xterm.resize(TERM_X.val, TERM_Y.val)
                term.ptyProcess.resize(TERM_X.val, TERM_Y.val)
            })
            storage.set('TERM_X', TERM_X.val)
            storage.set('TERM_Y', TERM_Y.val)
            drag.setOption('limit', document.body)
        })

        // Update height of the terminal
        // notify client and backend and
        // persist changes to the dna
        TERM_Y.trigger(val => {
            TERMINALS.val.map(term => {
                if (term == null) return null
                term.xterm.resize(TERM_X.val, TERM_Y.val)
                term.ptyProcess.resize(TERM_X.val, TERM_Y.val)
            })
            storage.set('TERM_X', TERM_X.val)
            storage.set('TERM_Y', TERM_Y.val)
            drag.setOption('limit', document.body)
        })

        // Update zoom of the terminal
        // notify client and persist
        // changes to the dna.
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

        // Capture some of the keys
        // in oreder to use them with
        // terminal manipulative commands
        // like resize, move, zoom etc.
        xterm.attachCustomKeyEventHandler(e => {
            const isCtrl = (process.platform === 'darwin') ? e.metaKey : e.ctrlKey
            const isAlt = (process.platform === 'darwin') ? e.ctrlKey : e.altKey

            if (e.type == 'keydown') {
                // Polyfill of text copying
                // from the termnal selection to clipboard
                if (e.key.toLowerCase() == 'c' && isCtrl && e.shiftKey) {
                    clipboard.writeText(xterm.getSelection(), 'clipboard')
                }

                // Polyfill of text pasting
                // from the clipboard to terminal input
                if (e.key.toLowerCase() == 'v' && isCtrl && e.shiftKey) {
                    console.log(xterm.paste())
                }

                // Moving
                if (e.key.toLowerCase() == 'e' && isAlt) {
                    TERMINAL_EDIT.val = !TERMINAL_EDIT.val
                }

                if (!TERMINAL_EDIT.val) {
                    // Invoke terminal
                    if (e.key.toLowerCase() == 't' && isAlt) {
                        TERMINAL_OPEN.val = false
                        TERMINALS.val[TERMINAL_ID.val].xterm.focus()
                        console.log(TERMINALS.val[TERMINAL_ID.val]);
                        e.preventDefault()
                        e.stopPropagation()
                    }

                    // Create new tab
                    if (e.key.toLowerCase() == 't' && isCtrl) {
                        this.initTerm()
                        this.changeTerm(1)
                        e.preventDefault()
                        e.stopPropagation()
                    }

                    // Switch to the next tab
                    if (e.key == 'ArrowRight' && isCtrl) {
                        this.changeTerm(1)
                        e.preventDefault()
                        e.stopPropagation()
                    }

                    // Switch to the previous tab
                    if (e.key == 'ArrowLeft' && isCtrl) {
                        this.changeTerm(-1)
                        e.preventDefault()
                        e.stopPropagation()
                    }

                    // Close current tab
                    if (e.key.toLowerCase() == 'w' && isCtrl) {
                        ptyProcess.kill()
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }

            }

            // Keybindings to resize,
            // zoom and move the terminal
            if (TERMINAL_EDIT.val) {
                // Zooming
                if (e.type == 'keydown') {
                    if (e.key == 'e' && !isAlt) {
                        if (TERM_FONT_SIZE.val < 100) {
                             TERM_FONT_SIZE.val = TERM_FONT_SIZE.val + 2
                        }
                    }
                    else
                    if (e.key == 'q' && !isAlt) {
                        if (TERM_FONT_SIZE.val > 4) {
                             TERM_FONT_SIZE.val = TERM_FONT_SIZE.val - 2
                        }
                    }
                }


                // Scaling
                if (e.type == 'keydown') {
                    if (e.key == 'w' && !isAlt) this.edit.resize[0] = true
                    else
                    if (e.key == 'd' && !isAlt) this.edit.resize[1] = true
                    else
                    if (e.key == 's' && !isAlt) this.edit.resize[2] = true
                    else
                    if (e.key == 'a' && !isAlt) this.edit.resize[3] = true
                }
                else
                if (e.type == 'keyup') {
                    if (e.key == 'w' && !isAlt) this.edit.resize[0] = false
                    else
                    if (e.key == 'd' && !isAlt) this.edit.resize[1] = false
                    else
                    if (e.key == 's' && !isAlt) this.edit.resize[2] = false
                    else
                    if (e.key == 'a' && !isAlt) this.edit.resize[3] = false
                }


                // Moving
                if (e.type == 'keydown') {
                    if (e.key == 'ArrowUp' && !isAlt) this.edit.move[0] = true
                    else
                    if (e.key == 'ArrowRight' && !isAlt) this.edit.move[1] = true
                    else
                    if (e.key == 'ArrowDown' && !isAlt) this.edit.move[2] = true
                    else
                    if (e.key == 'ArrowLeft' && !isAlt) this.edit.move[3] = true
                }
                else
                if (e.type == 'keyup') {
                    if (e.key == 'ArrowUp' && !isAlt) this.edit.move[0] = false
                    else
                    if (e.key == 'ArrowRight' && !isAlt) this.edit.move[1] = false
                    else
                    if (e.key == 'ArrowDown' && !isAlt) this.edit.move[2] = false
                    else
                    if (e.key == 'ArrowLeft' && !isAlt) this.edit.move[3] = false
                }
            }
        })

        // Setup communication between
        // xterm.js and node-pty
        xterm.onData((data) => {
            if (!TERMINAL_EDIT.val) {
                // Skip terminal invocations
                if (data == "t") return
                ptyProcess.write(data)
            }
        })
        ptyProcess.on('data', function (data) {
            xterm.write(data)
        })

        // Enable terminal
        // to be moved using
        // keyboard
        this.editTerm(xterm)

        // Whenver process is about to get
        // killed - remove the terminal
        ptyProcess.onExit(val => {
            this.removeTerm(ID)
        })

    }


    // Switches tab containing
    // desired terminal. If
    // succeeded - returns true.
    // Returns false otherwise.
    changeTerm(next) {
        TERMINALS.val = TERMINALS.val.filter(item => item != null)
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


    // Remove tab by ID and
    // get rid of the GUI
    // representation.
    removeTerm(ID) {
        let isLast = TERMINALS.val.filter(tab => tab != null).length == 1

        // Handle current tab if there are no other tabs
        if (isLast) {
            this.initTerm()
            this.changeTerm(1)
        }


        // Regular behavior
        else {
            let canGoBack = this.changeTerm(-1)
            if(!canGoBack) {
                this.changeTerm(1)
            }
        }

        // The actual removing part
        TERMINALS.val[ID].tab.style.display = 'none'
        TERMINALS.val[ID] = null
    }


    // Terminal movement controller which
    // is used to move and resize the
    // terminal with keyboard.
    editTerm(xterm) {
        let interval = null
        let speed = 0.005

        TERMINAL_EDIT.trigger(val => {
            // Turn on
            if (val) {
                interval = setInterval(() => {
                    // Moving
                    (() => {
                        let pos = TERM_POS.val
                        let updown = 0
                        let leftright = 0

                        if (this.edit.move[0]) updown = 1
                        if (this.edit.move[2]) updown = -1
                        if (this.edit.move[1]) leftright = 1
                        if (this.edit.move[3]) leftright = -1

                        pos[1] -= updown * speed
                        pos[0] += leftright * speed

                        if (pos[0] > 100) pos[0] = 100
                        if (pos[0] < 0) pos[0] = 0
                        if (pos[1] > 100) pos[1] = 100
                        if (pos[1] < 0) pos[1] = 0

                        TERM_POS.val = pos
                    })();

                    // Resizing
                    (() => {
                        let updown = 0
                        let leftright = 0

                        if (this.edit.resize[0]) updown = 1
                        if (this.edit.resize[2]) updown = -1
                        if (this.edit.resize[1]) leftright = 1
                        if (this.edit.resize[3]) leftright = -1

                        // Resizing let's terminal move - bugfix
                        if (updown || leftright) this.edit.move.fill(false)

                        TERM_X.val = TERM_X.val + leftright
                        TERM_Y.val = TERM_Y.val - updown


                        if (TERM_X.val > 500) {
                            TERM_X.val = 500
                        }

                        if (TERM_X.val < 20) {
                            TERM_X.val = 20
                        }

                        if (TERM_Y.val > 500) {
                            TERM_Y.val = 500
                        }

                        if (TERM_Y.val < 5) {
                            TERM_Y.val = 5
                        }
                    })();
                }, 10)

                termEditElem.classList.add('on')
            }

            // Turn off
            else {
                clearInterval(interval)
                interval = null
                termEditElem.classList.remove('on')
            }
        })

    }
}

const timer = setTimeout(() => {
    window.terminal = new Terminal()
}, 500)

ROOT.triggerOnce(() => {
    clearTimeout(timer)
    window.terminal = new Terminal()
})
