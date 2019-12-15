"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = global["3D"];
// Materia
class default_1 {
    constructor(position = [0, 0]) {
        this.geo = new THREE.BoxBufferGeometry(...position, 1);
        this.mat = new THREE.MeshLambertMaterial({ color: '#333' });
        this.mesh = new THREE.Mesh(this.geo, this.mat);
    }
}
exports.default = default_1;
//# sourceMappingURL=materia.js.map