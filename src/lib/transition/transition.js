// Linear transition controlling library.
// Attach some value to the controller
// in order to easily create transitions.

class Transition {
    constructor(value, time) {
        this.value = value
        this.interval = null
        this.sign = 0
        this.callback = (value) => {}
        this.time = time - (time % 10)
        this.laps = 0
        this.incr = 0
    }

    // Set a new value and
    // (optionally) time 
    // in milliseconds.
    set(value, time) {
        if (time) this.time = time - (time % 10)

        // Set the appropriate sign
        if (value == this.value) return
        if (value > this.value) this.sign = 1
        if (value < this.value) this.sign = -1

        this.laps = this.time / 10
        this.incr = Math.abs(this.value - value) / this.laps

        let count = 0
        clearInterval(this.interval)

        // Create Interval
        this.interval = setInterval(() => {
            // Break if finished
            if (count == this.laps - 1) {
                clearInterval(this.interval)
                this.interval = null

                // Optimize endpoint value
                // to be precisely what
                // developer desired
                this.value = value
                this.callback(value)
                return null
            }

            // Update value
            this.value += (this.sign * this.incr)

            

            // Run callback
            this.callback(this.value)
            count++
        }, 10)
    }
    
    // Get current value.
    get() {
        return this.value
    }

    // Tell what to do on update
    // callback parameter 
    // contains new value.
    update(callback) {
        this.callback = callback
    }
}