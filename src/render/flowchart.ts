const THREE = global["3D"]  

import Controller from './flowchart/controller'

// Flowchart
export default class {

    private width: number
    private height: number

    private rows: number
    private columns: number
    private stroke: number

    private deltaX: number
    private deltaY: number

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private scene: any
    private camera: any
    private renderer: any
    private viewer: any
    private light: any
    
    constructor() {
        this.width = window.innerWidth
        this.height = window.innerHeight - 24
        this.canvas = document.querySelector('canvas#grid')

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true })
        this.camera = new THREE.PerspectiveCamera( 30, this.width / this.height, 0.1, 1000 )
        this.scene = new THREE.Scene()
        

        // Cube
        let geo = new THREE.BoxBufferGeometry(1, 1, 1)
        let mat = new THREE.MeshLambertMaterial({color: '#333'})
        let cube = new THREE.Mesh(geo, mat)
        let cube1 = new THREE.Mesh(geo, mat)
        let cube2 = new THREE.Mesh(geo, mat)
        cube.position.set(3, 1, 3)
        cube1.position.set(0, 0, 0)
        cube2.position.set(-2, -2, -4)
        this.scene.add(cube)
        this.scene.add(cube1)
        this.scene.add(cube2)
        // cube.rotation.x = 0.5
        // cube.rotation.y = 0.5

        let grid = new THREE.GridHelper(500, 1000, '#333', '#222')
        grid.geometry.rotateX( Math.PI / 2 );
        this.scene.add(grid)

        this.light = new THREE.PointLight('#fff', 2)
        this.viewer = new THREE.Object3D()
        this.viewer.add(this.light)
        this.viewer.add(this.camera)
        
        this.viewer.position.z = 10
        this.scene.add(this.viewer)

        let cont = new Controller(this.viewer)

        setInterval(() => {
            // Render Flow
            this.renderer.setClearColor('#2a2a2a')
            this.renderer.setSize(this.width, this.height)
            this.renderer.render(this.scene, this.camera)
            cont.update()
        }, 16)
        
    }
}