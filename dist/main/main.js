"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require('path');
// Globals
let win;
// Configs
electron_1.Menu.setApplicationMenu(null);
// Main Ready Call
electron_1.app.on('ready', () => {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        backgroundColor: '#222',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'logo/logo.png'
    });
    win.loadFile(path.join(__dirname, '../view/view.html'));
});
//# sourceMappingURL=main.js.map