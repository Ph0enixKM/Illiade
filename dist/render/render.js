"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require('three');
global["3D"] = THREE;
const electron_1 = require("electron");
const debug_1 = require("../render/debug");
const header_1 = require("../render/header");
const flowchart_1 = require("../render/flowchart");
window.onload = () => {
    new debug_1.default(true);
    new header_1.default(electron_1.remote);
    new flowchart_1.default();
};
//# sourceMappingURL=render.js.map