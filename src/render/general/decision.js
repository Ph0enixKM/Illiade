
// Decision interface

class Decision {
    constructor() {
        this.element = $('#decision')
        this.message = $('#decision .message')
        this.yes = $('#decision #yes')
        this.no = $('#decision #no')
        this.queue = []

        // Copy text when clicked
        this.message.addEventListener('click', e => {
            navigator.clipboard.writeText(decision.message.innerText).then(() => {}, (error) => {
                msg.error('Couldn\'t copy to clipboard: ' + error)
            })
        })

        // --> Answer "Yes" <--

        // When clicked on the button
        this.yes.addEventListener('mousedown', e => {
            this.decide(true)
        })

        // When used shortcut
        new Shortcut('CTRL Y', e => {
            this.decide(true)
        })

        // --> Answer "No" <--

        // When clicked on the button
        this.no.addEventListener('mousedown', e => {
            this.decide(false)
        })

        // When used shortcut
        new Shortcut('CTRL N', e => {
            this.decide(false)
        })
    }

    // Spawn a new
    // decision provided with
    // question and callback
    // which receives answer
    spawn(title, callback = (bool) => {console.log(bool)}) {
        const lenBefore = this.queue.length
        // Add decision to the queue
        this.queue.push([title, callback])
        if (!lenBefore) {
            this.reload()
        }
        return lenBefore
    }

    // Pass the answer
    // to the pending
    // decision
    decide(bool) {
        // When somehow decide block gets blocked
        if (!this.queue.length) {
            msg.error('No more decisions to answer left')
            this.element.classList.remove('on')
        }

        // Run the callback
        this.queue[0][1](bool)
        this.queue.shift()

        // Reload decision
        this.reload()
        return bool
    }

    // Wait for user to answer
    // and return the answer
    async ask(title) {
        return new Promise(res => {
            this.spawn(title, value => {
                res(value)
            })
        })
    }

    // Hide and soon after show
    // if there are more decisions
    // to show (reload like a gun)
    reload() {
        this.element.classList.remove('on')
        setTimeout(() => {
            if (this.queue.length) {
                this.message.innerHTML = this.queue[0][0]
                this.element.classList.add('on')
            }
        }, 200)
    }
}

window.decision = new Decision()