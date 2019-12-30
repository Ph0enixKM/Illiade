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
        for (const [key, callback] of this.callbacks.entries()) {
            callback(this.value, this.before)
            if (this.indexes[key].once) {
                this.indexes.splice(key, 1)
                this.callbacks.splice(key, 1)
            }
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

    // Sets a value just to trigger callbacks
    // Then reverts back to the default value
    // Without forcing to do any callbacks
    tick(given) {
        let revert = this.value
        this.value = given
        this.change()
        this.value = revert
    }

    // Observe the Variable till it changes once
    triggerOnce(given) {
        let callback = (_value, _before) => {}
        let index = {
            once: true,
            value: null
        }

        if (typeof given === 'function') {
            callback = given
        } else throw triggerWarn

        this.indexes.push(index)
        this.callbacks.push(callback)
    }

    // Observe the Variable
    trigger(given, optional) {
        let callback = (_value, _before) => {}
        let index = {
            once: false,
            value: null
        }

        if (typeof given === 'function') {
            callback = given
        }
        else if (typeof given === 'object') {
            index.value = given.id
            callback = given.fun
        }
        else if (typeof given === 'string' && typeof optional === 'function') {
            index.value = given
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
                if (index.value === id) {
                    this.indexes.splice(key, 1)
                    this.callbacks.splice(key, 1)
                    return true
                }
            }

            throw untriggerNullWarn + `: '${id}'`
        }

        else throw untriggerWarn
    }

    // --- ARRAY ---
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


    // --- OBJECT ---
    set(key, value) {
        this.value[key] = value
        this.change()
        this.before = this.value
        return this.value[key]
    }

    get(key) {
        return this.value[key]
    }
}


return Variable

})()