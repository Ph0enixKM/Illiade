"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const materia_1 = require("./materia");
// Toolbar
class default_1 {
    constructor() {
        this.element = document.querySelector('#toolbar');
        this.blockBtn = document.querySelector('#toolbar .btn#block');
        this.blockBtn.addEventListener('click', e => {
            new materia_1.default([1, 2]);
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=toolbar.js.map