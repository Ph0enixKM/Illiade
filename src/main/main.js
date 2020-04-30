import { app, BrowserWindow, Menu } from 'electron'
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
        minWidth: 830,
        minHeight: 430, 
        frame: false,
        backgroundColor: '#2a2522',
        webPreferences : {
            nodeIntegration: true
        },
        icon: path.join(__dirname, '../../logo/logo.png')
    })
    win.loadFile(path.join(__dirname, '../view/view.html'))
    
})

app.once('window-all-closed', app.quit)



