
// Resizer Library - Gives the ability to make HTML Elements resizable

class Resizer {
    // [element] is the target element to resize
    // [resizer] is the element that you drag to resize
    // [x] boolean
    // [y] boolean
    // [on] callback function for resizing
    // [xLimits] array of range in which the size can be on x axis
    // [yLimits] array of range in which the size can be on y axis
    constructor(options) {
        if (options) {
            this.resizable = options.element
            this.resizer = options.resizer
            this.x = (options.x == null) ? true : options.x
            this.y = (options.y == null) ? true : options.y
            this.on = (options.on == null) ? () => {} : options.on
            this.on = (options.on == null) ? () => {} : options.on
            this.xLimits = (options.xLimits == null) ? [-Infinity, Infinity] : options.xLimits
            this.yLimits = (options.yLimits == null) ? [-Infinity, Infinity] : options.yLimits
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
        let xlimits = this.xLimits
        let ylimits = this.yLimits
        
        function doDrag(e) {
            let deltaX = startWidth + e.clientX - startX
            let deltaY = startHeight + e.clientY - startY

            if (deltaX > xlimits[1]) {
                deltaX = xlimits[1]
            }

            if (deltaX < xlimits[0]) {
                deltaX = xlimits[0]
            }

            if (deltaY > xlimits[1]) {
                deltaY = xlimits[1]
            }

            if (deltaY < xlimits[0]) {
                deltaY = xlimits[0]
            }

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
}