import { app, BrowserWindow, Menu, dialog } from 'electron'
import path from 'path'


// Globals
let win

// Configs
Menu.setApplicationMenu(null)

// Main Ready Call
app.on('ready', () => { 
    
    win = new BrowserWindow ({
        width: 1280,
        height: 720,
        frame: false,
        backgroundColor: '#2a2522',
        webPreferences : {
            nodeIntegration: true
        },
        icon: path.join(__dirname, '../../logo/logo.png')
    })
    win.loadFile(path.join(__dirname, '../view/view.html'))
})