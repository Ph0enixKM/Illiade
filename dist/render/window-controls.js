const { remote } = require('electron');

const win = remote.getCurrentWindow();

// Close Window
$('#exit').addEventListener('click', () => {
    win.close();
});

// Minimize Window
$('#min').addEventListener('click', () => {
    win.minimize();
});

$('#max').addEventListener('click', () => {
    if (win.isMaximized()) win.unmaximize();else win.maximize();
});

if (DEBUG === true) window.addEventListener('keydown', e => {
    if (e.key === 'F6') win.toggleDevTools();else if (e.key === 'F5') win.reload();
});