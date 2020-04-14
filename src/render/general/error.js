class SlikError {
    constructor() {
        this.element = $('#error')
        this.countdefine = 30
        this.countdown = 0
        this.queue = []
        this.busy = false
        setInterval(() => {
            if (this.queue.length) this.loop()
        }, 200)

        this.element.addEventListener('click', e => {
            navigator.clipboard.writeText($err.element.innerText).then(() => {}, (error) => {
                err.spawn('Couldn\'t copy to clipboard: ' + error)
            })
        })

        this.element.addEventListener('contextmenu', e => {
            this.queue[0][0] = 0
        })
    }

    spawn(title) {
        this.queue.push([this.countdefine, title, 'error'])
    }

    done(title) {
        this.queue.push([this.countdefine, title, 'done'])
    }

    reload() {
        this.element.style.bottom = '-250px'
        setTimeout(() => {
            if (this.queue.length) {
                this.element.innerHTML = this.queue[0][1]
                this.element.style.bottom = '30px'
                if (this.queue[0][2] == 'done') {
                    this.element.className = 'done'
                }
                else {
                    this.element.className = 'error'   
                }
            }
        }, 200)
    }

    loop() {
        if (this.queue[0][0] === this.countdefine) {
            this.element.innerHTML = this.queue[0][1]
            this.element.style.bottom = '30px'
            if (this.queue[0][2] == 'done') {
                this.element.className = 'done'
            }
            else {
                this.element.className = 'error'   
            }
        }

        if (this.queue[0][0] <= 0) {
            this.queue.shift()
            this.reload()
        }

        else {
            this.queue[0][0]--
        }
    }
}

window.$err = new SlikError()