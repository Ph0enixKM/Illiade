const { Variable, List } = (() => {

const defaultWarn = 'Observable: Variable is being instantiated without a default value'
const triggerWarn = 'Observable: Invalid trigger input'
const untriggerWarn = 'Observable: ID must be a string'
const untriggerNullWarn = 'Observable: Couldn\'t untrigger - such observator not found'

// Main Class
class Core {
    
    constructor() {
        // Callbacks mechanics
        this.indexes = []
        this.callbacks = []
    }

    // Triger all observations
    change() {
        for (const callback of this.callbacks) {
            callback(this.value)
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
        return this.value
    }

    // Observe the Variable
    trigger(given, optional) {
        let index = null
        let callback = (_) => {}

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
}

// Variable Class
class Variable extends Core {
    constructor(initValue) {
        if (initValue == null) console.warn(defaultWarn)
        
        super()
        this.value = initValue
    }
}

// Array Class
class List extends Core {
    constructor(initValue) {
        if (initValue == null) initValue = []
        
        super()
        this.value = initValue
    }

    push(...given) {
        this.value.push(...given)
        this.change()
    }

    pop() {
        this.value.pop()
        this.change()
    }

    shift() {
        this.value.shift()
        this.change()
    }

    unshift(...given) {
        this.value.unshift(...given)
        this.change()
    }

    sort(given) {
        this.value.sort(given)
        this.change()
    }

    splice(...given) {
        this.value.splice(...given)
        this.change()
    }


}

return {
    Variable,
    List
}

})()