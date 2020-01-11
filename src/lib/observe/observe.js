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
        this.value = initValue
        this.before = null
        this._observable = true
    }

    // Triger all observations
    change() {
        for (const [key, callback] of this.callbacks.entries()) {
            if (this.indexes[key].mustChange) {
                if (this.value === this.before) continue
            }
            callback(this.value, this.before)
            if (this.indexes[key].once) {
                this.indexes.splice(key, 1)
                this.callbacks.splice(key, 1)
            }
        }
    }

    // Set value silently
    set quiet(given) {
        this.before = this.value
        this.value = given
        return this.value
    }

    // Get value silently (deprecated)
    get quiet() {
        console.warn('The \'quiet\' getter is deprecated. Use \'val\' getter instead')
        return this.value
    }

    // Get value of the observable Variable
    get val() {
        return this.value
    }

    // Set value of the observable Variable
    set val(given) {
        this.before = this.value
        this.value = given
        this.change()
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

    // Observe the Variable till it's being set with a value once
    triggerOnce(given) {
        let callback = (_value, _before) => {}
        let index = {
            once: true,
            value: null,
            mustChange: false
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
            value: null,
            mustChange: false
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

    // Observe the change of variable
    diverses(given, optional) {
        let callback = (_value, _before) => {}
        let index = {
            once: false,
            value: null,
            mustChange: true
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

       // Observe the Variable till it changes once
       diversesOnce(given) {
        let callback = (_value, _before) => {}
        let index = {
            once: true,
            value: null,
            mustChange: true
        }

        if (typeof given === 'function') {
            callback = given
        } else throw triggerWarn

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
        this.before = this.value
        this.value.push(...given)
        this.change()
    }

    pop() {
        this.before = this.value
        this.value.pop()
        this.change()
    }

    shift() {
        this.before = this.value
        this.value.shift()
        this.change()
    }

    unshift(...given) {
        this.before = this.value
        this.value.unshift(...given)
        this.change()
    }

    sort(given) {
        this.before = this.value
        this.value.sort(given)
        this.change()
    }

    splice(...given) {
        this.before = this.value
        this.value.splice(...given)
        this.change()
    }


    // --- OBJECT ---
    set(key, value) {
        this.before = this.value
        this.value[key] = value
        this.change()
        return this.value[key]
    }

    get(key) {
        return this.value[key]
    }
}


return Variable

})()