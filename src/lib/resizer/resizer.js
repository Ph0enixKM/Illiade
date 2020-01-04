
// Resizer Library - Gives the ability to make HTML Elements resizable

class Resizer {
    // [element] is the target element to resize
    // [resizer] is the element that you drag to resize
    // [x] boolean
    // [y] boolean
    // [on] callback function for resizing
    constructor(options) {
        if (options) {
            this.resizable = options.element
            this.resizer = options.resizer
            this.x = (options.x == null) ? true : options.x
            this.y = (options.y == null) ? true : options.y
            this.on = (options.on == null) ? () => {} : options.on
        }

        // Local variables
        this.startX = 0
        this.startY = 0
        this.startWidth = 0
        this.startHeight = 0

        resizer.addEventListener('mousedown', e => this.initDrag.bind(this)(e), false)
    }

    initDrag( e ) {
        if (this.x) {
            this.startX = e.clientX
            this.startWidth = parseInt(document.defaultView.getComputedStyle( this.resizable ).width, 10)
        }

        if (this.y) {
            this.startY = e.clientY
            this.startHeight = parseInt(document.defaultView.getComputedStyle( this.resizable ).height, 10)
        }

        let x = this.x
        let y = this.y
        let resizable = this.resizable
        let resizer = this.resizer
        let startWidth = this.startWidth
        let startHeight = this.startHeight
        let startX = this.startX
        let startY = this.startY
        let on = this.on
        
        function doDrag(e) {
            let deltaX = startWidth + e.clientX - startX
            let deltaY = startHeight + e.clientY - startY

            if (x) resizable.style.width = deltaX + 'px'
            if (y) resizable.style.height = deltaY + 'px'

            resizer.className = 'grabbed'
            on(deltaX, deltaY)
        }
        
        function stopDrag(e) {
            document.documentElement.removeEventListener('mousemove', doDrag, false)   
            document.documentElement.removeEventListener('mouseup', stopDrag, false)
            resizer.className = ''
        }

        document.documentElement.addEventListener('mousemove', doDrag, false)
        document.documentElement.addEventListener('mouseup', stopDrag, false)
    }

    // doDrag(e) {
    //     if (this.x) this.resizable.style.width = (this.startWidth + e.clientX - this.startX) + 'px'
    //     if (this.y) this.resizable.style.height = (this.startHeight + e.clientY - this.startY) + 'px'
    // }


    // stopDrag(e) {
    //     document.documentElement.removeEventListener('mousemove', this.doDrag.bind(this), false)   
    //     document.documentElement.removeEventListener('mouseup', this.stopDrag.bind(this), false)
    // }
}