"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = global["3D"];
// Controller
class default_1 {
    constructor(viewer) {
        this.speed = 0.05;
        this.friction = 0.9;
        //   Velocity Vector          x  y
        this.velocity = [0, 0];
        //   Axis Matrix             W      A      S      D
        this.axis = [false, false, false, false];
        this.viewer = viewer;
        document.body.addEventListener('keydown', e => {
            if (e.key == 'w') {
                this.axis[0] = true;
            }
            else if (e.key == 'a') {
                this.axis[1] = true;
            }
            else if (e.key == 's') {
                this.axis[2] = true;
            }
            else if (e.key == 'd') {
                this.axis[3] = true;
            }
        });
        document.body.addEventListener('keyup', e => {
            if (e.key == 'w') {
                this.axis[0] = false;
            }
            else if (e.key == 'a') {
                this.axis[1] = false;
            }
            else if (e.key == 's') {
                this.axis[2] = false;
            }
            else if (e.key == 'd') {
                this.axis[3] = false;
            }
        });
    }
    update() {
        // Forward
        if (this.axis[0]) {
            this.velocity[1] = this.speed;
        }
        // Left
        if (this.axis[1]) {
            this.velocity[0] = -this.speed;
        }
        // Backward
        if (this.axis[2]) {
            this.velocity[1] = -this.speed;
        }
        // Right
        if (this.axis[3]) {
            this.velocity[0] = this.speed;
        }
        // Assign x axis velocity
        this.velocity[0] = (this.velocity[0] *
            this.friction);
        // Assign y axis velocity
        this.velocity[1] = (this.velocity[1] *
            this.friction);
        this.viewer.position.x += this.velocity[0];
        this.viewer.position.y += this.velocity[1];
    }
}
exports.default = default_1;
// Movement
//# sourceMappingURL=controller.js.map