"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Header Module
class default_1 {
    constructor(remote) {
        this.exit = document.querySelector('.btn#exit');
        this.min = document.querySelector('.btn#min');
        this.max = document.querySelector('.btn#max');
        this.win = remote.getCurrentWindow();
        // Exit
        this.exit.addEventListener('click', () => {
            this.win.close();
        });
        // Maximize
        this.max.addEventListener('click', () => {
            if (this.win.isMaximized()) {
                return this.win.unmaximize();
            }
            this.win.maximize();
        });
        // Minimalize
        this.min.addEventListener('click', () => {
            this.win.minimize();
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=header.js.map