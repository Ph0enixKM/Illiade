const Variable = (() => {

const defaultWarn = 'Observable: Variable is being instantiated without a default value'
const triggerWarn = 'Observable: Invalid trigger input'
const untriggerWarn = 'Observable: ID must be a string'
const untriggerNullWarn = 'Observable: Couldn\'t untrigger - such observator not found'

// Main Class
class Variable {
    
    constructor(initValue) {
        // Callbacks mechanics
        this.indexes = []
        this.callbacks = []

        if (initValue == null) console.warn(defaultWarn)
        this.value = initValue
        this.before = null
    }

    // Triger all observations
    change() {
        for (const callback of this.callbacks) {
            callback(this.value, this.before)
        }
    }

    // Get value of the observable Variable
    get val() {
        return this.value
    }

    // Set value of the observable Variable
    set val(given) {
        this.value = given
        this.change()
        this.before = this.value
        return this.value
    }

    // Observe the Variable
    trigger(given, optional) {
        let index = null
        let callback = (_value, _before) => {}

        if (typeof given === 'function') {
            callback = given
        }
        else if (typeof given === 'object') {
            index = given.id
            callback = given.fun
        }
        else if (typeof given === 'string' && typeof optional === 'function') {
            index = given
            callback = optional
        }
        else throw triggerWarn

        this.indexes.push(index)
        this.callbacks.push(callback)
    }

    // Remove observation of the Variable
    untrigger(id) {
        if (typeof id === 'string') {
            for (const [key, index] of this.indexes.entries()) {
                if (index === id) {
                    this.indexes.splice(key, 1)
                    this.callbacks.splice(key, 1)
                    return true
                }
            }

            throw untriggerNullWarn + `: '${id}'`
        }

        else throw untriggerWarn
    }

    push(...given) {
        this.value.push(...given)
        this.change()
        this.before = this.value
    }

    pop() {
        this.value.pop()
        this.change()
        this.before = this.value
    }

    shift() {
        this.value.shift()
        this.change()
        this.before = this.value
    }

    unshift(...given) {
        this.value.unshift(...given)
        this.change()
        this.before = this.value
    }

    sort(given) {
        this.value.sort(given)
        this.change()
        this.before = this.value
    }

    splice(...given) {
        this.value.splice(...given)
        this.change()
        this.before = this.value
    }
}


return Variable

})()