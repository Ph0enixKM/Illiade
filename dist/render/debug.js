"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Debug
class default_1 {
    constructor(isDebug) {
        this.win = electron_1.remote.getCurrentWindow();
        if (isDebug) {
            window.addEventListener('keydown', e => {
                if (e.key == 'F5') {
                    location.reload();
                }
                else if (e.key == 'F6') {
                    this.win.toggleDevTools();
                }
            });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=debug.js.map