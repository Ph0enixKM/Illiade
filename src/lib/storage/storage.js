const storage = (() => {

class Storage {
    constructor() {
        this.hash = '$'
        this.token = 'PHX-TKN'
    }

    // Gets value
    get(id) {
        let raw = localStorage.getItem(`${this.hash}-${id}`)
        if (raw === null) return null
        return JSON.parse(raw).value
    }

    // Creates if non-existant
    create(id, value) {
        let raw = localStorage.getItem(`${this.hash}-${id}`)
        const record = { 
            name: 'Phoenix Storage', 
            version: '1.0.0', 
            token: this.token, 
            value 
        }
        
        if (raw === null) {
            localStorage.setItem(`${this.hash}-${id}`, JSON.stringify(record))
            return true
        }
        return false
    }

    // Overwrites value
    set(id, value) {
        const record = { 
            name: 'Phoenix Storage', 
            version: '1.0.0', 
            token: this.token, 
            value 
        }
        localStorage.setItem(`${this.hash}-${id}`, JSON.stringify(record))
    }

}


return new Storage()

})()